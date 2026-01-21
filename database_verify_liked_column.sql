-- ===================================================================
-- VERIFY liked COLUMN STATUS
-- ===================================================================

-- Check both columns explicitly
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'shared_songs' 
  AND column_name IN ('liked', 'is_queued')
ORDER BY column_name;

-- Check the latest shared song to see if liked is now NULL
SELECT 
    'Latest shared_song' as check_type,
    id,
    song_title,
    song_artist,
    is_queued,
    liked,
    created_at,
    (SELECT username FROM profiles WHERE id = receiver_id) as receiver_username
FROM shared_songs
WHERE song_title = 'break the bank'
ORDER BY created_at DESC
LIMIT 1;


