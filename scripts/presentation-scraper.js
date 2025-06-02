import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { format, subMonths, isAfter, parse } from 'date-fns';
import pRetry from 'p-retry';
import PQueue from 'p-queue';
import robotsParser from 'robots-parser';
import chalk from 'chalk';
import winston from 'winston';
import { supabase } from '../src/lib/supabase.js';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'presentation-scraper.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Configuration
const CONFIG = {
  maxConcurrency: 2,         // Max concurrent scraping tasks
  maxRetries: 3,             // Max retries for failed requests
  retryDelay: 1000,          // Base delay between retries in ms
  userAgent: 'SlideInsight/1.0 (https://slideinsight.com; webmaster@slideinsight.com)', // Custom user-agent
  outputDir: './data/presentations',  // Output directory for scraped data
  requestDelay: 1500,        // Delay between requests to the same domain
  validFileTypes: ['.pdf', '.ppt', '.pptx'], // Valid presentation file types
  quarterCutoff: 4,          // Number of quarters back to scrape
  respectRobotsTxt: true,    // Whether to respect robots.txt
  requestTimeout: 30000,     // Timeout for network requests
  batchSize: 5               // Number of companies to process in one batch
};

// Queue for rate limiting
const queue = new PQueue({ concurrency: CONFIG.maxConcurrency });

/**
 * Main function to run the scraper
 */
