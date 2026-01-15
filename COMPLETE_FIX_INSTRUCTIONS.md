# Complete Fix: Activities Schema Mismatch

## Step 1: Run the Schema Migration

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy and paste the entire contents of `database_migrate_activities_schema.sql`
3. Click **Run** (or press Cmd/Ctrl + Enter)
4. This will:
   - Add the new columns (`actor_id`, `type`, `is_actionable`, `is_completed`, `updated_at`)
   - Migrate existing data from old columns to new columns
   - Make the new columns required
   - Add indexes for performance

## Step 2: Create Missing Activities for Existing Friend Requests

After the migration, create activities for existing pending friend requests:

```sql
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

## Step 3: Set Up Auto-Create Trigger (Optional but Recommended)

To ensure activities are always created automatically in the future:

1. Copy the contents of `database_auto_create_friend_request_activity_FIXED.sql`
2. Run it in Supabase SQL Editor

This creates a database trigger that automatically creates activities whenever a friend request is created.

## Step 4: Test the App

1. Go to the **Activity** screen in your app
2. You should now see the friend request from "test_user"!
3. You can accept/decline it

## What Was Fixed

- ✅ Database schema now matches the code expectations
- ✅ Existing activities are migrated to new schema
- ✅ Future friend requests will automatically create activities
- ✅ All activity-related code will now work correctly

## Cleanup (Optional, Later)

Once everything works, you can optionally remove the old columns:

```sql
ALTER TABLE activities 
  DROP COLUMN IF EXISTS related_user_id,
  DROP COLUMN IF EXISTS activity_type;
```

But wait until you've verified everything works first!


