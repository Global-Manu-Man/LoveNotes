-- Drop existing policies
DO $$ 
BEGIN
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON valentine_cards;', E'\n')
    FROM pg_policies 
    WHERE tablename = 'valentine_cards'
  );
EXCEPTION 
  WHEN undefined_table THEN NULL;
END $$;

-- Make sure RLS is enabled
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Simple policy for public read access
CREATE POLICY "Public read access"
  ON valentine_cards
  FOR SELECT
  TO public
  USING (true);

-- Simple policy for authenticated insert
CREATE POLICY "Authenticated insert"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Simple policy for authenticated update
CREATE POLICY "Authenticated update own"
  ON valentine_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Simple policy for authenticated delete
CREATE POLICY "Authenticated delete own"
  ON valentine_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);