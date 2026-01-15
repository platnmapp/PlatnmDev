# Check if "test_user" is already connected

## Step 1: Check Friendships Table

1. In Supabase Dashboard, go to **Table Editor** → **friendships**
2. Look for any rows where:
   - `user_id` matches your main account's ID OR "test_user"'s ID
   - `friend_id` matches your main account's ID OR "test_user"'s ID

## Step 2: SQL Query to Check

Run this in Supabase SQL Editor (replace the IDs with your actual user IDs):

```sql
-- Find the user IDs first
SELECT id, email, username FROM profiles WHERE username IN ('test_user', 'YOUR_USERNAME');

-- Then check friendships (replace USER_ID_1 and USER_ID_2 with the actual UUIDs)
SELECT * FROM friendships 
WHERE (user_id = 'USER_ID_1' AND friend_id = 'USER_ID_2')
   OR (user_id = 'USER_ID_2' AND friend_id = 'USER_ID_1');
```

## Why This Matters

The code in `friends.tsx` filters out users who already have ANY friendship status (pending, accepted, or declined). If there's a friendship record, "test_user" won't show up in the search.

## If There's a Friendship

If you find a friendship record and want to test the search again:
1. Delete the friendship record from the `friendships` table
2. Refresh the friends screen in your app
3. Search for "test_user" again


