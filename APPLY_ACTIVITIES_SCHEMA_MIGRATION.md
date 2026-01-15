# Apply Activities Schema Migration

## The Problem

Your database schema doesn't match your code:
- **Database has:** `related_user_id`, `activity_type`
- **Code expects:** `actor_id`, `type`, `is_actionable`, `is_completed`

This causes activities to fail when created or read.

## The Solution

Run this migration to update your database schema to match the code.

## Steps

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run the migration script** (`database_migrate_activities_schema.sql`)

3. **Verify it worked:**
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'activities' 
   ORDER BY ordinal_position;
   ```
   
   You should see: `actor_id`, `type`, `is_actionable`, `is_completed`, `updated_at`

4. **Test the app** - Activities should now work correctly!

## What This Does

- Adds new columns: `actor_id`, `type`, `is_actionable`, `is_completed`, `updated_at`
- Migrates existing data from old columns to new columns
- Makes the new columns required (NOT NULL)
- Adds indexes for performance
- Keeps old columns temporarily (you can drop them later)

## After Migration

Once everything works, you can optionally clean up the old columns:
```sql
ALTER TABLE activities 
  DROP COLUMN IF EXISTS related_user_id,
  DROP COLUMN IF EXISTS activity_type;
```

But wait until you've verified everything works first!


