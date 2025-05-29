/*
  # Consolidate Update Policies for Companies Table

  1. Changes
    - Drop existing update policies
    - Create single consolidated policy for authenticated users
    - Optimize auth function calls using subquery
    - Maintain same access rules (admin users and authenticated users)

  2. Security
    - Preserves existing access control rules
    - Uses optimized auth function calls
*/

-- Drop existing update policies
DROP POLICY IF EXISTS "Allow update access to companies for admin users" ON public.companies;
DROP POLICY IF EXISTS "Allow update access to companies for authenticated users" ON public.companies;

-- Create single consolidated update policy
CREATE POLICY "Allow update access to companies"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  -- Allow admin users or any authenticated user
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
  OR
  auth.uid() IS NOT NULL
)
WITH CHECK (
  -- Same conditions for the check clause
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
  OR
  auth.uid() IS NOT NULL
);