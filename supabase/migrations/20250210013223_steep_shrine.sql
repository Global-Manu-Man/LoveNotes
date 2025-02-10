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

-- Create policies for card_favorites
CREATE POLICY "Users can view their own favorites"
    ON card_favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON card_favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
    ON card_favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_card_favorites_user_id ON card_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_card_favorites_card_id ON card_favorites(card_id);

-- Grant permissions
GRANT ALL ON TABLE card_favorites TO authenticated;
GRANT SELECT ON TABLE card_favorites TO anon;