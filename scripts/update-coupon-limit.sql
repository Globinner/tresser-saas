-- Update TESTER100 coupon to have a limit of 50 uses
UPDATE coupons 
SET max_uses = 50 
WHERE code = 'TESTER100';
