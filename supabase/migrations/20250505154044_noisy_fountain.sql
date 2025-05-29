/*
  # Initial Schema Setup

  1. New Tables
    - companies
    - scraping_jobs
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    
  3. Indexes
    - Add performance-optimized indexes
*/

-- Base tables
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text UNIQUE NOT NULL,
  website text,
  ir_url text,
  industry text,
  sector text,
  market_cap numeric,
  sub_industry text,
  founded_year integer,
  employee_count integer,
  headquarters text,
  cik text,
  fiscal_year_end text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT market_cap_positive CHECK (market_cap > 0),
  CONSTRAINT founded_year_valid CHECK (founded_year > 1600 AND founded_year <= EXTRACT(YEAR FROM CURRENT_DATE))
);

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_symbol ON companies(symbol);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_market_cap ON companies(market_cap);
CREATE INDEX IF NOT EXISTS idx_companies_cik ON companies(cik);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_company_id ON scraping_jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);

-- Add RLS policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Allow read access to companies for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access to companies for authenticated users"
      ON companies FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'scraping_jobs' AND policyname = 'Allow read access to scraping jobs for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access to scraping jobs for authenticated users"
      ON scraping_jobs FOR SELECT TO authenticated USING (true);
  END IF;
END $$;