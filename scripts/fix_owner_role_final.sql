-- Set role to owner for users who have a shop_id
UPDATE profiles SET role = 'owner' WHERE shop_id IS NOT NULL;
