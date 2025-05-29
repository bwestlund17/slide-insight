/*
  # Consolidate Companies Insert Policies

  1. Changes
    - Drop multiple redundant insert policies
    - Create single consolidated policy for insert operations
    - Optimize auth function calls using subquery
    - Maintain existing access control rules
*/

-- Drop existing insert policies
DROP POLICY IF EXISTS "Allow insert access to companies for admin users" ON public.companies;
DROP POLICY IF EXISTS "Allow insert access to companies for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for public.companies" ON public.companies;

-- Create single consolidated insert policy
CREATE POLICY "Allow insert access to companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow admin users or any authenticated user
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
  OR
  auth.uid() IS NOT NULL
);