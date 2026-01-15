-- ===================================================================
-- MIGRATION: Update activities table to match code expectations
-- ===================================================================
-- This migrates from: related_user_id, activity_type
--                 to:  actor_id, type, is_actionable, is_completed
-- ===================================================================

-- Step 1: Add new columns (if they don't exist)
ALTER TABLE activities 
  ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS is_actionable BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Migrate existing data from old columns to new columns
UPDATE activities 
SET 
  actor_id = related_user_id,
  type = activity_type,
  is_actionable = CASE 
    WHEN activity_type = 'friend_request' THEN true
    ELSE false
  END,
  is_completed = CASE
    WHEN activity_type = 'friend_accepted' THEN true
    ELSE false
  END,
  updated_at = COALESCE(updated_at, created_at)
WHERE actor_id IS NULL OR type IS NULL;

-- Step 3: Make new columns NOT NULL (after data migration)
ALTER TABLE activities
  ALTER COLUMN actor_id SET NOT NULL,
  ALTER COLUMN type SET NOT NULL;

-- Step 4: Add check constraint for type values
ALTER TABLE activities
  DROP CONSTRAINT IF EXISTS activities_type_check;
ALTER TABLE activities
  ADD CONSTRAINT activities_type_check 
  CHECK (type IN ('friend_request', 'friend_accepted', 'song_liked', 'song_disliked', 'song_sent'));

-- Step 5: Create index on actor_id for performance
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_activities_type_user_id ON activities(type, user_id);

-- Step 6: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS activities_updated_at ON activities;
CREATE TRIGGER activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_activities_updated_at();

-- Note: Old columns (related_user_id, activity_type) are kept for now
-- You can drop them later after verifying everything works:
-- ALTER TABLE activities DROP COLUMN IF EXISTS related_user_id;
-- ALTER TABLE activities DROP COLUMN IF EXISTS activity_type;

