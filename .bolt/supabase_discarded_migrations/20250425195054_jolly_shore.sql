/*
  # Fix Companies RLS Policies

  1. Changes
    - Drop and recreate all RLS policies with correct JWT claim structure
    - Ensure proper access for admin users
    - Maintain read access for all authenticated users
    
  2. Security
    - Read access for all authenticated users
    - Write operations restricted to admin users only
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow read access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow insert access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow update access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow delete access to companies for admin users" ON companies;

-- Recreate policies with correct JWT claim structure
CREATE POLICY "Allow read access to companies for authenticated users"
ON companies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to companies for admin users"
ON companies
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Allow update access to companies for admin users"
ON companies
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin')
WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Allow delete access to companies for admin users"
ON companies
FOR DELETE
TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin');