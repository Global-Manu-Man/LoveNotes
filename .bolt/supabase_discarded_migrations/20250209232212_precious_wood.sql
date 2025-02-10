/*
  # Valentine Cards Schema Setup
  
  1. New Tables
    - `valentine_cards`
      - `id` (uuid, primary key)
      - `recipient_name` (text, required)
      - `message` (text, required)
      - `template` (text, required)
      - `background_image` (text, optional)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
  
  2. Security
    - Enable RLS on valentine_cards table
    - Public read access policy
    - Authenticated user CRUD policies
*/

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS valentine_cards CASCADE;

-- Create the valentine_cards table
CREATE TABLE valentine_cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_name text NOT NULL CHECK (char_length(recipient_name) > 0),
  message text NOT NULL CHECK (char_length(message) > 0),
  template text NOT NULL CHECK (template IN ('classic', 'modern')),
  background_image text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
BEGIN
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS "' || polname || '" ON valentine_cards;', E'\n')
    FROM pg_policies 
    WHERE tablename = 'valentine_cards'
  );
EXCEPTION 
  WHEN undefined_table THEN NULL;
END $$;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON valentine_cards
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON valentine_cards
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON valentine_cards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON valentine_cards
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS valentine_cards_user_id_idx ON valentine_cards(user_id);
CREATE INDEX IF NOT EXISTS valentine_cards_created_at_idx ON valentine_cards(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON valentine_cards TO authenticated;
GRANT SELECT ON valentine_cards TO anon;