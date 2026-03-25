-- Allow public to view barbers for booking pages
-- This policy is simple and does NOT cause recursion because it only checks shop_id directly
DROP POLICY IF EXISTS "public_view_barbers" ON profiles;

CREATE POLICY "public_view_barbers" ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (shop_id IS NOT NULL);
