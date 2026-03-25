-- Add currency column to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS currency text DEFAULT 'ILS';