async function main() {
  logger.info('Starting investor presentation scraper');
  
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Load companies from Supabase
    const companies = await loadCompaniesFromSupabase();
    
    if (companies.length === 0) {
      logger.error('No companies found with valid IR URLs');
      process.exit(1);
    }
    
    logger.info(`Found ${companies.length} companies to scrape`);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    // Create a stats object for tracking
    const stats = {
      startTime: new Date(),
      endTime: null,
      totalCompanies: companies.length,
      processedCompanies: 0,
      successfulCompanies: 0,
      failedCompanies: 0,
      totalPresentationsFound: 0,
      totalPresentationsSaved: 0,
      errors: []
    };
    
    try {
      // Process companies in batches to manage memory usage
      for (let i = 0; i < companies.length; i += CONFIG.batchSize) {
        const batch = companies.slice(i, i + CONFIG.batchSize);
        logger.info(`Processing batch ${Math.floor(i/CONFIG.batchSize) + 1} of ${Math.ceil(companies.length/CONFIG.batchSize)}`);
        
        const batchStats = await processCompanies(browser, batch);
        
        // Merge batch stats into global stats
        stats.processedCompanies += batchStats.processedCompanies;
        stats.successfulCompanies += batchStats.successfulCompanies;
        stats.failedCompanies += batchStats.failedCompanies;
        stats.totalPresentationsFound += batchStats.totalPresentationsFound;
        stats.totalPresentationsSaved += batchStats.totalPresentationsSaved;
        stats.errors = [...stats.errors, ...batchStats.errors];
        
        // Save intermediate results
        const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
        await saveStats(stats, `batch-${Math.floor(i/CONFIG.batchSize) + 1}-${timestamp}`);
        
        logger.info(`Batch ${Math.floor(i/CONFIG.batchSize) + 1} completed: ${batchStats.successfulCompanies} successful, ${batchStats.failedCompanies} failed, ${batchStats.totalPresentationsFound} presentations found`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Save final results
      stats.endTime = new Date();
      const duration = Math.round((stats.endTime - stats.startTime) / 1000 / 60); // in minutes
      
      logger.info(chalk.green(`Scraping completed in ${duration} minutes. Processed ${stats.processedCompanies}/${stats.totalCompanies} companies. Found ${stats.totalPresentationsFound} presentations.`));
      
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      await saveStats(stats, `final-${timestamp}`);
    } finally {
      await browser.close();
    }
  } catch (error) {
    logger.error(chalk.red(`Scraper failed: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Save stats to a JSON file
 */
async function saveStats(stats, filePrefix) {
  await fs.writeFile(
    path.join(CONFIG.outputDir, `${filePrefix}-stats.json`),
    JSON.stringify(stats, null, 2)
  );
}

/**
 * Load companies from Supabase database
 */
async function loadCompaniesFromSupabase() {
  try {
    // Fetch companies from Supabase
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, symbol, ir_url')
      .not('ir_url', 'is', null);
    
    if (error) throw error;
    
    // Filter out companies without valid IR URLs
    const validCompanies = data.filter(company => {
      try {
        new URL(company.ir_url);
        return true;
      } catch {
        logger.warn(`Invalid IR URL for ${company.name}: ${company.ir_url}`);
        return false;
      }
    });
    
    logger.info(`Loaded ${validCompanies.length} companies with valid IR URLs`);
    return validCompanies;
  } catch (error) {
    logger.error(`Failed to load companies from Supabase: ${error.message}`);
    throw error;
  }
}

/**
 * Process a batch of companies and return combined stats
 */
async function processCompanies(browser, companies) {
  const batchStats = {
    processedCompanies: 0,
    successfulCompanies: 0,
    failedCompanies: 0,
    totalPresentationsFound: 0,
    totalPresentationsSaved: 0,
    errors: []
  };
  
  for (const company of companies) {
    logger.info(chalk.blue(`Processing company: ${company.name} (${company.symbol})`));
    
    try {
      // Queue the company processing task with retries
      const companyResults = await queue.add(() => 
        pRetry(
          () => processCompany(browser, company),
          {
            retries: CONFIG.maxRetries,
            onFailedAttempt: error => {
              logger.warn(`Attempt ${error.attemptNumber} failed for ${company.name}. ${CONFIG.maxRetries - error.attemptNumber + 1} attempts left.`);
            }
          }
        )
      );
      
      batchStats.processedCompanies++;
      
      if (companyResults && companyResults.presentations && companyResults.presentations.length > 0) {
        batchStats.totalPresentationsFound += companyResults.presentations.length;
        batchStats.successfulCompanies++;
        
        // Save presentations to Supabase
        const savedCount = await savePresentationsToSupabase(companyResults.presentations, company);
        batchStats.totalPresentationsSaved += savedCount;
        
        logger.info(chalk.green(`Found ${companyResults.presentations.length} presentations for ${company.name}, saved ${savedCount}`));
      } else {
        logger.info(chalk.yellow(`No presentations found for ${company.name}`));
        batchStats.successfulCompanies++; // Still count as successful even if no presentations found
      }
    } catch (error) {
      logger.error(chalk.red(`Failed to process company ${company.name}: ${error.message}`));
      
      batchStats.failedCompanies++;
      batchStats.errors.push({
        company: company.name,
        symbol: company.symbol,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return batchStats;
}

/**
 * Process a single company
 */
async function processCompany(browser, company) {
  // Create a new page for each company to avoid cookie/session issues
  const page = await browser.newPage();
  
  try {
    // Set user agent
    await page.setUserAgent(CONFIG.userAgent);
    
    // Set request timeout
    page.setDefaultNavigationTimeout(CONFIG.requestTimeout);
    page.setDefaultTimeout(CONFIG.requestTimeout);
    
    // Check robots.txt before scraping if enabled
    if (CONFIG.respectRobotsTxt) {
      try {
        const robotsUrl = new URL('/robots.txt', company.ir_url).toString();
        const canScrape = await checkRobotsTxt(robotsUrl, CONFIG.userAgent);
        
        if (!canScrape) {
          logger.warn(chalk.yellow(`Skipping ${company.name} due to robots.txt restrictions`));
          return {
            company: {
              id: company.id,
              name: company.name,
              symbol: company.symbol
            },
            presentations: [],
            timestamp: new Date().toISOString(),
            skippedReason: 'robots.txt disallows scraping'
          };
        }
      } catch (error) {
        logger.warn(`Could not check robots.txt for ${company.name}: ${error.message}`);
        // Continue if robots.txt check fails
      }
    }
    
    // Navigate to IR page
    logger.info(`Navigating to ${company.ir_url}`);
    await page.goto(company.ir_url, { waitUntil: 'domcontentloaded', timeout: CONFIG.requestTimeout });
    
    // Wait for page to be interactive
    await page.waitForSelector('body');
    
    // Find potential presentation links
    const presentations = await findPresentations(page, company);
    
    return {
      company: {
        id: company.id,
        name: company.name,
        symbol: company.symbol
      },
      presentations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error processing ${company.name}: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

/**
 * Find presentations on a company's IR page
 */
async function findPresentations(page, company) {
  logger.info(`Searching for presentations for ${company.name}`);
  
  // Set up filters for the date range (last 4 quarters)
  const cutoffDate = subMonths(new Date(), CONFIG.quarterCutoff * 3);
  
  // First, try to find a dedicated presentations page
  const presentationsLinks = await page.$$eval('a', (links) => {
    return links
      .filter(link => {
        const text = (link.textContent || '').toLowerCase();
        const href = link.href || '';
        return (
          (text.includes('presentation') || 
           text.includes('event') || 
           text.includes('webcast') || 
           text.includes('conference') ||
           text.includes('slide')) && 
          href && 
          !href.includes('mailto:') && 
          !href.includes('javascript:')
        );
      })
      .map(link => ({
        href: link.href,
        text: link.textContent ? link.textContent.trim() : ''
      }));
  });
  
  let presentationsFound = [];
  
  // Navigate to the presentations page if found
  if (presentationsLinks.length > 0) {
    for (const link of presentationsLinks.slice(0, 3)) { // Check only the most relevant 3 links
      try {
        logger.info(`Navigating to potential presentations page: ${link.href}`);
        await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: CONFIG.requestTimeout });
        
        // Wait to ensure page is loaded
        await page.waitForTimeout(2000);
        
        // Extract presentations from this page
        const foundPresentations = await extractPresentationFiles(page, cutoffDate);
        
        if (foundPresentations.length > 0) {
          logger.info(`Found ${foundPresentations.length} presentations on ${link.text} page`);
          presentationsFound = [...presentationsFound, ...foundPresentations];
        }
      } catch (error) {
        logger.error(`Error navigating to ${link.href}: ${error.message}`);
        // Continue to the next link
      }
      
      // Add delay between requests
      await page.waitForTimeout(CONFIG.requestDelay);
    }
  }
  
  // If no presentations found yet, look for direct presentation links on the main page
  if (presentationsFound.length === 0) {
    logger.info(`No presentations found in dedicated sections, searching main page for ${company.name}`);
    try {
      await page.goto(company.ir_url, { waitUntil: 'domcontentloaded', timeout: CONFIG.requestTimeout });
      
      // Wait to ensure page is loaded
      await page.waitForTimeout(2000);
      
      const mainPagePresentations = await extractPresentationFiles(page, cutoffDate);
      if (mainPagePresentations.length > 0) {
        logger.info(`Found ${mainPagePresentations.length} presentations on main page`);
        presentationsFound = [...presentationsFound, ...mainPagePresentations];
      }
    } catch (error) {
      logger.error(`Error searching main page: ${error.message}`);
    }
  }
  
  // Remove duplicates based on URL
  const uniquePresentations = presentationsFound.filter((presentation, index, self) =>
    index === self.findIndex(p => p.url === presentation.url)
  );
  
  logger.info(`Found ${uniquePresentations.length} unique presentations for ${company.name}`);
  
  // Add company information to each presentation
  return uniquePresentations.map(presentation => ({
    ...presentation,
    companyId: company.id,
    companyName: company.name,
    companySymbol: company.symbol
  }));
}

/**
 * Extract presentation files from the current page
 */
async function extractPresentationFiles(page, cutoffDate) {
  // Find all links on the page
  const links = await page.$$eval('a', (links, validFileTypes) => {
    return links
      .map(link => {
        const href = link.href.toLowerCase();
        const isValidFileType = validFileTypes.some(ext => href.endsWith(ext));
        
        if (!isValidFileType) return null;
        
        // Get text from the link or its parent elements
        let title = link.textContent?.trim() || '';
        
        // If no title in the link itself, try to find it in nearby elements
        if (!title || title.length < 5) {
          // Try parent's text
          title = link.parentElement?.textContent?.trim() || '';
          
          // If still no good title, try sibling elements
          if (!title || title.length < 5) {
            const row = link.closest('tr') || link.closest('li') || link.closest('.row') || link.closest('div');
            if (row) {
              title = row.textContent?.trim() || '';
            }
          }
        }
        
        // Clean up the title
        title = title.replace(/\s+/g, ' ').trim();
        
        // Get date information from nearby elements
        let dateText = '';
        let dateElement = null;
        
        // Strategy 1: Look for date in the same row/container
        const row = link.closest('tr') || link.closest('li') || link.closest('.row') || link.closest('.item');
        if (row) {
          // Find elements that might contain dates
          const potentialDateElements = Array.from(row.querySelectorAll('span, div, td'))
            .filter(el => {
              const text = el.textContent || '';
              return /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/i.test(text);
            });
          
          if (potentialDateElements.length > 0) {
            dateElement = potentialDateElements[0];
            dateText = dateElement.textContent || '';
          } else {
            // If no specific date element, check the entire row text
            const rowText = row.textContent || '';
            const dateMatches = rowText.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi);
            if (dateMatches && dateMatches.length > 0) {
              dateText = dateMatches[0];
            }
          }
        }
        
        // Strategy 2: If no date found yet, check if the URL contains a date pattern
        if (!dateText) {
          const urlDateMatches = href.match(/\b\d{4}[-/]\d{2}[-/]\d{2}\b|\b\d{8}\b/);
          if (urlDateMatches && urlDateMatches.length > 0) {
            dateText = urlDateMatches[0];
          }
        }
        
        // Determine file format from the URL
        let fileFormat = '';
        if (href.endsWith('.pdf')) fileFormat = 'PDF';
        else if (href.endsWith('.ppt')) fileFormat = 'PPT';
        else if (href.endsWith('.pptx')) fileFormat = 'PPTX';
        
        return {
          url: link.href,
          title: title || link.href.split('/').pop() || 'Unknown Presentation',
          rawDate: dateText || '',
          fileFormat
        };
      })
      .filter(Boolean); // Remove null entries
  }, CONFIG.validFileTypes);
  
  // Process each link to get additional metadata and filter by date
  const presentations = [];
  
  for (const link of links) {
    try {
      // Parse the date from the raw text
      let publicationDate = parseDate(link.rawDate);
      
      // If no date found, try to extract from the URL or fallback to current date
      if (!publicationDate) {
        const urlDateMatch = link.url.match(/\b\d{4}[-/]\d{2}[-/]\d{2}\b|\b\d{8}\b/);
        if (urlDateMatch) {
          const dateStr = urlDateMatch[0];
          if (dateStr.length === 8) { // YYYYMMDD format
            publicationDate = new Date(
              parseInt(dateStr.substring(0, 4), 10),
              parseInt(dateStr.substring(4, 6), 10) - 1,
              parseInt(dateStr.substring(6, 8), 10)
            );
          } else {
            // Try to parse other formats
            publicationDate = parseDate(dateStr);
          }
        }
        
        // If still no date, use current date
        if (!publicationDate) {
          publicationDate = new Date();
        }
      }
      
      // Skip if the presentation is older than our cutoff
      if (!isAfter(publicationDate, cutoffDate)) {
        logger.debug(`Skipping old presentation: ${link.title} (${format(publicationDate, 'yyyy-MM-dd')})`);
        continue;
      }
      
      // Try to get the file size using a HEAD request
      let fileSize = 'Unknown';
      try {
        const response = await page.evaluate(async (url) => {
          try {
            const resp = await fetch(url, { 
              method: 'HEAD',
              mode: 'no-cors'
            });
            if (resp.ok) {
              const contentLength = resp.headers.get('content-length');
              return contentLength;
            }
          } catch (e) {
            return null;
          }
          return null;
        }, link.url);
        
        if (response) {
          // Convert bytes to KB or MB
          const bytes = parseInt(response, 10);
          if (!isNaN(bytes)) {
            if (bytes > 1024 * 1024) {
              fileSize = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
            } else {
              fileSize = `${(bytes / 1024).toFixed(1)} KB`;
            }
          }
        }
      } catch (error) {
        logger.debug(`Couldn't fetch file size for ${link.url}: ${error.message}`);
      }
      
      // Clean up the title - remove excess whitespace, file extensions, etc.
      let cleanTitle = link.title;
      CONFIG.validFileTypes.forEach(ext => {
        cleanTitle = cleanTitle.replace(new RegExp(`\\${ext}$`, 'i'), '');
      });
      cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
      
      // Skip if title is too generic or looks like a non-presentation
      const lowerTitle = cleanTitle.toLowerCase();
      if (
        lowerTitle.includes('press release') ||
        lowerTitle.includes('earnings release') ||
        lowerTitle.includes('annual report') ||
        lowerTitle.includes('10-k') ||
        lowerTitle.includes('10-q') ||
        lowerTitle.includes('form 8-k') ||
        lowerTitle.includes('proxy statement') ||
        lowerTitle === 'download' ||
        lowerTitle === 'view' ||
        lowerTitle.length < 5
      ) {
        logger.debug(`Skipping non-presentation content: ${lowerTitle}`);
        continue;
      }
      
      // Add the presentation to our results
      presentations.push({
        title: cleanTitle,
        url: link.url,
        publicationDate: format(publicationDate, 'yyyy-MM-dd'),
        fileFormat: link.fileFormat,
        fileSize,
        scrapedAt: new Date().toISOString()
      });
      
      logger.debug(`Found presentation: ${cleanTitle} (${link.fileFormat})`);
      
      // Add a small delay to avoid overwhelming the server
      await page.waitForTimeout(300);
    } catch (error) {
      logger.error(`Error processing link ${link.url}: ${error.message}`);
    }
  }
  
  // Sort by date (newest first)
  return presentations.sort((a, b) => {
    return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
  });
}

/**
 * Save presentations to Supabase
 */
async function savePresentationsToSupabase(presentations, company) {
  let savedCount = 0;
  
  for (const presentation of presentations) {
    try {
      // Check if the presentation already exists (based on URL to avoid duplicates)
      const { data: existingPresentations, error: checkError } = await supabase
        .from('presentations')
        .select('id')
        .eq('url', presentation.url)
        .maybeSingle();
      
      if (checkError) {
        logger.error(`Error checking for existing presentation: ${checkError.message}`);
        continue;
      }
      
      // Skip if the presentation already exists
      if (existingPresentations) {
        logger.debug(`Presentation already exists: ${presentation.title}`);
        continue;
      }
      
      // Prepare presentation data for insertion
      const presentationData = {
        company_id: company.id,
        company_symbol: company.symbol,
        title: presentation.title,
        date: presentation.publicationDate,
        url: presentation.url,
        file_type: presentation.fileFormat.toLowerCase(),
        file_size: presentation.fileSize,
        // We don't have slide count yet, would need to download and analyze
        slide_count: estimateSlideCount(presentation.title, presentation.fileSize),
        created_at: new Date().toISOString()
      };
      
      // Insert the presentation
      const { data, error } = await supabase
        .from('presentations')
        .insert(presentationData)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Log success and increment counter
      logger.info(`Saved presentation: ${presentation.title}`);
      savedCount++;
      
      // Add tags based on title analysis
      await addPresentationTags(data[0].id, presentation.title);
      
      // Update the company's scraping job status
      await updateScrapingJob(company.id, 1);
      
    } catch (error) {
      logger.error(`Error saving presentation ${presentation.title}: ${error.message}`);
    }
  }
  
  return savedCount;
}

/**
 * Add tags to a presentation based on title analysis
 */
async function addPresentationTags(presentationId, title) {
  const lowerTitle = title.toLowerCase();
  const tags = [];
  
  // Extract tags based on common terms in presentation titles
  if (lowerTitle.includes('q1') || lowerTitle.includes('first quarter')) {
    tags.push('Q1');
  } else if (lowerTitle.includes('q2') || lowerTitle.includes('second quarter')) {
    tags.push('Q2');
  } else if (lowerTitle.includes('q3') || lowerTitle.includes('third quarter')) {
    tags.push('Q3');
  } else if (lowerTitle.includes('q4') || lowerTitle.includes('fourth quarter')) {
    tags.push('Q4');
  }
  
  if (lowerTitle.includes('earnings')) {
    tags.push('Earnings');
  }
  
  if (lowerTitle.includes('investor day')) {
    tags.push('Investor Day');
  }
  
  if (lowerTitle.includes('conference')) {
    tags.push('Conference');
  }
  
  if (lowerTitle.includes('annual')) {
    tags.push('Annual');
  }
  
  if (lowerTitle.includes('strategic') || lowerTitle.includes('strategy')) {
    tags.push('Strategy');
  }
  
  if (lowerTitle.includes('financial')) {
    tags.push('Financial');
  }
  
  // Only proceed if we have tags to add
  if (tags.length === 0) {
    return;
  }
  
  try {
    // Insert tags
    const tagData = tags.map(tag => ({
      presentation_id: presentationId,
      tag
    }));
    
    const { error } = await supabase
      .from('presentation_tags')
      .insert(tagData);
    
    if (error) {
      logger.error(`Error adding tags to presentation ${presentationId}: ${error.message}`);
    } else {
      logger.debug(`Added tags to presentation ${presentationId}: ${tags.join(', ')}`);
    }
  } catch (error) {
    logger.error(`Error in addPresentationTags: ${error.message}`);
  }
}

/**
 * Update the scraping job status for a company
 */
async function updateScrapingJob(companyId, presentationsFound) {
  try {
    // Check if a scraping job already exists
    const { data: existingJob, error: checkError } = await supabase
      .from('scraping_jobs')
      .select('id, presentations_found')
      .eq('company_id', companyId)
      .maybeSingle();
    
    if (checkError) {
      logger.error(`Error checking for existing scraping job: ${checkError.message}`);
      return;
    }
    
    const nextScheduled = new Date();
    nextScheduled.setDate(nextScheduled.getDate() + 30); // Schedule next scrape in 30 days
    
    if (existingJob) {
      // Update the existing job
      const { error } = await supabase
        .from('scraping_jobs')
        .update({
          status: 'success',
          completed_at: new Date().toISOString(),
          presentations_found: existingJob.presentations_found + presentationsFound,
          next_scheduled: nextScheduled.toISOString()
        })
        .eq('id', existingJob.id);
      
      if (error) {
        logger.error(`Error updating scraping job: ${error.message}`);
      }
    } else {
      // Create a new job
      const { error } = await supabase
        .from('scraping_jobs')
        .insert({
          company_id: companyId,
          status: 'success',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          presentations_found: presentationsFound,
          next_scheduled: nextScheduled.toISOString()
        });
      
      if (error) {
        logger.error(`Error creating scraping job: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error(`Error in updateScrapingJob: ${error.message}`);
  }
}

/**
 * Estimate slide count based on presentation title and file size
 */
function estimateSlideCount(title, fileSize) {
  // Extract size in MB if possible
  let sizeInMB = 0;
  if (fileSize && fileSize.includes('MB')) {
    const match = fileSize.match(/(\d+(\.\d+)?)\s*MB/);
    if (match) {
      sizeInMB = parseFloat(match[1]);
    }
  } else if (fileSize && fileSize.includes('KB')) {
    const match = fileSize.match(/(\d+(\.\d+)?)\s*KB/);
    if (match) {
      sizeInMB = parseFloat(match[1]) / 1024;
    }
  }
  
  // Base estimate on file size (very rough approximation)
  // Typical PDF slides are 100-200KB each
  let estimatedCount = Math.round(sizeInMB * 10);
  
  // Adjust based on presentation type
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('quarterly') || lowerTitle.includes('earnings')) {
    // Quarterly presentations tend to be 20-40 slides
    estimatedCount = Math.max(estimatedCount, 25);
  } else if (lowerTitle.includes('investor day') || lowerTitle.includes('overview')) {
    // Investor day presentations tend to be longer, 40-80 slides
    estimatedCount = Math.max(estimatedCount, 50);
  }
  
  // Ensure a reasonable range
  return Math.min(Math.max(estimatedCount, 10), 100);
}

/**
 * Parse a date string in various formats
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  try {
    // Clean up the date string
    dateStr = dateStr.trim();
    
    // Try various date formats
    const formats = [
      'MM/dd/yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd', 
      'MMMM d, yyyy', 'MMM d, yyyy', 
      'MMMM yyyy', 'MMM yyyy',
      'MM/dd/yy', 'MM-dd-yy'
    ];
    
    for (const formatStr of formats) {
      try {
        const parsed = parse(dateStr, formatStr, new Date());
        if (parsed && !isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch (e) {
        // Try next format
      }
    }
    
    // If no format matches, try to extract year and month
    const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
    const monthMatch = dateStr.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/i);
    
    if (yearMatch && monthMatch) {
      const year = parseInt(yearMatch[0], 10);
      const month = new Date(`${monthMatch[0]} 1, 2000`).getMonth();
      
      return new Date(year, month, 1);
    } else if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      return new Date(year, 0, 1);
    }
    
    // Try numeric patterns like MM.DD.YYYY
    const numericMatch = dateStr.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/);
    if (numericMatch) {
      let [_, first, second, third] = numericMatch;
      
      // Handle 2-digit years
      if (third.length === 2) {
        third = parseInt(third, 10);
        third = third < 50 ? `20${third}` : `19${third}`;
      }
      
      // Try to determine if MM/DD/YYYY or DD/MM/YYYY
      // In the US, MM/DD/YYYY is more common
      if (parseInt(first, 10) <= 12) {
        // Assume MM/DD/YYYY
        return new Date(parseInt(third, 10), parseInt(first, 10) - 1, parseInt(second, 10));
      } else {
        // Assume DD/MM/YYYY
        return new Date(parseInt(third, 10), parseInt(second, 10) - 1, parseInt(first, 10));
      }
    }
    
    // Fallback to current date
    return null;
  } catch (error) {
    logger.debug(`Could not parse date: ${dateStr}`);
    return null;
  }
}

/**
 * Check robots.txt to ensure scraping is allowed
 */
async function checkRobotsTxt(robotsUrl, userAgent) {
  try {
    logger.debug(`Checking robots.txt at ${robotsUrl}`);
    
    const response = await fetch(robotsUrl, { timeout: 5000 });
    if (!response.ok) {
      logger.debug(`No robots.txt found at ${robotsUrl} or server error. Assuming scraping is allowed.`);
      return true;
    }
    
    const robotsTxt = await response.text();
    const robots = robotsParser(robotsUrl, robotsTxt);
    
    const parsedUrl = new URL(robotsUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    
    // Check if our user agent is allowed to access the site
    const isAllowed = robots.isAllowed(baseUrl, CONFIG.userAgent);
    
    if (!isAllowed) {
      logger.warn(chalk.yellow(`robots.txt disallows scraping of ${baseUrl} with our user agent`));
    }
    
    return isAllowed;
  } catch (error) {
    logger.error(`Error checking robots.txt at ${robotsUrl}: ${error.message}`);
    // In case of error, we'll be conservative and allow scraping
    return true;
  }
}

// Run the main function
main().catch(error => {
  logger.error(chalk.red(`Fatal error: ${error.message}`));
  console.error(error);
  process.exit(1);
});