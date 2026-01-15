-- Create activity records for existing pending friend requests
-- This will make them appear in the Activity screen

INSERT INTO activities (user_id, actor_id, type, is_actionable, is_completed, created_at)
SELECT 
  f.friend_id as user_id,  -- The person receiving the request
  f.user_id as actor_id,   -- The person who sent the request
  'friend_request' as type,
  true as is_actionable,
  false as is_completed,
  f.created_at
FROM friendships f
WHERE f.status = 'pending'
  AND NOT EXISTS (
    -- Only insert if an activity doesn't already exist
    SELECT 1 FROM activities a
    WHERE a.user_id = f.friend_id
      AND a.actor_id = f.user_id
      AND a.type = 'friend_request'
      AND a.is_completed = false
  );

-- This will create activities for all pending friend requests that don't already have activities


