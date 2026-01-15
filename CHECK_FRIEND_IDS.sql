-- Check which users the friend_ids belong to
SELECT 
  f.id as friendship_id,
  f.user_id,
  f.friend_id,
  f.status,
  u1.email as requester_email,
  u1.username as requester_username,
  u2.email as friend_email,
  u2.username as friend_username
FROM friendships f
LEFT JOIN profiles u1 ON f.user_id = u1.id
LEFT JOIN profiles u2 ON f.friend_id = u2.id;

-- This will show you which emails/usernames correspond to those UUIDs


