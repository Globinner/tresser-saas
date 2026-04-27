-- Add commission duration limit to referral_codes
-- This limits how long commissions are paid (in months)
-- NULL = lifetime/unlimited

ALTER TABLE referral_codes 
ADD COLUMN IF NOT EXISTS commission_duration_months INTEGER DEFAULT 12;

-- Add comment explaining the field
COMMENT ON COLUMN referral_codes.commission_duration_months IS 'Number of months to pay commission after signup. NULL = lifetime.';

-- Update existing codes to have 12 month limit
UPDATE referral_codes 
SET commission_duration_months = 12 
WHERE commission_duration_months IS NULL;
