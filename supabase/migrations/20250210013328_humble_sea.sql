/*
  # Add card favorites functionality
  
  1. New Tables
    - `card_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `card_id` (uuid, references valentine_cards)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on card_favorites table
    - Add policies for authenticated users to manage their favorites
  
  3. Constraints
    - Unique constraint on user_id and card_id combination
    - Foreign key constraints with cascading deletes
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON card_favorites;', E'\n')
        FROM pg_policies 
        WHERE tablename = 'card_favorites'
    );
EXCEPTION 
    WHEN undefined_table THEN NULL;
END $$;

-- Create card_favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.card_favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id uuid REFERENCES valentine_cards(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, card_id)
);

-- Enable RLS
ALTER TABLE card_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "card_favorites_select_policy_v1"
    ON card_favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "card_favorites_insert_policy_v1"
    ON card_favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "card_favorites_delete_policy_v1"
    ON card_favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_card_favorites_user_id ON card_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_card_favorites_card_id ON card_favorites(card_id);

-- Grant permissions
GRANT ALL ON TABLE card_favorites TO authenticated;
GRANT SELECT ON TABLE card_favorites TO anon;