/*
  # Fix RLS Policies for Valentine Cards

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create clear, specific policies for valentine_cards table
    - Ensure proper authentication checks
  
  2. Security
    - Enable RLS
    - Public read access for public cards
    - Authenticated users can manage their own cards
*/

-- Drop existing policies for valentine_cards
DROP POLICY IF EXISTS "Public cards are viewable by everyone" ON valentine_cards;
DROP POLICY IF EXISTS "Users can view own cards" ON valentine_cards;
DROP POLICY IF EXISTS "Users can create own cards" ON valentine_cards;
DROP POLICY IF EXISTS "Users can update own cards" ON valentine_cards;
DROP POLICY IF EXISTS "Users can delete own cards" ON valentine_cards;

-- Recreate policies with proper checks
CREATE POLICY "Public cards are viewable by everyone"
  ON valentine_cards
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own cards"
  ON valentine_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON valentine_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON valentine_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);