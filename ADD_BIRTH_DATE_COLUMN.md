# Add Birth Date Column to Profiles Table

The `profiles` table is missing the `birth_date` column. Follow these steps to add it:

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste this SQL:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Option 2: Via Supabase CLI

```bash
cd ~/Desktop/PlatnmDev
supabase db push
```

Or if you have the SQL file:

```bash
supabase db execute -f database_add_birthday_field.sql
```

## Verify It Worked

After running the migration:
1. Go to **Table Editor** in Supabase Dashboard
2. Select the `profiles` table
3. Check that `birth_date` column appears in the list
4. Try entering your birthday again in the app

The error should be resolved and your birthday will save successfully!

