-- ===================================================================
-- DIAGNOSTIC QUERY: Check why shared_songs aren't being updated
-- ===================================================================

-- 1. Check if is_queued column exists and its current values
SELECT 
    'is_queued column status' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'shared_songs' AND column_name = 'is_queued'
        ) THEN 'Column exists'
        ELSE 'Column MISSING'
    END as status;

-- 2. Check distribution of is_queued values
SELECT 
    'is_queued values' as check_type,
    is_queued,
    COUNT(*) as count
FROM shared_songs
GROUP BY is_queued;

-- 3. Check distribution of liked values
SELECT 
    'liked values' as check_type,
    liked,
    COUNT(*) as count
FROM shared_songs
GROUP BY liked;

-- 4. Check shared_songs that have activity records but aren't being updated
SELECT 
    'Sample shared_songs with activities' as check_type,
    ss.id,
    ss.sender_id,
    ss.receiver_id,
    ss.song_title,
    ss.song_artist,
    ss.is_queued,
    ss.liked,
    ss.created_at,
    a.id as activity_id,
    a.type as activity_type,
    a.created_at as activity_created_at,
    CASE 
        WHEN ss.song_title = a.song_title AND ss.song_artist = a.song_artist THEN 'Title/Artist match'
        WHEN ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300 THEN 'Timing match'
        ELSE 'No match'
    END as match_type
FROM shared_songs ss
INNER JOIN activities a ON (
    a.user_id = ss.receiver_id
    AND a.actor_id = ss.sender_id
    AND a.type IN ('song_sent', 'song_shared')
    AND (
        (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
        OR
        (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
    )
)
LIMIT 10;

-- 5. Check why UPDATE conditions aren't matching
SELECT 
    'Why UPDATE won''t run' as check_type,
    ss.id,
    ss.is_queued,
    ss.liked,
    CASE 
        WHEN ss.is_queued IS NULL THEN 'is_queued is NULL (should update)'
        WHEN ss.is_queued = true THEN 'is_queued is true (should update)'
        WHEN ss.is_queued = false THEN 'is_queued is false (already correct)'
        ELSE 'is_queued is other'
    END as is_queued_status,
    CASE 
        WHEN ss.liked IS NULL THEN 'liked is NULL (should update)'
        WHEN ss.liked = true THEN 'liked is true (won''t update - already reacted)'
        WHEN ss.liked = false THEN 'liked is false (won''t update - already reacted)'
        ELSE 'liked is other'
    END as liked_status,
    EXISTS (
        SELECT 1 FROM activities a
        WHERE a.user_id = ss.receiver_id
          AND a.actor_id = ss.sender_id
          AND a.type IN ('song_sent', 'song_shared')
          AND (
              (a.song_title = ss.song_title AND a.song_artist = ss.song_artist)
              OR
              (ABS(EXTRACT(EPOCH FROM (a.created_at - ss.created_at))) < 300)
          )
    ) as has_activity
FROM shared_songs ss
LIMIT 20;

