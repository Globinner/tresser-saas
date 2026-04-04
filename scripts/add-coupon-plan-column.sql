-- Add applies_to_plan column to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS applies_to_plan TEXT DEFAULT 'pro';

-- Update TESTER100 to apply to pro plan
UPDATE coupons SET applies_to_plan = 'pro' WHERE code = 'TESTER100';
