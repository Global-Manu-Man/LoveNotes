/*
  # Esquema inicial de la base de datos

  1. Nuevas Tablas
    - `profiles`: Perfiles de usuario
      - `id` (uuid, primary key)
      - `username` (citext, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `valentine_cards`: Tarjetas de San Valentín
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `recipient_name` (text)
      - `message` (text)
      - `template` (text)
      - `background_image` (text)
      - `is_public` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `card_likes`: Likes de tarjetas
      - `id` (uuid, primary key)
      - `card_id` (uuid, referencia a valentine_cards)
      - `user_id` (uuid, referencia a auth.users)
      - `created_at` (timestamp)

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para lectura pública y escritura autenticada
*/

-- Crear extensiones necesarias si no existen
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabla de perfiles de usuario
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username citext UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Trigger para actualizar updated_at en profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabla de tarjetas de San Valentín
DO $$ 
BEGIN
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
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Trigger para actualizar updated_at en valentine_cards
DROP TRIGGER IF EXISTS update_valentine_cards_updated_at ON valentine_cards;
CREATE TRIGGER update_valentine_cards_updated_at
  BEFORE UPDATE ON valentine_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabla de likes de tarjetas
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS card_likes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id uuid REFERENCES valentine_cards ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(card_id, user_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_likes ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DO $$ 
BEGIN
  -- Políticas de profiles
  DROP POLICY IF EXISTS "Usuarios pueden ver perfiles públicos" ON profiles;
  DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
  
  -- Políticas de valentine_cards
  DROP POLICY IF EXISTS "Cualquiera puede ver tarjetas públicas" ON valentine_cards;
  DROP POLICY IF EXISTS "Usuarios pueden ver sus propias tarjetas" ON valentine_cards;
  DROP POLICY IF EXISTS "Usuarios pueden crear sus propias tarjetas" ON valentine_cards;
  DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias tarjetas" ON valentine_cards;
  DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias tarjetas" ON valentine_cards;
  
  -- Políticas de card_likes
  DROP POLICY IF EXISTS "Cualquiera puede ver likes" ON card_likes;
  DROP POLICY IF EXISTS "Usuarios autenticados pueden dar like" ON card_likes;
  DROP POLICY IF EXISTS "Usuarios pueden quitar sus propios likes" ON card_likes;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Crear nuevas políticas
-- Políticas para profiles
CREATE POLICY "Usuarios pueden ver perfiles públicos"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para valentine_cards
CREATE POLICY "Cualquiera puede ver tarjetas públicas"
  ON valentine_cards
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Usuarios pueden ver sus propias tarjetas"
  ON valentine_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias tarjetas"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias tarjetas"
  ON valentine_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias tarjetas"
  ON valentine_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para card_likes
CREATE POLICY "Cualquiera puede ver likes"
  ON card_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Usuarios autenticados pueden dar like"
  ON card_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar sus propios likes"
  ON card_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Función para contar likes de una tarjeta
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