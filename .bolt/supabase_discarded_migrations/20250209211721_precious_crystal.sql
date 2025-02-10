/*
  # Add public access policy for valentine cards

  1. Changes
    - Add policy to allow public read access to all cards
    
  2. Security
    - Maintains existing policies for authenticated users
    - Adds new policy for public read access
*/

-- Add policy for public read access
CREATE POLICY "Allow public read access to cards"
  ON valentine_cards
  FOR SELECT
  TO public
  USING (true);