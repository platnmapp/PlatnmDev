-- ===================================================================
-- CHECK RECENT ACTIVITIES: Verify if activities are being created
-- ===================================================================

-- Check most recent activities for test_user
SELECT 
    'Recent activities for test_user' as check_type,
    id,
    user_id,
    actor_id,
    type,
    song_title,
    song_artist,
    is_actionable,
    is_completed,
    created_at,
    (SELECT username FROM profiles WHERE id = user_id) as recipient_username,
    (SELECT username FROM profiles WHERE id = actor_id) as sender_username
FROM activities
WHERE user_id = (SELECT id FROM profiles WHERE username = 'test_user')
   OR actor_id = (SELECT id FROM profiles WHERE username = 'test_user')
ORDER BY created_at DESC
LIMIT 10;

-- Check activities for the most recent shared song
SELECT 
    'Activities for latest shared song' as check_type,
    a.id,
    a.user_id,
    a.actor_id,
    a.type,
    a.song_title,
    a.song_artist,
    a.created_at,
    (SELECT username FROM profiles WHERE id = a.user_id) as recipient_username,
    (SELECT username FROM profiles WHERE id = a.actor_id) as sender_username
FROM activities a
WHERE a.song_title = (SELECT song_title FROM shared_songs ORDER BY created_at DESC LIMIT 1)
  AND a.created_at > NOW() - INTERVAL '1 hour'
ORDER BY a.created_at DESC;


