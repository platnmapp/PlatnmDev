-- Create a database trigger to automatically create activity records
-- when a friend request (pending friendship) is created
-- This uses the NEW schema: actor_id, type, is_actionable, is_completed

CREATE OR REPLACE FUNCTION create_friend_request_activity()
RETURNS TRIGGER AS $$
BEGIN
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
    ON CONFLICT DO NOTHING;
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

