/*
  # Add presentations table

  1. New Tables
    - `presentations`
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `company_symbol` (text)
      - `title` (text)
      - `date` (timestamptz)
      - `url` (text)
      - `file_type` (text)
      - `file_size` (text)
      - `slide_count` (integer)
      - `view_count` (integer)
      - `created_at` (timestamptz)
      - `summary` (text)
      - `thumbnail_url` (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    
  3. Relationships
    - Foreign key to companies table
    - Index on company_symbol for efficient lookups
*/

-- Create presentations table
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

-- Create presentation_tags table for many-to-many relationship
CREATE TABLE IF NOT EXISTS presentation_tags (
  presentation_id uuid REFERENCES presentations(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (presentation_id, tag)
);

-- Enable RLS
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_tags ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_presentations_company_symbol ON presentations(company_symbol);
CREATE INDEX IF NOT EXISTS idx_presentations_date ON presentations(date);
CREATE INDEX IF NOT EXISTS idx_presentation_tags_tag ON presentation_tags(tag);

-- Add RLS policies
CREATE POLICY "Allow read access to presentations for authenticated users"
  ON presentations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to presentation tags for authenticated users"
  ON presentation_tags
  FOR SELECT
  TO authenticated
  USING (true);

-- Add admin policies for write operations
CREATE POLICY "Allow insert access to presentations for admin users"
  ON presentations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  );

CREATE POLICY "Allow update access to presentations for admin users"
  ON presentations
  FOR UPDATE
  TO authenticated
  USING (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  )
  WITH CHECK (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  );

CREATE POLICY "Allow delete access to presentations for admin users"
  ON presentations
  FOR DELETE
  TO authenticated
  USING (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  );

-- Add similar policies for presentation_tags
CREATE POLICY "Allow insert access to presentation tags for admin users"
  ON presentation_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  );

CREATE POLICY "Allow delete access to presentation tags for admin users"
  ON presentation_tags
  FOR DELETE
  TO authenticated
  USING (
    COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
  );