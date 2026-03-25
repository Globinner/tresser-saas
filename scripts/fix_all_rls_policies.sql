-- Fix all RLS policies to ensure data is properly accessible

-- 1. Fix profiles - allow shop members to see each other (needed for barber names)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

-- 2. Fix shops - ensure owner and members can view
DROP POLICY IF EXISTS "Users can view their own shop" ON shops;
CREATE POLICY "Users can view shop" ON shops
  FOR SELECT USING (
    owner_id = auth.uid()
    OR
    id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

-- 3. Fix appointments - ensure shop members can view based on their shop_id
DROP POLICY IF EXISTS "Shop members can view appointments" ON appointments;
CREATE POLICY "Shop members can view appointments" ON appointments
  FOR SELECT USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

-- 4. Fix clients - ensure shop members can view
DROP POLICY IF EXISTS "Shop members can view clients" ON clients;
CREATE POLICY "Shop members can view clients" ON clients
  FOR SELECT USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

-- 5. Fix services - ensure shop members can view
DROP POLICY IF EXISTS "Shop members can view services" ON services;
CREATE POLICY "Shop members can view services" ON services
  FOR SELECT USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );
