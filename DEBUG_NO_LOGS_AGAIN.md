# Debugging: No Logs Appearing When Sharing

## Step 1: Verify Extension is Still Installed

1. **On your iPhone:** Go to **Settings** → **Platnm** (or search for "Platnm" in Settings)
2. Check if there's a **Share Extension** or **Siri & Search** section
3. Make sure it's enabled

## Step 2: Verify Extension Appears in Share Sheet

1. Open **Spotify** on your iPhone
2. Go to any song
3. Tap **"Share"**
4. **Scroll through the share options** - do you see **"Platnm"** in the list?

If you DON'T see "Platnm", the extension isn't installed/enabled.

## Step 3: Check Console.app Setup

1. **Open Console.app** on your Mac
2. **Connect your iPhone** via USB
3. **Select your iPhone** from the left sidebar (under "Devices")
4. **Clear the log** (click "Clear" or press Cmd+K)
5. **On your iPhone:** Share from Spotify to Platnm
6. **Immediately look at Console.app** (within 2 seconds)

### Search Settings in Console.app:
- Make sure you're searching in **"All Messages"** (not just errors)
- The search box should say **"ANY"** not "Process" or "Message"
- Search for: `PLATNM_SHARE_EXT_2024`
- Also try: `ShareExtension` or `xpcservice`

## Step 4: Check if Extension is Running at All

Even without our logs, you should see system logs when the extension launches:

1. In Console.app, search for: `com.leonardodeltoro.platnm.app.ShareExtension`
2. Or search for: `xpcservice` and filter by process containing `platnm`

## Step 5: Force Rebuild Extension

The extension might need to be reinstalled:

1. **Delete the Platnm app completely** from your iPhone
2. **Rebuild and reinstall:**
   ```bash
   cd ~/Desktop/PlatnmDev
   npx expo run:ios --device "00008030-0015654C1ED8C02E"
   ```
3. **Try sharing again**

## Step 6: Check File-Based Logs

The extension writes logs to a file. Let's check if those exist:

1. **Share from Spotify** (even if nothing happens)
2. **Open the Platnm app** on your iPhone
3. The app might have tried to read from the App Group

Or check via Xcode:
1. Open Xcode → Window → Devices and Simulators
2. Select your iPhone → Select "platnm" app
3. Look for container files (if accessible)

## Quick Test: Does Extension UI Appear?

When you tap "Platnm" in the share sheet:
- ✅ **UI appears** → Extension IS running, logs just aren't showing
- ❌ **Nothing happens** → Extension isn't launching
- ⚠️ **Brief flash** → Extension crashes immediately

Tell me which one happens!

