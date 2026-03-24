-- Add display_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add full_name as computed column or regular column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
