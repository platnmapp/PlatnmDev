-- ===================================================================
-- FIX SELECT POLICY FOR ACTIVITIES TABLE
-- ===================================================================
-- Currently, users can only see activities where they are the recipient (user_id).
-- We need to also allow them to see activities where they are the actor (for song shares).
-- ===================================================================

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view own activities" ON activities;

-- Create new SELECT policy that allows users to see:
-- 1. Activities where they are the recipient (user_id = auth.uid())
-- 2. Activities where they are the actor AND type is song_sent/song_shared (actor_id = auth.uid())
CREATE POLICY "Users can view own activities" ON activities 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR (auth.uid() = actor_id AND type IN ('song_sent', 'song_shared'))
  );

