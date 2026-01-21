-- ===================================================================
-- FIX EXISTING "break the bank" RECORD
-- ===================================================================

-- Update the "break the bank" record to set liked = NULL (unreacted)
UPDATE shared_songs 
SET liked = NULL 
WHERE song_title ILIKE '%break the bank%'
  AND receiver_id = (SELECT id FROM profiles WHERE username = 'test_user')
  AND created_at > NOW() - INTERVAL '2 hours'
  AND liked = false;  -- Only update if it's currently false (not already liked)

-- Verify the fix
SELECT 
    'Fixed record' as status,
    id,
    song_title,
    song_artist,
    is_queued,
    liked,
    created_at,
    (SELECT username FROM profiles WHERE id = receiver_id) as receiver_username
FROM shared_songs
WHERE song_title ILIKE '%break the bank%'
  AND receiver_id = (SELECT id FROM profiles WHERE username = 'test_user')
ORDER BY created_at DESC
LIMIT 1;

-- Check inbox eligibility for test_user
SELECT 
    'Inbox eligible count' as status,
    COUNT(*) as count
FROM shared_songs
WHERE receiver_id = (SELECT id FROM profiles WHERE username = 'test_user')
  AND liked IS NULL
  AND (is_queued = false OR is_queued IS NULL);


