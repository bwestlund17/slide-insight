/*
  # Fix RLS policies for companies table

  1. Changes
    - Drop existing RLS policies
    - Create new policies with proper security checks
    - Add admin role check for write operations

  2. Security
    - Read access remains open to all authenticated users
    - Write operations (INSERT, UPDATE, DELETE) restricted to admin users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow insert access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow update access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow delete access to companies for authenticated users" ON companies;

-- Create new policies
CREATE POLICY "Allow read access to companies for authenticated users"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to companies for admin users"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow update access to companies for admin users"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow delete access to companies for admin users"
  ON companies
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');