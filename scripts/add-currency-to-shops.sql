-- Add currency column to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add comment for documentation
COMMENT ON COLUMN shops.currency IS 'ISO 4217 currency code (e.g., USD, ILS, EUR)';
