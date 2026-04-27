-- RPC function to update referral earnings
CREATE OR REPLACE FUNCTION update_referral_earnings(code_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE referral_codes
  SET total_earnings = total_earnings + amount
  WHERE id = code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
