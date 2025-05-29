/*
  # Optimize Insert Policy for Presentation Tags

  1. Changes
    - Drop existing insert policy
    - Recreate with optimized auth function call using subquery
    - Maintain same security rules and permissions
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow insert access to presentation tags for admin users" ON public.presentation_tags;

-- Recreate policy with optimized auth function call using subquery
CREATE POLICY "Allow insert access to presentation tags for admin users"
ON public.presentation_tags
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);