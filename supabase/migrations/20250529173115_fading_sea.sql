/*
  # Optimize RLS Policies for Presentations Table

  1. Changes
    - Drop existing RLS policies
    - Recreate policies with optimized auth function calls using subqueries
    - Maintain same security rules but improve performance
    
  2. Security
    - Keep all policies restricted to authenticated users with admin role
    - Use subqueries for auth function calls to prevent per-row evaluation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow delete access to presentations for admin users" ON public.presentations;
DROP POLICY IF EXISTS "Allow update access to presentations for admin users" ON public.presentations;
DROP POLICY IF EXISTS "Allow insert access to presentations for admin users" ON public.presentations;

-- Recreate policies with optimized auth function calls using subqueries
CREATE POLICY "Allow delete access to presentations for admin users"
ON public.presentations
FOR DELETE
TO authenticated
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);

CREATE POLICY "Allow update access to presentations for admin users"
ON public.presentations
FOR UPDATE
TO authenticated
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
)
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);

CREATE POLICY "Allow insert access to presentations for admin users"
ON public.presentations
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);