/*
  # Optimize Insert RLS Policy for Presentations

  1. Changes
    - Drop existing insert policy
    - Recreate with optimized auth function call using subquery
    - Maintain same security rules but improve performance
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow insert access to presentations for admin users" ON public.presentations;

-- Recreate policy with optimized auth function call using subquery
CREATE POLICY "Allow insert access to presentations for admin users"
ON public.presentations
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);