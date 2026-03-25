-- Fix infinite recursion in profiles RLS policies
-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Shop members can view each other" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in same shop" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by shop members" ON profiles;

-- Create simple, non-recursive policies
-- Users can only view and update their OWN profile (no shop member checks)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
