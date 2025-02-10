/*
  # Valentine Cards Database Schema

  1. New Tables
    - `valentine_cards`
      - `id` (uuid, primary key)
      - `recipient_name` (text)
      - `message` (text)
      - `template` (text)
      - `background_image` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `valentine_cards` table
    - Add policies for:
      - Public read access
      - Authenticated users CRUD operations
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS "' || polname || '" ON valentine_cards;', E'\n')
    FROM pg_policies 
    WHERE tablename = 'valentine_cards'
  );
EXCEPTION 
  WHEN undefined_table THEN 
    NULL;
END $$;

-- Create the valentine_cards table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'valentine_cards'
  ) THEN
    CREATE TABLE valentine_cards (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      recipient_name text NOT NULL,
      message text NOT NULL,
      template text NOT NULL,
      background_image text,
      created_at timestamptz DEFAULT now(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
    );
  END IF;
END $$;

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