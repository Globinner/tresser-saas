-- Security RLS Updates
-- 1. Restrict access for inactive/fired team members
-- 2. Barbers can only see their own appointments (not all)
-- 3. Hide financial data (transactions) from non-owners

-- Helper function to check if user is active team member
CREATE OR REPLACE FUNCTION is_active_team_member(check_shop_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND shop_id = check_shop_id
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is shop owner
CREATE OR REPLACE FUNCTION is_shop_owner(check_shop_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM shops
    WHERE id = check_shop_id
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- APPOINTMENTS - Barbers see only their own appointments
-- ============================================

-- Drop existing appointment policies
DROP POLICY IF EXISTS "Shop members can view appointments" ON appointments;
DROP POLICY IF EXISTS "Shop members can manage appointments" ON appointments;

-- Owners can see ALL appointments
CREATE POLICY "Owners can view all appointments"
ON appointments FOR SELECT
USING (
  is_shop_owner(shop_id)
);

-- Active barbers can only see their OWN appointments
CREATE POLICY "Barbers can view own appointments"
ON appointments FOR SELECT
USING (
  barber_id = auth.uid()
  AND is_active_team_member(shop_id)
);

-- Owners can manage all appointments
CREATE POLICY "Owners can manage all appointments"
ON appointments FOR ALL
USING (
  is_shop_owner(shop_id)
);

-- Active barbers can manage their own appointments
CREATE POLICY "Barbers can manage own appointments"
ON appointments FOR ALL
USING (
  barber_id = auth.uid()
  AND is_active_team_member(shop_id)
);

-- ============================================
-- CLIENTS - Barbers see only clients they've served
-- ============================================

-- Drop existing client policies
DROP POLICY IF EXISTS "Shop members can view clients" ON clients;
DROP POLICY IF EXISTS "Shop members can manage clients" ON clients;

-- Owners can see ALL clients
CREATE POLICY "Owners can view all clients"
ON clients FOR SELECT
USING (
  is_shop_owner(shop_id)
);

-- Active barbers can see clients they have appointments with
CREATE POLICY "Barbers can view their clients"
ON clients FOR SELECT
USING (
  is_active_team_member(shop_id)
  AND EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.client_id = clients.id
    AND a.barber_id = auth.uid()
  )
);

-- Owners can manage all clients
CREATE POLICY "Owners can manage all clients"
ON clients FOR ALL
USING (
  is_shop_owner(shop_id)
);

-- Barbers can update clients they serve (notes, preferences)
CREATE POLICY "Barbers can update their clients"
ON clients FOR UPDATE
USING (
  is_active_team_member(shop_id)
  AND EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.client_id = clients.id
    AND a.barber_id = auth.uid()
  )
);

-- ============================================
-- TRANSACTIONS - Only owners can see financial data
-- ============================================

-- Drop existing transaction policies
DROP POLICY IF EXISTS "Shop members can view transactions" ON transactions;
DROP POLICY IF EXISTS "Shop members can manage transactions" ON transactions;

-- Only owners can see transactions
CREATE POLICY "Owners can view transactions"
ON transactions FOR SELECT
USING (
  is_shop_owner(shop_id)
);

-- Only owners can manage transactions
CREATE POLICY "Owners can manage transactions"
ON transactions FOR ALL
USING (
  is_shop_owner(shop_id)
);

-- ============================================
-- PROFILES - Inactive members lose access
-- ============================================

-- Update profiles policies to check is_active
DROP POLICY IF EXISTS "profiles_select_self" ON profiles;

CREATE POLICY "profiles_select_self"
ON profiles FOR SELECT
USING (
  id = auth.uid()
  OR (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid() AND is_active = true)
  )
);

-- ============================================
-- CLIENT_CHEMISTRY - Barbers see only their treatments
-- ============================================

DROP POLICY IF EXISTS "client_chemistry_select" ON client_chemistry;

-- Owners see all chemistry records
CREATE POLICY "Owners can view all chemistry"
ON client_chemistry FOR SELECT
USING (
  is_shop_owner(shop_id)
);

-- Barbers see only chemistry they performed
CREATE POLICY "Barbers can view own chemistry"
ON client_chemistry FOR SELECT
USING (
  performed_by = auth.uid()
  AND is_active_team_member(shop_id)
);

-- ============================================
-- CLIENT_PHOTOS - Barbers see only photos from their sessions
-- ============================================

DROP POLICY IF EXISTS "photos_select" ON client_photos;

-- Owners see all photos
CREATE POLICY "Owners can view all photos"
ON client_photos FOR SELECT
USING (
  is_shop_owner(shop_id)
);

-- Barbers see photos from clients they served
CREATE POLICY "Barbers can view their client photos"
ON client_photos FOR SELECT
USING (
  is_active_team_member(shop_id)
  AND EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.client_id = client_photos.client_id
    AND a.barber_id = auth.uid()
  )
);
