-- Create team_shifts table for tracking weekly availability
CREATE TABLE IF NOT EXISTS team_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  end_time TIME WITHOUT TIME ZONE NOT NULL,
  is_working BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, profile_id, day_of_week)
);

-- Enable RLS
ALTER TABLE team_shifts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "team_shifts_select" ON team_shifts
  FOR SELECT
  USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM shops WHERE id = team_shifts.shop_id AND public_booking_enabled = true)
  );

CREATE POLICY "team_shifts_insert" ON team_shifts
  FOR INSERT
  WITH CHECK (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    OR
    profile_id = auth.uid()
  );

CREATE POLICY "team_shifts_update" ON team_shifts
  FOR UPDATE
  USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    OR
    profile_id = auth.uid()
  );

CREATE POLICY "team_shifts_delete" ON team_shifts
  FOR DELETE
  USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    OR
    profile_id = auth.uid()
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_shifts_shop_profile ON team_shifts(shop_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_team_shifts_day ON team_shifts(shop_id, day_of_week);
