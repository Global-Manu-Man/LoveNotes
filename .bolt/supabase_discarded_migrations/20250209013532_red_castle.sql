/*
  # Create Valentine Cards Schema

  1. New Tables
    - `valentine_cards`
      - `id` (uuid, primary key)
      - `recipient_name` (text)
      - `message` (text)
      - `template` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `valentine_cards` table
    - Add policies for authenticated users to:
      - Create their own cards
      - Read their own cards
*/

CREATE TABLE IF NOT EXISTS valentine_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  message text NOT NULL,
  template text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE valentine_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own cards"
  ON valentine_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own cards"
  ON valentine_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);