/*
  # Optimize RLS Policies Performance

  1. Changes
    - Update RLS policies to use subselects for auth functions
    - Improve query performance by evaluating auth functions once per query
    - Maintain existing security rules while optimizing execution

  2. Security
    - No changes to security rules or access levels
    - Only optimizes how auth checks are performed
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow delete access to companies for admin users" ON public.companies;
DROP POLICY IF EXISTS "Allow update access to companies for admin users" ON public.companies;
DROP POLICY IF EXISTS "Allow insert access to companies for admin users" ON public.companies;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Allow delete access to companies for admin users"
ON public.companies
FOR DELETE
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);

CREATE POLICY "Allow update access to companies for admin users"
ON public.companies
FOR UPDATE
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
)
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);

CREATE POLICY "Allow insert access to companies for admin users"
ON public.companies
FOR INSERT
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);