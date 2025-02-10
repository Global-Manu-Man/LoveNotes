/*
  # Fix Row Level Security Policies

  1. Changes
    - Drop existing policies for valentine_cards
    - Create new policies with proper permissions
    - Enable RLS on valentine_cards table
  
  2. Security
    - Allow authenticated users to create cards
    - Allow public read access to cards
    - Allow users to manage their own cards
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS "' || polname || '" ON valentine_cards;', E'\n')
    FROM pg_policies 
    WHERE tablename = 'valentine_cards'
  );
END $$;

-- Enable RLS
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON valentine_cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON valentine_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON valentine_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);