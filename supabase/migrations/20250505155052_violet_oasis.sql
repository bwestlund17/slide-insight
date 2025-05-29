/*
  # Reset Failed Scraping Jobs

  1. Changes
    - Reset failed scraping jobs back to pending status
    - Clear error messages
    - Schedule retries staggered over next 24 hours
    - Only affects jobs that failed

  2. Notes
    - Preserves job history by not deleting records
    - Staggers retries to prevent overwhelming the system
*/

UPDATE scraping_jobs
SET 
  status = 'pending',
  error = NULL,
  next_scheduled = now() + (random() * interval '24 hours'),
  started_at = NULL,
  completed_at = NULL,
  presentations_found = 0
WHERE status = 'failed';