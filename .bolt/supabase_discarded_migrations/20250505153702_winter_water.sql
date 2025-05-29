/*
  # Create scraping system tables

  1. New Tables
    - `scraping_jobs`
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `status` (text)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `error` (text)
      - `presentations_found` (int)
      - `next_scheduled` (timestamptz)
    
    - `companies`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `symbol` (text)
      - `website` (text)
      - `ir_url` (text)
      - `industry` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text UNIQUE NOT NULL,
  website text,
  ir_url text,
  industry text,
  created_at timestamptz DEFAULT now()
);

-- Scraping jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'success', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error text,
  presentations_found integer DEFAULT 0,
  next_scheduled timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow read access to scraping jobs for authenticated users" ON scraping_jobs;

-- Recreate policies
CREATE POLICY "Allow read access to companies for authenticated users"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to scraping jobs for authenticated users"
  ON scraping_jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_symbol ON companies(symbol);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_company_id ON scraping_jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);