-- NUCLEAR FIX: Completely disable and re-enable RLS with minimal policies
-- This will fix infinite recursion once and for all

-- Step 1: Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop EVERY possible policy (brute force)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create ONLY simple policies with NO subqueries
-- Policy 1: Users can see their own profile
CREATE POLICY "profiles_select_self" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "profiles_update_self" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "profiles_insert_self" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Public read for booking - SIMPLE, NO SUBQUERIES
CREATE POLICY "profiles_public_read" ON profiles
FOR SELECT USING (shop_id IS NOT NULL);
