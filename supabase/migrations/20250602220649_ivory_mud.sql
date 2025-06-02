/*
  # M&A Deck Helper Functions

  1. Changes
    - Add function to increment download count safely
    - Add function to calculate average rating
    - Add function to check if a deck is popular
*/

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(deck_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ma_decks 
  SET 
    download_count = download_count + 1,
    is_popular = CASE WHEN download_count + 1 >= 100 THEN TRUE ELSE is_popular END,
    updated_at = now()
  WHERE id = deck_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update rating
CREATE OR REPLACE FUNCTION update_deck_rating(deck_id UUID, new_rating INTEGER)
RETURNS VOID AS $$
DECLARE
  current_rating NUMERIC;
  current_count INTEGER;
  updated_rating NUMERIC;
BEGIN
  -- Get current values
  SELECT rating, rating_count INTO current_rating, current_count
  FROM ma_decks
  WHERE id = deck_id;
  
  -- Calculate new average rating
  IF current_count = 0 THEN
    updated_rating := new_rating;
  ELSE
    updated_rating := ((current_rating * current_count) + new_rating) / (current_count + 1);
  END IF;
  
  -- Update the deck
  UPDATE ma_decks
  SET
    rating = updated_rating,
    rating_count = rating_count + 1,
    updated_at = now()
  WHERE id = deck_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check and update popular status
-- This would typically run as a scheduled job
CREATE OR REPLACE FUNCTION update_popular_status()
RETURNS VOID AS $$
BEGIN
  UPDATE ma_decks
  SET 
    is_popular = TRUE,
    updated_at = now()
  WHERE 
    download_count >= 100 AND
    is_popular = FALSE;
END;
$$ LANGUAGE plpgsql;