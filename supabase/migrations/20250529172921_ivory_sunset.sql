/*
  # Optimize Presentations RLS Policies

  1. Changes
    - Drop existing RLS policies for presentations table
    - Recreate policies with optimized auth function calls using subqueries
    - Maintain same security rules but with better performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow delete access to presentations for admin users" ON public.presentations;
DROP POLICY IF EXISTS "Allow update access to presentations for admin users" ON public.presentations;
DROP POLICY IF EXISTS "Allow insert access to presentations for admin users" ON public.presentations;

-- Recreate policies with optimized auth function calls
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