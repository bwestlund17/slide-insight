import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { format, subMonths } from 'date-fns';
import pRetry from 'p-retry';
import PQueue from 'p-queue';
import chalk from 'chalk';
import winston from 'winston';
import { supabase } from '../src/lib/supabase.js';

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
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'ir-scanner.log' })
  ]
});

// Configuration
const CONFIG = {
  maxConcurrency: 2,         // Max concurrent scanning tasks
  maxRetries: 3,             // Max retries for failed requests
  retryDelay: 1000,          // Base delay between retries in ms
  userAgent: 'SlideInsight/1.0 (https://slideinsight.com; webmaster@slideinsight.com)', // Custom user-agent
  outputDir: './data',       // Output directory for scraped data
  requestDelay: 1000,        // Delay between requests to the same domain
  validFileTypes: ['.pdf', '.ppt', '.pptx'], // Valid presentation file types
  quarterCutoff: 4           // Number of quarters back to scan
};

// Queue for rate limiting
const queue = new PQueue({ concurrency: CONFIG.maxConcurrency });

/**
 * Main function to run the scanner
 */
async function main() {
  logger.info('Starting IR website scanner');
  
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Load companies from Supabase
    const companies = await loadCompaniesFromSupabase();
    
    logger.info(`Found ${companies.length} companies to scan`);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      // Process companies
      const results = await processCompanies(browser, companies);
      
      // Save results to JSON
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
      await fs.writeFile(
        path.join(CONFIG.outputDir, `ir-scan-results-${timestamp}.json`),
        JSON.stringify(results, null, 2)
      );
      
      logger.info(chalk.green(`Scanning completed successfully. Results saved to ir-scan-results-${timestamp}.json`));
    } finally {
      await browser.close();
    }
  } catch (error) {
    logger.error(chalk.red(`Scanner failed: ${error.message}`));
    console.error(error);
    process.exit(1);
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
    return data.filter(company => {
      try {
        new URL(company.ir_url);
        return true;
      } catch {
        logger.warn(`Invalid IR URL for ${company.name}: ${company.ir_url}`);
        return false;
      }
    });
  } catch (error) {
    logger.error(`Failed to load companies from Supabase: ${error.message}`);
    throw error;
  }
}

/**
 * Process all companies and return combined results
 */
async function processCompanies(browser, companies) {
  const results = {
    timestamp: new Date().toISOString(),
    totalCompanies: companies.length,
    successfulCompanies: 0,
    failedCompanies: 0,
    sitesFound: 0,
    errors: []
  };
  
  for (const company of companies) {
    logger.info(chalk.blue(`Scanning website for: ${company.name} (${company.symbol})`));
    
    try {
      // Queue the company processing task with retries
      const companyResult = await queue.add(() => 
        pRetry(
          () => scanCompanyWebsite(browser, company),
          {
            retries: CONFIG.maxRetries,
            onFailedAttempt: error => {
              logger.warn(`Attempt ${error.attemptNumber} failed for ${company.name}. ${CONFIG.maxRetries - error.attemptNumber + 1} attempts left.`);
            }
          }
        )
      );
      
      if (companyResult) {
        results.sitesFound++;
        results.successfulCompanies++;
        
        logger.info(chalk.green(`Successfully scanned website for ${company.name}`));
      }
    } catch (error) {
      logger.error(chalk.red(`Failed to scan website for ${company.name}: ${error.message}`));
      
      results.failedCompanies++;
      results.errors.push({
        company: company.name,
        symbol: company.symbol,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return results;
}

/**
 * Scan a company's investor relations website
 */
async function scanCompanyWebsite(browser, company) {
  // Create a new page for each company
  const page = await browser.newPage();
  
  try {
    // Set user agent
    await page.setUserAgent(CONFIG.userAgent);
    
    // Navigate to IR page
    logger.info(`Navigating to ${company.ir_url}`);
    await page.goto(company.ir_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to be interactive
    await page.waitForSelector('body');
    
    // Extract information about the website structure
    const siteInfo = await extractSiteInfo(page, company);
    
    return {
      company: {
        id: company.id,
        name: company.name,
        symbol: company.symbol,
        ir_url: company.ir_url
      },
      websiteInfo: siteInfo,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error scanning ${company.name} website: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

/**
 * Extract information about the IR website structure
 */
async function extractSiteInfo(page, company) {
  logger.info(`Analyzing website structure for ${company.name}`);
  
  // Extract all links on the page
  const links = await page.$$eval('a', (links) => {
    return links
      .map(link => ({
        text: link.innerText.trim(),
        href: link.href,
        classes: link.className
      }))
      .filter(link => link.href && !link.href.includes('javascript:') && !link.href.includes('mailto:'));
  });
  
  // Find potential presentation sections
  const presentationLinks = links.filter(link => {
    const text = link.text.toLowerCase();
    return (
      text.includes('presentation') ||
      text.includes('investor') ||
      text.includes('webcast') ||
      text.includes('slide')
    );
  });
  
  // Find common file types
  const fileLinks = links.filter(link => {
    const href = link.href.toLowerCase();
    return CONFIG.validFileTypes.some(ext => href.endsWith(ext));
  });
  
  // Find potential events/calendar pages
  const eventLinks = links.filter(link => {
    const text = link.text.toLowerCase();
    return (
      text.includes('event') ||
      text.includes('calendar') ||
      text.includes('webcast') ||
      text.includes('conference')
    );
  });
  
  // Get page meta information
  const pageTitle = await page.title();
  const metaDescription = await page.$eval('meta[name="description"]', meta => meta.content).catch(() => '');
  
  return {
    title: pageTitle,
    description: metaDescription,
    potentialPresentationSections: presentationLinks.map(link => ({
      text: link.text,
      url: link.href
    })),
    fileLinksCount: fileLinks.length,
    eventSections: eventLinks.map(link => ({
      text: link.text,
      url: link.href
    }))
  };
}

// Run the main function
main().catch(error => {
  logger.error(chalk.red(`Fatal error: ${error.message}`));
  console.error(error);
  process.exit(1);
});