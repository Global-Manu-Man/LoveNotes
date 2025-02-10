-- Drop existing policies
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

-- Create policies with proper checks
CREATE POLICY "Enable read access for all users"
  ON valentine_cards
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.uid() = user_id
  );

CREATE POLICY "Enable update for own cards only"
  ON valentine_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for own cards only"
  ON valentine_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);