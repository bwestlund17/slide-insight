import { supabase } from '../src/lib/supabase';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { format, subMonths, isAfter, parse } from 'date-fns';
import pRetry from 'p-retry';
import PQueue from 'p-queue';
import robotsParser from 'robots-parser';
import chalk from 'chalk';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'reset-and-scrape.log' })
  ]
});

// Configuration
const CONFIG = {
  maxConcurrency: 2,         // Max concurrent scraping tasks
  maxRetries: 3,             // Max retries for failed requests
  retryDelay: 1000,          // Base delay between retries in ms
  userAgent: 'SlideInsight/1.0 (https://slideinsight.com; webmaster@slideinsight.com)', // Custom user-agent
  outputDir: './data',       // Output directory for scraped data
  requestDelay: 1000,        // Delay between requests to the same domain
  validFileTypes: ['.pdf', '.ppt', '.pptx'], // Valid presentation file types
  quarterCutoff: 4           // Number of quarters back to scrape
};

// Queue for rate limiting
const queue = new PQueue({ concurrency: CONFIG.maxConcurrency });

/**
 * Main function to run the reset and scrape process
 */
async function main() {
  try {
    logger.info(chalk.blue('Starting reset and scrape process'));
    
    // Step 1: Delete all existing records from the presentations table
    await resetDatabase();
    
    // Step 2: Verify that the deletion was successful
    await verifyDatabaseReset();
    
    // Step 3: Execute the web scraper to collect fresh presentation data
    await runScraper();
    
    logger.info(chalk.green('Reset and scrape process completed successfully'));
  } catch (error) {
    logger.error(chalk.red(`Reset and scrape process failed: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Reset the database by deleting all records from the presentations table
 */
async function resetDatabase() {
  try {
    logger.info(chalk.yellow('Deleting all existing records from the presentations table...'));
    
    // First delete all presentation tags
    const { error: tagsError } = await supabase
      .from('presentation_tags')
      .delete()
      .neq('presentation_id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (tagsError) {
      throw new Error(`Failed to delete presentation tags: ${tagsError.message}`);
    }
    
    logger.info('Successfully deleted all presentation tags');
    
    // Then delete all presentations
    const { error: presentationsError } = await supabase
      .from('presentations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (presentationsError) {
      throw new Error(`Failed to delete presentations: ${presentationsError.message}`);
    }
    
    logger.info(chalk.green('Successfully deleted all presentations'));
  } catch (error) {
    logger.error(`Error resetting database: ${error.message}`);
    throw error;
  }
}

/**
 * Verify that the database reset was successful
 */
async function verifyDatabaseReset() {
  try {
    logger.info('Verifying that all records have been deleted...');
    
    // Check presentations table
    const { count: presentationCount, error: presentationError } = await supabase
      .from('presentations')
      .select('*', { count: 'exact', head: true });
    
    if (presentationError) {
      throw new Error(`Failed to verify presentations: ${presentationError.message}`);
    }
    
    if (presentationCount && presentationCount > 0) {
      throw new Error(`Database reset failed: ${presentationCount} presentations still exist`);
    }
    
    // Check presentation_tags table
    const { count: tagCount, error: tagError } = await supabase
      .from('presentation_tags')
      .select('*', { count: 'exact', head: true });
    
    if (tagError) {
      throw new Error(`Failed to verify presentation tags: ${tagError.message}`);
    }
    
    if (tagCount && tagCount > 0) {
      throw new Error(`Database reset failed: ${tagCount} presentation tags still exist`);
    }
    
    logger.info(chalk.green('Database reset verification successful: 0 records remain'));
  } catch (error) {
    logger.error(`Error verifying database reset: ${error.message}`);
    throw error;
  }
}

/**
 * Run the web scraper to collect fresh presentation data
 */
async function runScraper() {
  try {
    logger.info(chalk.blue('Starting web scraper to collect fresh presentation data...'));
    
    // Create output directory if it doesn't exist
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Load companies from Supabase
    const companies = await loadCompaniesFromSupabase();
    
    if (companies.length === 0) {
      throw new Error('No companies found with valid IR URLs');
    }
    
    logger.info(`Found ${companies.length} companies to scrape`);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
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
      // Process companies
      const results = await processCompanies(browser, companies, stats);
      
      // Save final results
      stats.endTime = new Date();
      const duration = Math.round((stats.endTime.getTime() - stats.startTime.getTime()) / 1000 / 60); // in minutes
      
      logger.info(chalk.green(`Scraping completed in ${duration} minutes. Processed ${stats.processedCompanies}/${stats.totalCompanies} companies. Found ${stats.totalPresentationsFound} presentations.`));
      
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      await fs.writeFile(
        path.join(CONFIG.outputDir, `scrape-results-${timestamp}.json`),
        JSON.stringify(stats, null, 2)
      );
    } finally {
      await browser.close();
    }
  } catch (error) {
    logger.error(`Error running scraper: ${error.message}`);
    throw error;
  }
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
 * Process all companies and return combined results
 */
async function processCompanies(browser, companies, stats) {
  for (const company of companies) {
    logger.info(chalk.blue(`Processing company: ${company.name} (${company.symbol})`));
    
    try {
      // Queue the company processing task with retries
      const companyResult = await queue.add(() => 
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
      
      stats.processedCompanies++;
      
      if (companyResult && companyResult.presentations && companyResult.presentations.length > 0) {
        stats.totalPresentationsFound += companyResult.presentations.length;
        stats.successfulCompanies++;
        
        // Save presentations to Supabase
        const savedCount = await savePresentationsToSupabase(companyResult.presentations, company);
        stats.totalPresentationsSaved += savedCount;
        
        logger.info(chalk.green(`Found ${companyResult.presentations.length} presentations for ${company.name}, saved ${savedCount}`));
      } else {
        logger.info(chalk.yellow(`No presentations found for ${company.name}`));
        stats.successfulCompanies++; // Still count as successful even if no presentations found
      }
    } catch (error) {
      logger.error(chalk.red(`Failed to process company ${company.name}: ${error.message}`));
      
      stats.failedCompanies++;
      stats.errors.push({
        company: company.name,
        symbol: company.symbol,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return stats;
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
    
    // Check robots.txt before scraping
    const robotsUrl = new URL('/robots.txt', company.ir_url).toString();
    const canScrape = await checkRobotsTxt(robotsUrl, CONFIG.userAgent);
    
    if (!canScrape) {
      logger.warn(chalk.yellow(`Skipping ${company.name} due to robots.txt restrictions`));
      throw new Error('Robots.txt disallows scraping this site');
    }
    
    // Navigate to IR page
    logger.info(`Navigating to ${company.ir_url}`);
    await page.goto(company.ir_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to be interactive
    await page.waitForSelector('body');
    
    // Find potential presentation links
    const presentations = await findPresentations(page, company);
    
    return {
      company: {
        id: company.id,
        name: company.name,
        symbol: company.symbol,
        ir_url: company.ir_url
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
        const text = link.textContent?.toLowerCase() || '';
        const href = link.href || '';
        return (
          (text.includes('presentation') || 
           text.includes('investor') || 
           text.includes('event') || 
           text.includes('webcast')) && 
          href && 
          !href.includes('mailto:') && 
          !href.includes('javascript:')
        );
      })
      .map(link => link.href);
  });
  
  let presentationsFound = [];
  
  // Navigate to the presentations page if found
  if (presentationsLinks.length > 0) {
    for (const link of presentationsLinks.slice(0, 2)) { // Check only the most relevant 2 links
      try {
        logger.info(`Navigating to potential presentations page: ${link}`);
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Wait to ensure page is loaded
        await page.waitForTimeout(2000);
        
        const foundPresentations = await extractPresentationFiles(page, cutoffDate);
        presentationsFound = presentationsFound.concat(foundPresentations);
        
        // If we found presentations, stop checking other links
        if (foundPresentations.length > 0) {
          break;
        }
      } catch (error) {
        logger.error(`Error navigating to ${link}: ${error.message}`);
        // Continue to the next link
      }
    }
  }
  
  // If no presentations found yet, look for direct presentation links on the main page
  if (presentationsFound.length === 0) {
    logger.info(`No dedicated presentations page found for ${company.name}, searching main page`);
    await page.goto(company.ir_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const mainPagePresentations = await extractPresentationFiles(page, cutoffDate);
    presentationsFound = presentationsFound.concat(mainPagePresentations);
  }
  
  // Add company information to each presentation
  return presentationsFound.map(presentation => ({
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
      .filter(link => {
        const href = link.href.toLowerCase();
        return validFileTypes.some(ext => href.endsWith(ext));
      })
      .map(link => {
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
        const row = link.closest('tr') || link.closest('li') || link.closest('.row') || link.closest('div');
        if (row) {
          // Look for date patterns in the row text
          const rowText = row.textContent || '';
          const dateMatches = rowText.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/g);
          if (dateMatches && dateMatches.length > 0) {
            dateText = dateMatches[0];
          }
        }
        
        // Determine file format from the URL
        let fileFormat = 'Unknown';
        if (link.href.toLowerCase().endsWith('.pdf')) fileFormat = 'PDF';
        else if (link.href.toLowerCase().endsWith('.ppt')) fileFormat = 'PPT';
        else if (link.href.toLowerCase().endsWith('.pptx')) fileFormat = 'PPTX';
        
        return {
          url: link.href,
          title: title || link.href.split('/').pop() || 'Unknown Presentation',
          rawDate: dateText || '',
          fileFormat
        };
      });
  }, CONFIG.validFileTypes);
  
  // Process each link to get additional metadata and filter by date
  const presentations = [];
  
  for (const link of links) {
    try {
      // Parse the date from the raw text
      let publicationDate = parseDate(link.rawDate);
      
      // If no date found, use the current date as a fallback
      if (!publicationDate) {
        publicationDate = new Date();
      }
      
      // Skip if the presentation is older than our cutoff
      if (!isAfter(publicationDate, cutoffDate)) {
        logger.debug(`Skipping old presentation: ${link.title} (${format(publicationDate, 'yyyy-MM-dd')})`);
        continue;
      }
      
      // Try to get the file size
      let fileSize = 'Unknown';
      try {
        const response = await page.evaluate(async (url) => {
          const resp = await fetch(url, { method: 'HEAD' });
          if (resp.ok) {
            const contentLength = resp.headers.get('content-length');
            return contentLength;
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
        lowerTitle.includes('form 10-') ||
        lowerTitle.includes('proxy statement') ||
        lowerTitle === 'download' ||
        lowerTitle === 'view' ||
        lowerTitle.length < 5
      ) {
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
    const response = await fetch(robotsUrl);
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