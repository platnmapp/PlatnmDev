-- ===================================================================
-- SIMPLE FIX: Set is_queued = false for ALL unreacted shared_songs
-- ===================================================================
-- This is simpler - just update all songs where liked IS NULL
-- regardless of whether they have activity records

-- First, ensure is_queued column exists
ALTER TABLE shared_songs 
ADD COLUMN IF NOT EXISTS is_queued BOOLEAN DEFAULT false;

-- Update ALL unreacted songs (liked IS NULL) to have is_queued = false
-- This makes them appear in the inbox
UPDATE shared_songs
SET is_queued = false
WHERE liked IS NULL
  AND (is_queued IS NULL OR is_queued = true);

-- Get count of updated records
SELECT 
    'Updated records' as status,
    COUNT(*) as count
FROM shared_songs
WHERE is_queued = false AND liked IS NULL;

-- Show breakdown
SELECT 
    is_queued,
    liked,
    COUNT(*) as count
FROM shared_songs
GROUP BY is_queued, liked
ORDER BY is_queued, liked;

