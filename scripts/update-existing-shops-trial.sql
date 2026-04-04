-- Update existing shops without subscription info to have trial status
-- This gives existing users a 14-day trial from NOW (not from their creation date)
-- so they have time to evaluate the paid features

UPDATE shops 
SET 
  subscription_plan = 'trial',
  subscription_status = 'active',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '14 days'
WHERE subscription_plan IS NULL 
   OR subscription_plan = '';
