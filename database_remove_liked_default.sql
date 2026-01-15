-- ===================================================================
-- REMOVE DEFAULT VALUE FROM liked COLUMN
-- ===================================================================
-- The liked column has DEFAULT false, which prevents NULL values from being inserted.
-- We need to remove the default so unreacted songs can have liked = NULL

-- Remove DEFAULT constraint from liked column
ALTER TABLE shared_songs 
ALTER COLUMN liked DROP DEFAULT;

-- Verify the change
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'shared_songs' 
  AND column_name = 'liked';

-- Verify is_queued column (should keep default false, which is fine)
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'shared_songs' 
  AND column_name = 'is_queued';

