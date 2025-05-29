/*
  # Optimize Presentation Tags RLS Policies

  1. Changes
    - Drop existing inefficient policies
    - Recreate policies with optimized auth function calls
    - Maintain same security rules while improving performance
    - Use subselects for auth function evaluation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow delete access to presentation tags for admin users" ON public.presentation_tags;
DROP POLICY IF EXISTS "Allow insert access to presentation tags for admin users" ON public.presentation_tags;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Allow delete access to presentation tags for admin users"
ON public.presentation_tags
FOR DELETE
TO authenticated
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);

CREATE POLICY "Allow insert access to presentation tags for admin users"
ON public.presentation_tags
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);