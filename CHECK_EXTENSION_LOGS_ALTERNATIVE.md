# Alternative Ways to Check Share Extension Logs

## Method 1: Use Console.app Directly (Easiest)

1. **Open Console.app** on your Mac
2. **Connect your iPhone** to your Mac
3. **Select your iPhone** from the left sidebar in Console.app (under "Devices")
4. **Share from Spotify to Platnm** on your iPhone
5. **Immediately look at Console.app** - you should see logs appear in real-time

### What to Search For:
- Search for: `PLATNM_SHARE_EXT_2024` (our log identifier)
- OR search for: `xpcservice` and filter by process containing `platnm`
- OR search for: `ShareExtension` or `ShareViewController`

## Method 2: Check for Crashes

Even if you don't see our logs, check if the extension is crashing:

1. **Open Console.app**
2. **Select your iPhone** from left sidebar
3. **Click "Errors and Faults" tab**
4. **Share from Spotify to Platnm**
5. **Look for any crash reports** with "ShareExtension" in them

## Method 3: Use Xcode's Log Viewer

1. **Open Xcode**
2. **Window → Devices and Simulators** (Cmd+Shift+2)
3. **Select your iPhone** from left sidebar
4. **Select "platnm" app** from "Installed Apps" list
5. **Click "Open Console" button** (at the top, next to "Take Screenshot")
6. **Share from Spotify to Platnm**
7. **Watch the console** - logs should appear in real-time

## Method 4: Check if Extension Even Appears in Share Sheet

If the extension isn't showing up in Spotify's share sheet at all, that's a different problem:

1. **Open Spotify** on your iPhone
2. **Go to any song**
3. **Tap "Share" button**
4. **Scroll through the share sheet** - do you see "Platnm" as an option?

If you DON'T see "Platnm" in the share sheet, the extension isn't properly installed or enabled.

## Method 5: Force Extension to Log (Simplest Test)

The extension now logs to a file. To check if it's running at all:

1. **Share from Spotify to Platnm** (even if nothing seems to happen)
2. **Wait 2 seconds**
3. **Open the main Platnm app** on your iPhone
4. **The app should try to read from the App Group** - if it finds a shared URL, the extension ran!

## What to Tell Me

After trying these methods, tell me:
1. Do you see "Platnm" in Spotify's share sheet? (Yes/No)
2. Do you see ANY logs in Console.app when you share? (Yes/No - even if they're not our specific logs)
3. Do you see any crash reports in Console.app? (Yes/No)
4. Does anything at all happen when you tap "Platnm" in the share sheet? (Yes - UI appears / Yes - brief flash / No - nothing)

