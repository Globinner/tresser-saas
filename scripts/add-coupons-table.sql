-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 100,
  duration_months INTEGER NOT NULL DEFAULT 12,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Create coupon redemptions table to track who used which coupon
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(coupon_id, shop_id)
);

-- Insert the TESTER100 coupon (100% off for 1 year, unlimited uses)
INSERT INTO coupons (code, discount_percent, duration_months, max_uses, is_active)
VALUES ('TESTER100', 100, 12, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Coupons can be read by anyone (to validate)
CREATE POLICY "Coupons are viewable by authenticated users"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Coupon redemptions viewable by shop owner
CREATE POLICY "Coupon redemptions viewable by shop owner"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

-- Allow inserting redemptions for own shop
CREATE POLICY "Can redeem coupons for own shop"
  ON coupon_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
