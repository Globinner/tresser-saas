-- Client Chemistry / Chemical Treatment Records
-- Tracks all chemical treatments applied to clients (color, relaxers, perms, etc.)

CREATE TABLE IF NOT EXISTS client_chemistry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Treatment details
  treatment_type TEXT NOT NULL, -- 'color', 'highlights', 'relaxer', 'perm', 'keratin', 'bleach', 'toner', 'other'
  treatment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Product info
  brand TEXT,
  product_name TEXT,
  color_formula TEXT, -- e.g., "6N + 7G (1:1)"
  
  -- Developer/Oxidizer
  developer_volume INTEGER, -- 10, 20, 30, 40
  developer_brand TEXT,
  
  -- Mixing ratios
  mix_ratio TEXT, -- e.g., "1:1", "1:2", "2:1"
  
  -- Percentages for relaxers/straighteners
  strength_percentage INTEGER, -- For relaxers: mild, regular, super (could be 0-100)
  
  -- Processing
  processing_time_minutes INTEGER,
  heat_used BOOLEAN DEFAULT FALSE,
  
  -- Results & Notes
  result_notes TEXT, -- How it turned out
  allergies_reactions TEXT, -- Any reactions observed
  
  -- For future reference
  recommended_next_treatment TEXT,
  next_treatment_date DATE,
  
  -- Attachments (before/after photos could be URLs)
  before_photo_url TEXT,
  after_photo_url TEXT,
  
  -- Metadata
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE client_chemistry ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "client_chemistry_select" ON client_chemistry 
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
    OR 
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_chemistry_insert" ON client_chemistry 
  FOR INSERT WITH CHECK (
    shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
    OR 
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_chemistry_update" ON client_chemistry 
  FOR UPDATE USING (
    shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
    OR 
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_chemistry_delete" ON client_chemistry 
  FOR DELETE USING (
    shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
  );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_chemistry_client ON client_chemistry(client_id);
CREATE INDEX IF NOT EXISTS idx_client_chemistry_shop ON client_chemistry(shop_id);
CREATE INDEX IF NOT EXISTS idx_client_chemistry_date ON client_chemistry(treatment_date DESC);
