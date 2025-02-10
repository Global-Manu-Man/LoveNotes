-- Drop existing table and policies
DROP TABLE IF EXISTS valentine_cards CASCADE;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the valentine_cards table
CREATE TABLE valentine_cards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_name text NOT NULL CHECK (char_length(recipient_name) > 0),
    message text NOT NULL CHECK (char_length(message) > 0),
    template text NOT NULL CHECK (template IN ('classic', 'modern')),
    background_image text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_valentine_cards_updated_at
    BEFORE UPDATE ON valentine_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON valentine_cards TO authenticated;
GRANT SELECT ON valentine_cards TO anon;
GRANT USAGE ON SEQUENCE valentine_cards_id_seq TO authenticated;