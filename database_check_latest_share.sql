-- ===================================================================
-- CHECK LATEST SHARED SONG: Verify the most recently created record
-- ===================================================================

-- Check the most recent shared_songs record (should be the one just shared)
SELECT 
    'Latest shared_song' as check_type,
    id,
    sender_id,
    receiver_id,
    song_title,
    song_artist,
    is_queued,
    liked,
    created_at,
    (SELECT username FROM profiles WHERE id = sender_id) as sender_username,
    (SELECT username FROM profiles WHERE id = receiver_id) as receiver_username
FROM shared_songs
ORDER BY created_at DESC
LIMIT 5;

-- Check if there's a DEFAULT constraint on liked column
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'shared_songs' 
  AND column_name IN ('liked', 'is_queued');

