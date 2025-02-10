-- Reset everything first
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Set up permissions for public schema
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- Create the valentine_cards table
CREATE TABLE public.valentine_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name text NOT NULL CHECK (length(trim(recipient_name)) > 0),
    message text NOT NULL CHECK (length(trim(message)) > 0),
    template text NOT NULL CHECK (template IN ('classic', 'modern')),
    background_image text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.valentine_cards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
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

-- Grant table permissions
GRANT ALL ON public.valentine_cards TO postgres;
GRANT ALL ON public.valentine_cards TO service_role;
GRANT SELECT ON public.valentine_cards TO anon;
GRANT ALL ON public.valentine_cards TO authenticated;

-- Verify table creation
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' 
        AND tablename = 'valentine_cards'
    ) THEN
        RAISE EXCEPTION 'Table valentine_cards was not created properly';
    END IF;
END $$;