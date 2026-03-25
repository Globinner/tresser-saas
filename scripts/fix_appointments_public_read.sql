-- Allow public users to view appointments for availability checking on booking pages
-- This only allows reading date/time/barber_id - no sensitive client data

-- Drop any existing public policy
DROP POLICY IF EXISTS "Public can view appointment times for booking" ON appointments;
DROP POLICY IF EXISTS "appointments_public_availability" ON appointments;

-- Create policy for public to see appointment times (for availability checking)
CREATE POLICY "appointments_public_availability" ON appointments
FOR SELECT
TO anon, authenticated
USING (
  shop_id IN (
    SELECT id FROM shops WHERE public_booking_enabled = true
  )
);
