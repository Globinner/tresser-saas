-- Referral/Affiliate System for Resellers
-- Resellers earn 25% commission on each sale from their referrals

-- Table to store referral codes and reseller info
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- e.g., "MIKE25", "PARTNER2024"
  owner_name VARCHAR(255) NOT NULL, -- Reseller/partner name
  owner_email VARCHAR(255) NOT NULL, -- Reseller email for payouts
  commission_percent DECIMAL(5,2) DEFAULT 25.00, -- Default 25%
  is_active BOOLEAN DEFAULT true,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_paid DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to track which shops used which referral code
CREATE TABLE IF NOT EXISTS referral_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  signed_up_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id) -- Each shop can only have one referrer
);

-- Table to track commissions earned from each payment
CREATE TABLE IF NOT EXISTS referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES subscription_payments(id) ON DELETE SET NULL,
  payment_amount DECIMAL(10,2) NOT NULL, -- Original payment amount
  commission_percent DECIMAL(5,2) NOT NULL, -- Commission % at time of sale
  commission_amount DECIMAL(10,2) NOT NULL, -- Actual commission earned
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, paid
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Table to track payout requests
CREATE TABLE IF NOT EXISTS referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50), -- paypal, bank_transfer, etc.
  payment_details JSONB, -- PayPal email, bank details, etc.
  status VARCHAR(20) DEFAULT 'requested', -- requested, processing, completed, rejected
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

-- Policies (admin only for now - resellers access via API)
CREATE POLICY "Service role full access to referral_codes" ON referral_codes FOR ALL USING (true);
CREATE POLICY "Service role full access to referral_signups" ON referral_signups FOR ALL USING (true);
CREATE POLICY "Service role full access to referral_commissions" ON referral_commissions FOR ALL USING (true);
CREATE POLICY "Service role full access to referral_payouts" ON referral_payouts FOR ALL USING (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_signups_shop ON referral_signups(shop_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_code ON referral_commissions(referral_code_id);
