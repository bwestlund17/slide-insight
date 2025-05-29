/*
  # Add Initial Scraping Jobs

  1. Changes
    - Add initial scraping jobs for companies without jobs
    - Set status to 'pending' for initial processing
    - Schedule jobs across different times to avoid overwhelming the system

  2. Notes
    - Only creates jobs for companies that don't have any existing jobs
    - Sets next_scheduled time staggered across the next 24 hours
*/

-- Insert scraping jobs for companies that don't have any
INSERT INTO scraping_jobs (company_id, status, next_scheduled)
SELECT 
  c.id,
  'pending',
  now() + (random() * interval '24 hours') -- Stagger jobs over 24 hours
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 
  FROM scraping_jobs sj 
  WHERE sj.company_id = c.id
);