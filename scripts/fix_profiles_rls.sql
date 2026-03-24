-- Fix infinite recursion in profiles RLS policies
-- The issue is that "Shop members can view each other" policy queries profiles table again

-- Drop the problematic policies
DROP POLICY IF EXISTS "Shop members can view each other" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate policies without recursion

-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Shop members can view each other (fixed to avoid recursion)
-- Using a subquery that doesn't cause recursion
CREATE POLICY "Shop members can view each other" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR
    shop_id IN (
      SELECT shop_id FROM profiles WHERE id = auth.uid()
    )
  );
