/*
  # Create Valentine Cards Table

  1. New Tables
    - `valentine_cards`
      - `id` (uuid, primary key)
      - `recipient_name` (text, not null)
      - `message` (text, not null)
      - `template` (text, not null)
      - `background_image` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `valentine_cards` table
    - Add policies for:
      - Public read access
      - Authenticated users can create their own cards
      - Users can update their own cards
      - Users can delete their own cards
*/

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the valentine_cards table
CREATE TABLE public.valentine_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name text NOT NULL CHECK (length(trim(recipient_name)) > 0),
    message text NOT NULL CHECK (length(trim(message)) > 0),
    template text NOT NULL CHECK (template IN ('classic', 'modern')),
    background_image text,
    created_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.valentine_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
    ON public.valentine_cards
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.valentine_cards
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

CREATE POLICY "Enable update for users based on user_id"
    ON public.valentine_cards
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.valentine_cards
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_valentine_cards_user_id ON public.valentine_cards(user_id);
CREATE INDEX idx_valentine_cards_created_at ON public.valentine_cards(created_at DESC);

-- Grant permissions
GRANT ALL ON public.valentine_cards TO authenticated;
GRANT SELECT ON public.valentine_cards TO anon;