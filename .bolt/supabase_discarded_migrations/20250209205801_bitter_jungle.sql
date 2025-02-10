/*
  # Add background image to valentine cards

  1. Changes
    - Add `background_image` column to `valentine_cards` table
      - Stores the URL of the card's background image
      - Optional field with no default value
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'valentine_cards' 
    AND column_name = 'background_image'
  ) THEN
    ALTER TABLE valentine_cards 
    ADD COLUMN background_image text;
  END IF;
END $$;