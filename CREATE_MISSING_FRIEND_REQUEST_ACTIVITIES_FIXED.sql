-- Create activity records for existing pending friend requests
-- Using the ACTUAL database schema: activity_type and related_user_id

INSERT INTO activities (user_id, related_user_id, activity_type, created_at)
SELECT 
  f.friend_id as user_id,        -- The person receiving the request
  f.user_id as related_user_id,  -- The person who sent the request
  'friend_request' as activity_type,
  f.created_at
FROM friendships f
WHERE f.status = 'pending'
  AND NOT EXISTS (
    -- Only insert if an activity doesn't already exist
    SELECT 1 FROM activities a
    WHERE a.user_id = f.friend_id
      AND a.related_user_id = f.user_id
      AND a.activity_type = 'friend_request'
  );


