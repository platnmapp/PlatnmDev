# Fix: Missing Friend Request Activities

## The Problem

You have pending friend requests in the `friendships` table, but they don't appear in the Activity screen because the corresponding `activities` records were never created.

## The Solution

Run this SQL query in your Supabase SQL Editor to create the missing activity records:

```sql
-- Create activity records for existing pending friend requests
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
```

## Steps

1. Go to Supabase Dashboard → SQL Editor
2. Paste the SQL query above
3. Click "Run" (or press Cmd/Ctrl + Enter)
4. Go back to your app's Activity screen
5. You should now see the friend request from "test_user"!

## Why This Happened

The friend requests were created (either manually or through some process that didn't call `createFriendRequestActivity`), but the corresponding activity records weren't created. The Activity screen only shows activities, not friendships directly.


