-- Fix RLS policies for public booking
-- Allow anonymous users to create appointments and clients when booking

-- Appointments: allow public inserts
DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
CREATE POLICY "Public can create appointments" ON appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Clients: allow public inserts for booking
DROP POLICY IF EXISTS "Public can create clients for booking" ON clients;
CREATE POLICY "Public can create clients for booking" ON clients
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Clients: allow checking if client exists by email (for public booking)
DROP POLICY IF EXISTS "Public can check client by email" ON clients;
CREATE POLICY "Public can check client by email" ON clients
  FOR SELECT TO anon, authenticated
  USING (true);

-- Services: allow public to view active services
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Shops: allow public to view shops with booking enabled
DROP POLICY IF EXISTS "Public can view shops with booking" ON shops;
CREATE POLICY "Public can view shops with booking" ON shops
  FOR SELECT TO anon, authenticated
  USING (public_booking_enabled = true OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE profiles.shop_id = shops.id AND profiles.id = auth.uid()
  ));
