/*
  # Valentine Cards Table Setup

  1. New Tables
    - valentine_cards
      - id (uuid, primary key)
      - recipient_name (text, not null)
      - message (text, not null)
      - template (text, not null)
      - background_image (text)
      - created_at (timestamptz)
      - user_id (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated users can create/update/delete their own cards
*/

-- Create the valentine_cards table
CREATE TABLE IF NOT EXISTS valentine_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  message text NOT NULL,
  template text NOT NULL,
  background_image text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for table access
CREATE POLICY "Allow public read access"
ON valentine_cards
FOR SELECT
TO public
USING (true);

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