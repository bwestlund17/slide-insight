/*
  # Create Initial Scraping Jobs

  1. Changes
    - Create initial scraping jobs for all companies
    - Set status to pending
    - Schedule initial scraping
*/

INSERT INTO scraping_jobs (
  company_id,
  status,
  started_at,
  completed_at,
  presentations_found,
  next_scheduled
)
SELECT 
  id as company_id,
  'pending' as status,
  now() as started_at,
  NULL as completed_at,
  0 as presentations_found,
  now() + (floor(random() * 24) || ' hours')::interval as next_scheduled
FROM companies
WHERE NOT EXISTS (
  SELECT 1 FROM scraping_jobs WHERE company_id = companies.id
);