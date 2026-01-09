# Simple Test: Is Share Extension Running?

## Quick 30-Second Test

### Step 1: Share from Spotify
1. Open Spotify on your iPhone
2. Go to any song
3. Tap "Share"
4. **Look for "Platnm" in the list** - do you see it? 
   - ✅ **YES** → Extension is installed, proceed to Step 2
   - ❌ **NO** → Extension isn't installed properly, need to rebuild

### Step 2: If You See "Platnm" Option
1. **Tap "Platnm"** in the share sheet
2. **What happens?**
   - ✅ **UI appears** → Extension IS running! Logs just aren't showing. We need to fix log visibility.
   - ⚠️ **Brief flash then nothing** → Extension is running but crashing or dismissing immediately
   - ❌ **Nothing happens** → Extension isn't launching

### Step 3: Check Console.app (2 minutes)
1. **Open Console.app** on your Mac
2. **Select your iPhone** from left sidebar (under "Devices")
3. **Clear the log** (click "Clear" button or Cmd+K)
4. **On your iPhone**: Share from Spotify to Platnm
5. **Immediately look at Console.app** - do you see ANY new messages appear?
   - ✅ **YES** → Extension is running, logs are there
   - ❌ **NO** → Extension isn't launching at all

## What to Report Back

Just answer these 3 questions:

1. **Do you see "Platnm" in Spotify's share sheet?** (Yes/No)
2. **What happens when you tap "Platnm"?** (UI appears / Brief flash / Nothing)
3. **Do you see ANY new messages in Console.app when you share?** (Yes/No)

With these answers, I can fix the exact issue!

