-- =============================================
-- BLADE Barber SaaS - Additional Features
-- Public Booking, Photos, Queue, Inventory, Reminders
-- =============================================

-- =============================================
-- 1. PUBLIC BOOKING SETTINGS
-- =============================================
ALTER TABLE shops ADD COLUMN IF NOT EXISTS public_booking_enabled boolean DEFAULT false;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_slug text UNIQUE;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_advance_days integer DEFAULT 30;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_slot_duration integer DEFAULT 30;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_start_time time DEFAULT '09:00';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_end_time time DEFAULT '18:00';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS booking_days_open text[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday'];

-- =============================================
-- 2. BEFORE/AFTER PHOTOS
-- =============================================
CREATE TABLE IF NOT EXISTS client_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  photo_type text NOT NULL CHECK (photo_type IN ('before', 'after', 'progress')),
  blob_pathname text NOT NULL,
  session_id uuid, -- to group before/after pairs
  service_performed text,
  notes text,
  taken_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE client_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select" ON client_photos FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "photos_insert" ON client_photos FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "photos_update" ON client_photos FOR UPDATE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "photos_delete" ON client_photos FOR DELETE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

-- =============================================
-- 3. WALK-IN QUEUE
-- =============================================
CREATE TABLE IF NOT EXISTS walk_in_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_phone text,
  service_requested text,
  barber_preference uuid REFERENCES profiles(id),
  position integer NOT NULL,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_service', 'completed', 'no_show', 'cancelled')),
  estimated_wait_minutes integer,
  checked_in_at timestamp with time zone DEFAULT now(),
  called_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE walk_in_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "queue_select" ON walk_in_queue FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "queue_insert" ON walk_in_queue FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "queue_update" ON walk_in_queue FOR UPDATE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "queue_delete" ON walk_in_queue FOR DELETE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

-- =============================================
-- 4. INVENTORY MANAGEMENT
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_cat_select" ON inventory_categories FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_cat_insert" ON inventory_categories FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_cat_update" ON inventory_categories FOR UPDATE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_cat_delete" ON inventory_categories FOR DELETE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_id uuid REFERENCES inventory_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  sku text,
  brand text,
  description text,
  unit text DEFAULT 'piece',
  quantity_in_stock integer DEFAULT 0,
  reorder_level integer DEFAULT 5,
  cost_per_unit numeric(10,2),
  sell_price numeric(10,2),
  supplier text,
  last_restocked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_items_select" ON inventory_items FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_items_insert" ON inventory_items FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_items_update" ON inventory_items FOR UPDATE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_items_delete" ON inventory_items FOR DELETE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('restock', 'use', 'sale', 'adjustment', 'waste')),
  quantity integer NOT NULL,
  notes text,
  performed_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inv_trans_select" ON inventory_transactions FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "inv_trans_insert" ON inventory_transactions FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

-- =============================================
-- 5. APPOINTMENT REMINDERS
-- =============================================
CREATE TABLE IF NOT EXISTS reminder_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid UNIQUE NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  reminder_24h boolean DEFAULT true,
  reminder_2h boolean DEFAULT true,
  custom_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reminder_settings_select" ON reminder_settings FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "reminder_settings_insert" ON reminder_settings FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "reminder_settings_update" ON reminder_settings FOR UPDATE USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS sent_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('email', 'sms')),
  timing text NOT NULL CHECK (timing IN ('24h', '2h', 'custom')),
  sent_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
  error_message text
);

ALTER TABLE sent_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sent_reminders_select" ON sent_reminders FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "sent_reminders_insert" ON sent_reminders FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

-- Add phone and email to clients for reminders
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reminder_opt_in boolean DEFAULT true;

-- Add reminder fields to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_sent_24h boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_sent_2h boolean DEFAULT false;
