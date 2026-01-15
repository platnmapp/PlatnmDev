-- ===================================================================
-- RESET UNREACTED SONGS: Set liked = NULL for songs that should be unreacted
-- ===================================================================
-- The issue: All songs have liked = false, but they should be liked = NULL
-- (unreacted) to appear in the inbox. Songs with liked = false have been
-- explicitly disliked, which removes them from the inbox.

-- Strategy: Reset liked to NULL for songs that:
-- 1. Have activity records (were shared via Share Extension)
-- 2. Have is_queued = false (not in queue)
-- This makes them appear in the inbox as unreacted songs

-- Update shared_songs that have activity records to set liked = NULL
-- This resets them to "unreacted" status so they appear in inbox
UPDATE shared_songs ss
SET liked = NULL
WHERE 
    -- Song has a corresponding activity (was shared)
    EXISTS (
        SELECT 1 
        FROM activities a
        WHERE a.user_id = ss.receiver_id
          AND a.actor_id = ss.sender_id
          AND a.type IN ('song_sent', 'song_shared')
          AND (
              -- Match by song title and artist
              (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
              OR
              -- Or match by timing (within 5 minutes)
              (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
          )
    )
    -- Only update songs that:
    -- 1. Are not queued (is_queued = false)
    -- 2. Currently have liked = false (disliked)
    AND ss.is_queued = false
    AND ss.liked = false;

-- Verify the fix
SELECT 
    'Before fix: disliked songs' as status,
    COUNT(*) as count
FROM shared_songs
WHERE liked = false AND is_queued = false

UNION ALL

SELECT 
    'After fix: unreacted songs in inbox',
    COUNT(*)
FROM shared_songs
WHERE liked IS NULL AND is_queued = false

UNION ALL

SELECT 
    'Songs with activities that are now inbox eligible',
    COUNT(DISTINCT ss.id)
FROM shared_songs ss
WHERE ss.liked IS NULL 
  AND ss.is_queued = false
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

-- Show final breakdown
SELECT 
    'Final breakdown' as status,
    is_queued,
    liked,
    COUNT(*) as count
FROM shared_songs
GROUP BY is_queued, liked
ORDER BY is_queued, liked;

