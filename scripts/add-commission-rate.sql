-- Add commission_rate column to profiles table for payroll calculations
-- Commission rate is stored as a percentage (e.g., 50 = 50%)

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 50;

-- Add commission_type column (percentage or fixed amount per service)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS commission_type text DEFAULT 'percentage' 
CHECK (commission_type IN ('percentage', 'fixed'));

-- Add fixed_rate column for fixed commission per service
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS fixed_commission numeric DEFAULT 0;

-- Comment for clarity
COMMENT ON COLUMN profiles.commission_rate IS 'Commission percentage (0-100)';
COMMENT ON COLUMN profiles.commission_type IS 'Type of commission: percentage or fixed';
COMMENT ON COLUMN profiles.fixed_commission IS 'Fixed amount per service if commission_type is fixed';
