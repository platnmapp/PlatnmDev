# ⚠️ CRITICAL: Database Schema Mismatch

## The Problem

Your database schema doesn't match your code! 

**Database has:**
- `activity_type` (TEXT, NOT NULL)
- `related_user_id` (UUID)
- `read` (BOOLEAN)
- NO `is_actionable` or `is_completed` columns

**Code expects:**
- `type` (should be `activity_type`)
- `actor_id` (should be `related_user_id`)
- `is_actionable` (doesn't exist in DB)
- `is_completed` (doesn't exist in DB)

## This Means

The code in `activityService.ts` is broken! It's trying to insert columns that don't exist, so activities are probably failing to create.

## Quick Fix for Existing Requests

Use this SQL (matches your actual database schema):

```sql
INSERT INTO activities (user_id, related_user_id, activity_type, created_at)
SELECT 
  f.friend_id as user_id,
  f.user_id as related_user_id,
  'friend_request' as activity_type,
  f.created_at
FROM friendships f
WHERE f.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 FROM activities a
    WHERE a.user_id = f.friend_id
      AND a.related_user_id = f.user_id
      AND a.activity_type = 'friend_request'
  );
```

## Long-term Fix

You need to either:
1. **Update the database** to match the code (add `actor_id`, `type`, `is_actionable`, `is_completed`)
2. **Update the code** to match the database (use `activity_type`, `related_user_id`, remove `is_actionable`/`is_completed`)

This is why activities aren't being created - the code is using wrong column names!


