/*
  # Fix RLS policies for companies table

  1. Changes
    - Drop all existing policies
    - Recreate policies with proper JWT claim checks
    - Add explicit type casting for role comparisons
    - Ensure consistent policy naming

  2. Security
    - Read access for all authenticated users
    - Write operations restricted to admin users only
    - Use proper JWT claim path and type casting
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow read access to companies for authenticated users" ON companies;
DROP POLICY IF EXISTS "Allow insert access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow update access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow delete access to companies for admin users" ON companies;

-- Recreate policies with correct JWT claim structure and type casting
CREATE POLICY "Allow read access to companies for authenticated users"
ON companies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to companies for admin users"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
);

CREATE POLICY "Allow update access to companies for admin users"
ON companies
FOR UPDATE
TO authenticated
USING (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
)
WITH CHECK (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
);

CREATE POLICY "Allow delete access to companies for admin users"
ON companies
FOR DELETE
TO authenticated
USING (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
);