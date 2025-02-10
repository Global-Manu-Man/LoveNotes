/*
  # Initial Database Schema Setup

  1. Tables
    - `profiles`: User profiles with username and avatar
    - `valentine_cards`: Valentine's day cards with messages and templates
    - `card_likes`: Track likes on cards
  
  2. Security
    - RLS enabled on all tables
    - Public read access for cards marked as public
    - Authenticated users can manage their own data
    - Secure like system with unique constraints

  3. Functions
    - Auto-updating timestamps
    - Like count helper function
*/

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username citext UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Valentine cards table
CREATE TABLE IF NOT EXISTS valentine_cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipient_name text NOT NULL,
  message text NOT NULL,
  template text NOT NULL,
  background_image text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT message_length CHECK (char_length(message) >= 1)
);

-- Card likes table
CREATE TABLE IF NOT EXISTS card_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id uuid REFERENCES valentine_cards ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(card_id, user_id)
);

-- Update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valentine_cards_updated_at
  BEFORE UPDATE ON valentine_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_likes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Valentine cards policies
CREATE POLICY "Public cards are viewable by everyone"
  ON valentine_cards FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own cards"
  ON valentine_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cards"
  ON valentine_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON valentine_cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON valentine_cards FOR DELETE
  USING (auth.uid() = user_id);

-- Card likes policies
CREATE POLICY "Anyone can view likes"
  ON card_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like cards"
  ON card_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON card_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Helper function for like counts
CREATE OR REPLACE FUNCTION get_card_likes_count(card_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM card_likes
  WHERE card_likes.card_id = $1;
$$;