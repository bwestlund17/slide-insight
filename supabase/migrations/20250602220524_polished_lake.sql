/*
  # M&A Decks Schema

  1. New Tables
    - ma_decks: Stores M&A deck metadata
    - ma_slides: Stores individual slide information for each deck
    - ma_deck_tags: Maps tags to decks (many-to-many)
    - user_favorites: Tracks which decks users have favorited
    - deck_downloads: Tracks download statistics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for management operations

  3. Indexes
    - Add performance-optimized indexes for common queries
*/

-- M&A Decks Table
CREATE TABLE IF NOT EXISTS ma_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  subcategory text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  company_name text,
  company_logo_url text,
  thumbnail_url text,
  thumbnail_storage_path text,
  slide_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  file_formats text[] DEFAULT '{}',
  file_size text,
  is_premium boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  deal_value text,
  deal_date date,
  deal_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- M&A Slides Table
CREATE TABLE IF NOT EXISTS ma_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES ma_decks(id) ON DELETE CASCADE,
  slide_number integer NOT NULL,
  title text,
  description text,
  image_url text,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (deck_id, slide_number)
);

-- M&A Deck Tags Table
CREATE TABLE IF NOT EXISTS ma_deck_tags (
  deck_id uuid REFERENCES ma_decks(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (deck_id, tag)
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id uuid REFERENCES ma_decks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, deck_id)
);

-- Deck Downloads Table
CREATE TABLE IF NOT EXISTS deck_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES ma_decks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  downloaded_at timestamptz DEFAULT now(),
  file_format text,
  ip_address text,
  user_agent text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ma_decks_category ON ma_decks(category);
CREATE INDEX IF NOT EXISTS idx_ma_decks_company_id ON ma_decks(company_id);
CREATE INDEX IF NOT EXISTS idx_ma_decks_created_at ON ma_decks(created_at);
CREATE INDEX IF NOT EXISTS idx_ma_decks_download_count ON ma_decks(download_count);
CREATE INDEX IF NOT EXISTS idx_ma_decks_rating ON ma_decks(rating);
CREATE INDEX IF NOT EXISTS idx_ma_decks_deal_type ON ma_decks(deal_type);
CREATE INDEX IF NOT EXISTS idx_ma_slides_deck_id ON ma_slides(deck_id);
CREATE INDEX IF NOT EXISTS idx_ma_deck_tags_tag ON ma_deck_tags(tag);

-- Enable Row Level Security
ALTER TABLE ma_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ma_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ma_deck_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Ma_decks policies
CREATE POLICY "Allow public read access to ma_decks"
  ON ma_decks FOR SELECT USING (true);

CREATE POLICY "Allow insert access to ma_decks for admin users"
  ON ma_decks FOR INSERT TO authenticated
  WITH CHECK ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

CREATE POLICY "Allow update access to ma_decks for admin users"
  ON ma_decks FOR UPDATE TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text)
  WITH CHECK ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

CREATE POLICY "Allow delete access to ma_decks for admin users"
  ON ma_decks FOR DELETE TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

-- Ma_slides policies
CREATE POLICY "Allow public read access to ma_slides"
  ON ma_slides FOR SELECT USING (true);

CREATE POLICY "Allow insert access to ma_slides for admin users"
  ON ma_slides FOR INSERT TO authenticated
  WITH CHECK ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

CREATE POLICY "Allow update access to ma_slides for admin users"
  ON ma_slides FOR UPDATE TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text)
  WITH CHECK ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

CREATE POLICY "Allow delete access to ma_slides for admin users"
  ON ma_slides FOR DELETE TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

-- Ma_deck_tags policies
CREATE POLICY "Allow public read access to ma_deck_tags"
  ON ma_deck_tags FOR SELECT USING (true);

CREATE POLICY "Allow insert access to ma_deck_tags for admin users"
  ON ma_deck_tags FOR INSERT TO authenticated
  WITH CHECK ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

CREATE POLICY "Allow delete access to ma_deck_tags for admin users"
  ON ma_deck_tags FOR DELETE TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);

-- User_favorites policies
CREATE POLICY "Allow users to view their own favorites"
  ON user_favorites FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to add their own favorites"
  ON user_favorites FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to remove their own favorites"
  ON user_favorites FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Deck_downloads policies
CREATE POLICY "Allow public insertion of download records"
  ON deck_downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own downloads"
  ON deck_downloads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow admins to view all downloads"
  ON deck_downloads FOR SELECT TO authenticated
  USING ((SELECT COALESCE(((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text), 'user'::text)) = 'admin'::text);