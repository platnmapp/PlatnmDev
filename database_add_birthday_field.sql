-- Add birth_date field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;

