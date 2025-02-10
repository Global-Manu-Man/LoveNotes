/*
  # Add user settings and favorites

  1. New Tables
    - `profiles`
      - User profile information including name and avatar
      - References auth.users for user association
      - Includes timestamps for creation and updates
    
    - `card_favorites`
      - Tracks user's favorite cards
      - Links users to valentine_cards
      - Prevents duplicate favorites

  2. Security
    - Enable RLS on both tables
    - Policies for authenticated users to manage their own data
    - Public read access where appropriate

  3. Indexes
    - Optimized queries for user_id and card lookups
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create card_favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.card_favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id uuid REFERENCES valentine_cards(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, card_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Card favorites policies
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

-- Create updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_card_favorites_user_id ON card_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_card_favorites_card_id ON card_favorites(card_id);

-- Grant permissions
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE card_favorites TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;
GRANT SELECT ON TABLE card_favorites TO anon;