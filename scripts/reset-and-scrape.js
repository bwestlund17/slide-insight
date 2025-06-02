import { supabase } from '../src/lib/supabase.js';
import { exec } from 'child_process';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = promisify(exec);

// Configuration
const CONFIG = {
  rateLimit: 10, // requests per minute
  outputFormat: 'json',
  outputLocation: './data/scraping-results',
  maxRetries: 3,
  logLevel: 'info' // 'debug', 'info', 'warn', 'error'
};

/**
 * Main function to reset the database and run the scraper
 */
async function main() {
  const startTime = Date.now();
  
  console.log(chalk.blue('Starting database reset and scraping process...'));
  
  try {
    // Ensure output directory exists
    await fs.mkdir(CONFIG.outputLocation, { recursive: true });
    
    // Step 1: Delete all existing records from presentations table
    console.log(chalk.yellow('Step 1: Deleting all existing presentation records...'));
    
    const { error: deleteError, count } = await supabase
      .from('presentations')
      .delete()
      .neq('id', 'placeholder') // This is effectively a "delete all" since we're just saying "where id is not 'placeholder'"
      .select('count');
    
    if (deleteError) {
      throw new Error(`Failed to delete presentations: ${deleteError.message}`);
    }
    
    console.log(chalk.green(`Successfully deleted ${count} presentation records.`));
    
    // Step 2: Verify that the deletion was successful
    console.log(chalk.yellow('Step 2: Verifying deletion...'));
    
    const { data: remainingData, error: countError, count: remainingCount } = await supabase
      .from('presentations')
      .select('*', { count: 'exact' });
    
    if (countError) {
      throw new Error(`Failed to verify deletion: ${countError.message}`);
    }
    
    if (remainingCount > 0) {
      throw new Error(`Deletion verification failed. ${remainingCount} records still remain in the presentations table.`);
    }
    
    console.log(chalk.green('Verification successful: 0 records remain in the presentations table.'));
    
    // Step 3: Execute the web scraper with enhanced configuration
    console.log(chalk.yellow('Step 3: Executing web scraper to collect fresh presentation data...'));
    
    // Create environment variables for the scraper configuration
    const scraperEnv = {
      ...process.env,
      RATE_LIMIT: CONFIG.rateLimit.toString(),
      OUTPUT_FORMAT: CONFIG.outputFormat,
      OUTPUT_LOCATION: CONFIG.outputLocation,
      MAX_RETRIES: CONFIG.maxRetries.toString(),
      LOG_LEVEL: CONFIG.logLevel
    };
    
    console.log(chalk.blue(`Running presentation-scraper.js with rate limit of ${CONFIG.rateLimit} requests per minute...`));
    
    let scraperOutput = '';
    let scraperError = '';
    
    try {
      const { stdout, stderr } = await execPromise('node scripts/presentation-scraper.js', { 
        env: scraperEnv,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large output
      });
      
      scraperOutput = stdout;
      scraperError = stderr;
      
      if (stderr && stderr.trim().length > 0) {
        console.warn(chalk.yellow(`Scraper warnings: ${stderr}`));
      }
      
      console.log(chalk.green('Web scraper execution completed.'));
    } catch (scraperExecError) {
      throw new Error(`Scraper execution failed: ${scraperExecError.message}\n${scraperExecError.stderr || ''}`);
    }
    
    // Step 4: Verify that new data was imported and generate completion report
    console.log(chalk.yellow('Step 4: Verifying data import and generating report...'));
    
    const { data: newData, error: newDataError, count: newCount } = await supabase
      .from('presentations')
      .select('*', { count: 'exact' });
    
    if (newDataError) {
      throw new Error(`Failed to verify data import: ${newDataError.message}`);
    }
    
    // Calculate execution metrics
    const endTime = Date.now();
    const executionTimeMs = endTime - startTime;
    const executionTimeSec = Math.round(executionTimeMs / 1000);
    const executionTimeMin = Math.round(executionTimeSec / 60 * 10) / 10;
    
    // Parse scraper output for errors (if available in structured format)
    let scraperErrors = [];
    try {
      // Try to extract error information from scraper output
      if (scraperOutput.includes('errors')) {
        const scraperJson = JSON.parse(scraperOutput.substring(
          scraperOutput.indexOf('{'), 
          scraperOutput.lastIndexOf('}') + 1
        ));
        if (scraperJson.errors && Array.isArray(scraperJson.errors)) {
          scraperErrors = scraperJson.errors;
        }
      }
    } catch (parseError) {
      console.warn(chalk.yellow(`Could not parse scraper output for detailed errors: ${parseError.message}`));
    }
    
    // Generate completion report
    const report = {
      status: newCount > 0 ? 'SUCCESS' : 'WARNING',
      executionTime: {
        milliseconds: executionTimeMs,
        seconds: executionTimeSec,
        minutes: executionTimeMin
      },
      recordsProcessed: {
        deleted: count,
        imported: newCount
      },
      successRate: newCount > 0 ? '100%' : '0%',
      errors: scraperErrors.length > 0 ? scraperErrors : (scraperError ? [scraperError] : []),
      timestamp: new Date().toISOString()
    };
    
    // Save report
    const reportPath = path.join(CONFIG.outputLocation, `scrape-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Output report to console
    console.log(chalk.green.bold('\n✓ Reset and scrape process completed successfully!'));
    console.log(chalk.cyan.bold('\nCOMPLETION REPORT:'));
    console.log(chalk.cyan('----------------'));
    console.log(chalk.white(`Records processed: ${count} deleted, ${newCount} imported`));
    console.log(chalk.white(`Success rate: ${newCount > 0 ? '100%' : '0%'}`));
    console.log(chalk.white(`Total execution time: ${executionTimeMin} minutes (${executionTimeSec} seconds)`));
    
    if (scraperErrors.length > 0) {
      console.log(chalk.yellow('\nErrors encountered during scraping:'));
      scraperErrors.forEach((err, i) => {
        console.log(chalk.yellow(`${i+1}. ${typeof err === 'string' ? err : JSON.stringify(err)}`));
      });
    }
    
    console.log(chalk.cyan('\nDetailed report saved to:'), reportPath);
    
    if (newCount === 0) {
      console.log(chalk.yellow('\nWARNING: No new presentation records were imported. The scraper may not have found any presentations.'));
    }
    
  } catch (error) {
    console.error(chalk.red(`\nERROR: ${error.message}`));
    
    // Generate failure report
    const failureReport = {
      status: 'FAILED',
      executionTime: {
        milliseconds: Date.now() - startTime,
        seconds: Math.round((Date.now() - startTime) / 1000)
      },
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    try {
      const reportPath = path.join(CONFIG.outputLocation, `scrape-failure-${Date.now()}.json`);
      await fs.writeFile(reportPath, JSON.stringify(failureReport, null, 2));
      console.log(chalk.yellow(`Failure report saved to: ${reportPath}`));
    } catch (reportError) {
      console.error(chalk.red(`Failed to save failure report: ${reportError.message}`));
    }
    
    process.exit(1);
  }
}

// Run the main function
main();