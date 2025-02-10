-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to automatically create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile already exists
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = NEW.id
    ) THEN
        INSERT INTO public.profiles (id)
        VALUES (NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create or update profiles for existing users
DO $$
BEGIN
    INSERT INTO public.profiles (id)
    SELECT id FROM auth.users
    WHERE NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = users.id
    );
END $$;