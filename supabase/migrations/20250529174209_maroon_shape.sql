/*
  # Consolidate Companies Delete Policies

  1. Changes
    - Drop multiple permissive delete policies
    - Create single consolidated delete policy
    - Optimize auth function calls using subquery
    
  2. Security
    - Maintain same level of access control
    - Use optimized auth function evaluation
*/

-- Drop existing delete policies
DROP POLICY IF EXISTS "Allow delete access to companies for admin users" ON public.companies;
DROP POLICY IF EXISTS "Allow delete access to companies for authenticated users" ON public.companies;

-- Create single consolidated delete policy
CREATE POLICY "Allow delete access to companies"
ON public.companies
FOR DELETE
TO authenticated
USING (
  -- Allow admin users or any authenticated user
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
  OR
  auth.uid() IS NOT NULL
);