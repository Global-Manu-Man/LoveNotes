/*
  # Update valentine_cards table and policies

  1. Changes
    - Add background_image column
    - Update foreign key constraint
    - Drop and recreate policies

  2. Security
    - Maintain RLS on valentine_cards table
    - Create policies for all CRUD operations
*/

-- Drop existing policies one by one
DO $$ 
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Users can create their own cards" ON valentine_cards';
  EXECUTE 'DROP POLICY IF EXISTS "Users can read their own cards" ON valentine_cards';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own cards" ON valentine_cards';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own cards" ON valentine_cards';
END $$;

-- Recreate the table with all columns
CREATE TABLE IF NOT EXISTS valentine_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  message text NOT NULL,
  template text NOT NULL,
  background_image text,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  CONSTRAINT valentine_cards_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users (id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can create their own cards"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own cards"
  ON valentine_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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