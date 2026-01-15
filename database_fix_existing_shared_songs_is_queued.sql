-- ===================================================================
-- FIX EXISTING SHARED_SONGS: Set is_queued = false for songs that
-- have activity records (song_sent/song_shared) so they appear in inbox
-- ===================================================================
-- This makes all songs that were shared (and appear in activities) 
-- also appear in the homepage inbox

-- First, ensure is_queued column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'shared_songs' 
        AND column_name = 'is_queued'
    ) THEN
        -- Column doesn't exist, add it with default value false
        ALTER TABLE shared_songs 
        ADD COLUMN IF NOT EXISTS is_queued BOOLEAN DEFAULT false;
        
        RAISE NOTICE 'Added is_queued column to shared_songs table';
    END IF;
END $$;

-- Update all shared_songs that have corresponding activity records
-- Set is_queued = false for songs that were shared (have activities)
-- Only update songs where liked IS NULL (unreacted songs that should be in inbox)
UPDATE shared_songs ss
SET is_queued = false
WHERE 
    -- Song has a corresponding activity where user is the recipient
    EXISTS (
        SELECT 1 
        FROM activities a
        WHERE a.user_id = ss.receiver_id
          AND a.actor_id = ss.sender_id
          AND a.type IN ('song_sent', 'song_shared')
          AND (
              -- Match by song title and artist (most reliable)
              (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
              OR
              -- Or match by created_at being close (within 5 minutes) - fallback
              (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
          )
    )
    -- Only update if:
    -- 1. is_queued is NULL or true (don't update if already false)
    AND (ss.is_queued IS NULL OR ss.is_queued = true)
    -- 2. liked IS NULL (unreacted songs should be in inbox)
    AND ss.liked IS NULL;

-- Also update any remaining NULL is_queued values to false for unreacted songs
-- (songs that don't have activity records but should still appear in inbox)
UPDATE shared_songs
SET is_queued = false
WHERE is_queued IS NULL
  AND liked IS NULL;

-- Verify the fix
SELECT 
    'Total shared_songs' as metric,
    COUNT(*) as count
FROM shared_songs

UNION ALL

SELECT 
    'Inbox eligible (is_queued=false, liked=NULL)',
    COUNT(*)
FROM shared_songs
WHERE is_queued = false AND liked IS NULL

UNION ALL

SELECT 
    'Has activity records',
    COUNT(DISTINCT ss.id)
FROM shared_songs ss
WHERE EXISTS (
    SELECT 1 
    FROM activities a
    WHERE a.user_id = ss.receiver_id
      AND a.actor_id = ss.sender_id
      AND a.type IN ('song_sent', 'song_shared')
      AND (
          (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
          OR
          (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
      )
)

UNION ALL

SELECT 
    'Has activity AND is inbox eligible',
    COUNT(DISTINCT ss.id)
FROM shared_songs ss
WHERE ss.is_queued = false 
  AND ss.liked IS NULL
  AND EXISTS (
    SELECT 1 
    FROM activities a
    WHERE a.user_id = ss.receiver_id
      AND a.actor_id = ss.sender_id
      AND a.type IN ('song_sent', 'song_shared')
      AND (
          (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
          OR
          (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
      )
  );
