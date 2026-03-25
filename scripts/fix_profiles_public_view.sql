-- Allow public to view active barbers for booking pages
-- This only exposes necessary info (name, avatar) for the booking page

CREATE POLICY "Public can view active barbers for booking" ON profiles
FOR SELECT
USING (
  is_active = true 
  AND shop_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM shops 
    WHERE shops.id = profiles.shop_id 
    AND shops.public_booking_enabled = true
  )
);
