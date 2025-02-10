-- Drop existing table if it exists
DROP TABLE IF EXISTS valentine_cards CASCADE;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the valentine_cards table
CREATE TABLE valentine_cards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_name text NOT NULL,
    message text NOT NULL,
    template text NOT NULL,
    background_image text,
    created_at timestamptz DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
    ON valentine_cards FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON valentine_cards FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
    ON valentine_cards FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON valentine_cards FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_valentine_cards_user_id ON valentine_cards(user_id);
CREATE INDEX idx_valentine_cards_created_at ON valentine_cards(created_at DESC);

-- Grant permissions
GRANT ALL ON valentine_cards TO authenticated;
GRANT SELECT ON valentine_cards TO anon;