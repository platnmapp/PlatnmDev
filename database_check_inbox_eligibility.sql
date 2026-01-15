-- ===================================================================
-- CHECK INBOX ELIGIBILITY: Verify why songs aren't appearing
-- ===================================================================
-- This checks if songs are eligible for inbox and if receiver_id matches

-- 1. Check all inbox-eligible songs and their receiver_ids
SELECT 
    'Inbox eligible songs' as check_type,
    ss.id,
    ss.receiver_id,
    ss.sender_id,
    ss.song_title,
    ss.song_artist,
    ss.is_queued,
    ss.liked,
    ss.created_at,
    p_receiver.username as receiver_username,
    p_sender.username as sender_username
FROM shared_songs ss
LEFT JOIN profiles p_receiver ON p_receiver.id = ss.receiver_id
LEFT JOIN profiles p_sender ON p_sender.id = ss.sender_id
WHERE ss.liked IS NULL
  AND (ss.is_queued = false OR ss.is_queued IS NULL)
ORDER BY ss.created_at DESC
LIMIT 20;

-- 2. Check RLS policies on shared_songs
SELECT 
    'RLS Policies' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'shared_songs';

-- 3. Count songs per receiver
SELECT 
    'Songs per receiver' as check_type,
    ss.receiver_id,
    p.username as receiver_username,
    COUNT(*) as inbox_eligible_count
FROM shared_songs ss
LEFT JOIN profiles p ON p.id = ss.receiver_id
WHERE ss.liked IS NULL
  AND (ss.is_queued = false OR ss.is_queued IS NULL)
GROUP BY ss.receiver_id, p.username
ORDER BY inbox_eligible_count DESC;

-- 4. Check if test_user has any inbox-eligible songs
-- Replace 'test_user' with the actual username or use the UUID
SELECT 
    'test_user inbox songs' as check_type,
    ss.id,
    ss.song_title,
    ss.song_artist,
    ss.created_at,
    p_sender.username as sender_username
FROM shared_songs ss
INNER JOIN profiles p_receiver ON p_receiver.id = ss.receiver_id
LEFT JOIN profiles p_sender ON p_sender.id = ss.sender_id
WHERE p_receiver.username = 'test_user'  -- Change this to match your test_user username
  AND ss.liked IS NULL
  AND (ss.is_queued = false OR ss.is_queued IS NULL)
ORDER BY ss.created_at DESC;

