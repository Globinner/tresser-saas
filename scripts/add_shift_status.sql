-- Add status column to team_shifts table for approval workflow
-- Status: 'pending' = staff submitted, waiting approval
--         'approved' = owner approved
--         'rejected' = owner rejected

ALTER TABLE team_shifts 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add submitted_by column to track who created the shift
ALTER TABLE team_shifts
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES profiles(id);

-- Add notes column for rejection reasons or comments
ALTER TABLE team_shifts
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing rows to have approved status (owner-created)
UPDATE team_shifts SET status = 'approved' WHERE status IS NULL;
