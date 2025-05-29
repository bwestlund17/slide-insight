/*
  # Configure Edge Functions Environment

  1. Changes
    - Set up environment variables for Edge Functions
    - Ensure proper authentication configuration
*/

-- Create or update Edge Function configuration
DO $$
BEGIN
  -- Set environment variables for Edge Functions
  PERFORM set_config('app.settings.edge_function_url', 'https://fojhhegtfbtltbghgtey.supabase.co', false);
  PERFORM set_config('app.settings.edge_function_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvamhoZWd0ZmJ0bHRiZ2hndGV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTU5MjgzMiwiZXhwIjoyMDYxMTY4ODMyfQ.3S2L7r7b0kvHZyq2H3Dy6YyMANm9ccRW9BoLSpwxIFA', false);
END $$;