/*
  # Optimize Delete Policy for Presentation Tags

  1. Changes
    - Drop existing delete policy
    - Recreate with optimized auth function call using subquery
    - Maintain same security rules while improving performance
*/

-- Drop existing delete policy
DROP POLICY IF EXISTS "Allow delete access to presentation tags for admin users" ON public.presentation_tags;

-- Recreate policy with optimized auth function call using subquery
CREATE POLICY "Allow delete access to presentation tags for admin users"
ON public.presentation_tags
FOR DELETE
TO authenticated
USING (
  (SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text
);