-- Add subscription fields to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMPTZ;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ;

-- Create subscription payments table
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  paypal_payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shops_subscription_id ON shops(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_shop_id ON subscription_payments(shop_id);
