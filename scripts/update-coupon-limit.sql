-- Update TESTER100 coupon to have a limit of 100 uses
UPDATE coupons 
SET max_uses = 100 
WHERE code = 'TESTER100';
