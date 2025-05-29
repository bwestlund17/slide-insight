/*
  # Initial Schema Setup

  1. New Tables
    - companies
    - scraping_jobs
    - presentations
    - presentation_tags

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for write operations

  3. Indexes
    - Add indexes for commonly queried fields
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

CREATE TABLE IF NOT EXISTS presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  company_symbol text NOT NULL,
  title text NOT NULL,
  date timestamptz NOT NULL,
  url text NOT NULL,
  file_type text,
  file_size text,
  slide_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  summary text,
  thumbnail_url text,
  CONSTRAINT fk_company_symbol FOREIGN KEY (company_symbol) REFERENCES companies(symbol)
);

CREATE TABLE IF NOT EXISTS presentation_tags (
  presentation_id uuid REFERENCES presentations(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (presentation_id, tag)
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_tags ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_symbol ON companies(symbol);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_market_cap ON companies(market_cap);
CREATE INDEX IF NOT EXISTS idx_companies_cik ON companies(cik);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_company_id ON scraping_jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_presentations_company_symbol ON presentations(company_symbol);
CREATE INDEX IF NOT EXISTS idx_presentations_date ON presentations(date);
CREATE INDEX IF NOT EXISTS idx_presentation_tags_tag ON presentation_tags(tag);

-- Add RLS policies
DO $$ 
BEGIN
  -- Read policies
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

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'presentations' AND policyname = 'Allow read access to presentations for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access to presentations for authenticated users"
      ON presentations FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'presentation_tags' AND policyname = 'Allow read access to presentation tags for authenticated users'
  ) THEN
    CREATE POLICY "Allow read access to presentation tags for authenticated users"
      ON presentation_tags FOR SELECT TO authenticated USING (true);
  END IF;

  -- Admin write policies for companies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Allow insert access to companies for admin users'
  ) THEN
    CREATE POLICY "Allow insert access to companies for admin users"
      ON companies FOR INSERT TO authenticated
      WITH CHECK (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Allow update access to companies for admin users'
  ) THEN
    CREATE POLICY "Allow update access to companies for admin users"
      ON companies FOR UPDATE TO authenticated
      USING (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text)
      WITH CHECK (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Allow delete access to companies for admin users'
  ) THEN
    CREATE POLICY "Allow delete access to companies for admin users"
      ON companies FOR DELETE TO authenticated
      USING (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;

  -- Admin write policies for presentations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'presentations' AND policyname = 'Allow insert access to presentations for admin users'
  ) THEN
    CREATE POLICY "Allow insert access to presentations for admin users"
      ON presentations FOR INSERT TO authenticated
      WITH CHECK (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'presentations' AND policyname = 'Allow update access to presentations for admin users'
  ) THEN
    CREATE POLICY "Allow update access to presentations for admin users"
      ON presentations FOR UPDATE TO authenticated
      USING (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text)
      WITH CHECK (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'presentations' AND policyname = 'Allow delete access to presentations for admin users'
  ) THEN
    CREATE POLICY "Allow delete access to presentations for admin users"
      ON presentations FOR DELETE TO authenticated
      USING (COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text);
  END IF;
END $$;