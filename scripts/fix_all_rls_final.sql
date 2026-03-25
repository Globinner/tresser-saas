-- FINAL FIX: Drop ALL profiles policies and create simple non-recursive ones

-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Shop members can view each other" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in same shop" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by shop members" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "Public can view barbers for booking" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles with shop_id" ON profiles;

-- Create SIMPLE policies that DO NOT reference other tables
-- Policy 1: Users can view their own profile
CREATE POLICY "profiles_view_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Anyone can view profiles that have a shop_id (for public booking - NO subquery to avoid recursion)
CREATE POLICY "profiles_public_view_barbers" ON profiles
  FOR SELECT USING (shop_id IS NOT NULL);
