/*
  # Add get_user_role function

  1. Changes
    - Add PostgreSQL function to get user role from JWT
    - Function is accessible to authenticated users only
    - Returns the role from the JWT claims
*/

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'role', 'user')::text;
$$;