-- Fix: Set role to 'owner' for all users who have a shop_id
UPDATE profiles 
SET role = 'owner' 
WHERE shop_id IS NOT NULL AND role != 'owner';
