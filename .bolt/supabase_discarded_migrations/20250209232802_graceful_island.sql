-- Drop existing table if it exists (with CASCADE to remove dependencies)
DROP TABLE IF EXISTS public.valentine_cards CASCADE;

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the valentine_cards table with explicit schema
CREATE TABLE public.valentine_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name text NOT NULL,
    message text NOT NULL,
    template text NOT NULL,
    background_image text,
    created_at timestamptz DEFAULT now(),
    user_id uuid NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.valentine_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS "' || polname || '" ON public.valentine_cards;', E'\n')
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'valentine_cards'
    );
EXCEPTION 
    WHEN undefined_table THEN NULL;
END $$;

-- Create policies with explicit schema reference
CREATE POLICY "Enable read access for all users"
    ON public.valentine_cards FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.valentine_cards FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
    ON public.valentine_cards FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.valentine_cards FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_valentine_cards_user_id 
    ON public.valentine_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_valentine_cards_created_at 
    ON public.valentine_cards(created_at DESC);

-- Grant permissions
DO $$ 
BEGIN
    -- Grant schema usage
    EXECUTE 'GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role';
    
    -- Grant table permissions
    EXECUTE 'GRANT ALL ON public.valentine_cards TO postgres, authenticated, service_role';
    EXECUTE 'GRANT SELECT ON public.valentine_cards TO anon';
    
    -- Grant sequence permissions if they exist
    EXECUTE 'GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Verify the table exists and is accessible
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