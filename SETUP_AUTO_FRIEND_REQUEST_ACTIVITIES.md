# Setup: Auto-Create Friend Request Activities

## The Problem

Friend requests are created in the `friendships` table, but sometimes the corresponding `activities` records aren't created. This happens if:
- The app code fails to call `createFriendRequestActivity`
- Friend requests are created manually or through other processes
- There's a network error when creating activities

## The Solution

Create a **database trigger** that automatically creates activity records whenever a friend request is inserted. This ensures activities are ALWAYS created, regardless of how the friendship is created.

## Steps

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Paste and run this SQL:

```sql
-- Create a database trigger to automatically create activity records
-- when a friend request (pending friendship) is created
CREATE OR REPLACE FUNCTION create_friend_request_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create activity if status is 'pending'
  IF NEW.status = 'pending' THEN
    INSERT INTO activities (
      user_id,      -- The person receiving the request (friend_id)
      actor_id,     -- The person who sent the request (user_id)
      type,
      is_actionable,
      is_completed,
      created_at
    )
    VALUES (
      NEW.friend_id,
      NEW.user_id,
      'friend_request',
      true,
      false,
      NEW.created_at
    )
    ON CONFLICT DO NOTHING; -- Prevent duplicates if activity already exists
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_friendship_created ON friendships;
CREATE TRIGGER on_friendship_created
  AFTER INSERT ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION create_friend_request_activity();
```

3. **Done!** Now every time a friend request is created, an activity will be automatically created too.

## How It Works

- The trigger fires **after** a new row is inserted into `friendships`
- If the status is `'pending'`, it automatically creates a corresponding activity
- Uses `ON CONFLICT DO NOTHING` to prevent duplicates
- Works even if the app code fails or if requests are created manually

## Fix Existing Requests

After setting up the trigger, run this to create activities for existing pending requests:

```sql
-- Create activity records for existing pending friend requests
INSERT INTO activities (user_id, actor_id, type, is_actionable, is_completed, created_at)
SELECT 
  f.friend_id as user_id,
  f.user_id as actor_id,
  'friend_request' as type,
  true as is_actionable,
  false as is_completed,
  f.created_at
FROM friendships f
WHERE f.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 FROM activities a
    WHERE a.user_id = f.friend_id
      AND a.actor_id = f.user_id
      AND a.type = 'friend_request'
      AND a.is_completed = false
  );
```

