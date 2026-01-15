# Debug: Why "test_user" doesn't appear in search

## Quick Check in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find the row for "test_user" account
4. Check these fields:
   - `username` - Should be "test_user" (or similar)
   - `first_name` - Could be set
   - `id` - Note this UUID

## Common Issues

### Issue 1: Username not set
If `username` is NULL/empty, the user won't show up because the code filters out users without a `username` OR `first_name`.

**Fix:** The user needs to complete onboarding and set a username.

### Issue 2: Already connected
If there's already a friendship (pending, accepted, or declined) between your main account and "test_user", they won't show up in search.

**Check:** Go to **Table Editor** → **friendships** and search for the user IDs.

### Issue 3: Case sensitivity
Usernames are case-insensitive in the database (stored as-is, but search is case-insensitive). Make sure you're searching for the exact username.

## Debug Steps

1. **Check console logs** - The code now logs:
   - How many users were fetched
   - Which users are connected
   - Which users are available after filtering
   - Available usernames

2. **Check database directly:**
   ```sql
   -- In Supabase SQL Editor, run:
   SELECT id, username, first_name, last_name, email 
   FROM profiles 
   WHERE username ILIKE '%test_user%' OR email ILIKE '%test%';
   ```

3. **Check if already connected:**
   ```sql
   -- Replace YOUR_USER_ID and TEST_USER_ID with actual UUIDs
   SELECT * FROM friendships 
   WHERE (user_id = 'YOUR_USER_ID' AND friend_id = 'TEST_USER_ID')
      OR (user_id = 'TEST_USER_ID' AND friend_id = 'YOUR_USER_ID');
   ```

## Quick Fix

If "test_user" doesn't have a username:
1. Log in as "test_user"
2. Complete onboarding (especially the username step)
3. Log back in as your main account
4. Try searching again


