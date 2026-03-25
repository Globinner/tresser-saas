-- Drop existing INSERT policy and recreate with correct permissions
DROP POLICY IF EXISTS "Users can insert their own shop" ON shops;

-- Allow authenticated users to create shops
CREATE POLICY "Users can insert shops"
ON shops FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also ensure users can update their own shop
DROP POLICY IF EXISTS "Users can update their own shop" ON shops;

CREATE POLICY "Users can update their own shop"
ON shops FOR UPDATE
TO authenticated
USING (
  id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);
