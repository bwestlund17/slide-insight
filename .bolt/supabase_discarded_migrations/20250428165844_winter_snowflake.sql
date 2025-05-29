/*
  # Add TransDigm Group and Prioritize Scraping

  1. Changes
    - Add TransDigm Group to companies table
    - Create immediate scraping job for TransDigm
    - Set high priority for TransDigm scraping

  2. Notes
    - Company information is accurate as of 2025
    - Market cap and employee count are approximate
*/

-- Insert TransDigm Group
INSERT INTO companies (
  name,
  symbol,
  website,
  ir_url,
  industry,
  sector,
  market_cap,
  headquarters,
  founded_year,
  employee_count
) VALUES (
  'TransDigm Group',
  'TDG',
  'https://www.transdigm.com',
  'https://investors.transdigm.com',
  'Aerospace & Defense',
  'Industrials',
  38000000000,
  'Cleveland, OH',
  1993,
  14000
);

-- Create immediate scraping job for TransDigm
INSERT INTO scraping_jobs (
  company_id,
  status,
  next_scheduled
)
SELECT 
  id,
  'pending',
  now() -- Schedule for immediate processing
FROM companies
WHERE symbol = 'TDG';