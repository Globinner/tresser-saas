-- RPC function to update referral earnings
CREATE OR REPLACE FUNCTION update_referral_earnings(code_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE referral_codes 
  SET total_earnings = total_earnings + amount
  WHERE id = code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process referral after shop creation (called by trigger or manually)
CREATE OR REPLACE FUNCTION process_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  ref_code_id UUID;
BEGIN
  -- Get referral code from user metadata
  SELECT raw_user_meta_data->>'referral_code' INTO ref_code
  FROM auth.users WHERE id = NEW.owner_id;
  
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    -- Find the referral code
    SELECT id INTO ref_code_id FROM referral_codes 
    WHERE code = UPPER(ref_code) AND is_active = true;
    
    IF ref_code_id IS NOT NULL THEN
      -- Record the signup
      INSERT INTO referral_signups (referral_code_id, shop_id)
      VALUES (ref_code_id, NEW.id)
      ON CONFLICT DO NOTHING;
      
      -- Increment signup count
      UPDATE referral_codes 
      SET total_signups = total_signups + 1
      WHERE id = ref_code_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to process referral when shop is created
DROP TRIGGER IF EXISTS process_referral_on_shop_create ON shops;
CREATE TRIGGER process_referral_on_shop_create
  AFTER INSERT ON shops
  FOR EACH ROW
  EXECUTE FUNCTION process_referral_signup();
