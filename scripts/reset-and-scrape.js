import { supabase } from '../src/lib/supabase.js';
import { exec } from 'child_process';
import chalk from 'chalk';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Main function to reset the database and run the scraper
 */
async function main() {
  console.log(chalk.blue('Starting database reset and scraping process...'));
  
  try {
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
    
    // Step 3: Execute the web scraper to collect fresh data
    console.log(chalk.yellow('Step 3: Executing web scraper to collect fresh presentation data...'));
    console.log(chalk.blue('Running presentation-scraper.js...'));
    
    try {
      const { stdout, stderr } = await execPromise('node scripts/presentation-scraper.js');
      
      if (stderr) {
        console.warn(chalk.yellow(`Scraper warnings: ${stderr}`));
      }
      
      console.log(chalk.green('Web scraper execution completed.'));
      console.log(chalk.blue('Scraper output:'));
      console.log(stdout);
    } catch (scraperError) {
      throw new Error(`Scraper execution failed: ${scraperError.message}`);
    }
    
    // Step 4: Verify that new data was imported
    console.log(chalk.yellow('Step 4: Verifying data import...'));
    
    const { data: newData, error: newDataError, count: newCount } = await supabase
      .from('presentations')
      .select('*', { count: 'exact' });
    
    if (newDataError) {
      throw new Error(`Failed to verify data import: ${newDataError.message}`);
    }
    
    console.log(chalk.green(`Data import verification successful: ${newCount} new presentation records imported.`));
    
    if (newCount === 0) {
      console.log(chalk.yellow('Warning: No new presentation records were imported. The scraper may not have found any presentations.'));
    }
    
    console.log(chalk.green.bold('✓ Reset and scrape process completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Run the main function
main();