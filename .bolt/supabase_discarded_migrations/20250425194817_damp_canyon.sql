/*
  # Fix Companies RLS Policies

  1. Changes
    - Update INSERT policy to use correct JWT claim structure
    - Update other policies to use consistent JWT claim structure
    
  2. Security
    - Maintains existing security model but fixes JWT claim access
    - Ensures admin users can properly manage companies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow update access to companies for admin users" ON companies;
DROP POLICY IF EXISTS "Allow delete access to companies for admin users" ON companies;

-- Recreate policies with correct JWT claim structure
CREATE POLICY "Allow insert access to companies for admin users"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Allow update access to companies for admin users"
ON companies
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'role' = 'admin')
WITH CHECK (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Allow delete access to companies for admin users"
ON companies
FOR DELETE
TO authenticated
USING (auth.jwt()->>'role' = 'admin');