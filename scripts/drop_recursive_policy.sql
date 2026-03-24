-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Shop members can view each other" ON profiles;
