/*
  # Add Storage Integration

  1. New Columns
    - Add storage-related columns to presentations table
    - Track original file and thumbnail paths in storage
    
  2. Changes
    - Add storage_path for original presentation file
    - Add thumbnail_storage_path for presentation thumbnails
    - Maintain backwards compatibility with existing URL fields
*/

ALTER TABLE presentations 
ADD COLUMN IF NOT EXISTS storage_path text,
ADD COLUMN IF NOT EXISTS thumbnail_storage_path text;

-- Update the existing RLS policies to include new columns
ALTER POLICY "Allow read access to presentations for authenticated users" 
ON presentations USING (true);

ALTER POLICY "Allow update access to presentations for admin users" 
ON presentations USING (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
)
WITH CHECK (
  COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text) = 'admin'::text
);