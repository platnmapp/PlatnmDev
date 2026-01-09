# How to View Share Extension Console Logs

## The Problem
iOS Share Extensions run in a **separate process** from your main app, so their logs don't appear in the standard Xcode console by default.

## Solutions

### Method 1: Xcode Console (Easiest)
1. Open Xcode
2. Go to **Window → Devices and Simulators** (or press `Cmd+Shift+2`)
3. Select your iPhone
4. Click **"Open Console"** button at the bottom
5. In the console, search for: `PLATNM_SHARE_EXT_2024`
6. OR filter by process: Select "ShareExtension" from the process dropdown

### Method 2: Terminal (macOS Console.app)
1. Open **Console.app** (Applications → Utilities → Console)
2. Select your iPhone from the left sidebar (under "Devices")
3. In the search box, type: `PLATNM_SHARE_EXT_2024`
4. Filter to see only Share Extension logs

### Method 3: Terminal Command
Run this command while your device is connected:
```bash
xcrun simctl spawn booted log stream --predicate 'subsystem == "com.leonardodeltoro.platnm.app.ShareExtension"' --level debug
```

Or for physical device:
```bash
# First, get your device UDID
xcrun xctrace list devices

# Then stream logs (replace UDID with your device UDID)
idevicesyslog -u YOUR_DEVICE_UDID | grep "PLATNM_SHARE_EXT_2024"
```

### Method 4: In Xcode While Debugging
1. Run your app in Xcode
2. When the Share Extension appears, go to **Debug → Attach to Process → ShareExtension**
3. OR set a breakpoint in `ShareViewController.swift` - Xcode will attach automatically
4. Then logs will appear in the Xcode console

## What the Logs Show

All logs are prefixed with: `PLATNM_SHARE_EXT_2024`

You should see logs like:
- `PLATNM_SHARE_EXT_2024: ====== SHARE EXTENSION viewDidLoad CALLED ======`
- `PLATNM_SHARE_EXT_2024: loadSharedContent called`
- `PLATNM_SHARE_EXT_2024: Loaded URL: https://...`
- `PLATNM_SHARE_EXT_2024: fetchMusicMetadata called with URL: ...`
- `PLATNM_SHARE_EXT_2024: Response status code: 200` (or error codes)
- `PLATNM_SHARE_EXT_2024: Successfully fetched metadata - Title: ..., Artist: ...`

## Why Logs Might Not Appear

1. **Extension not running**: If the extension crashes immediately, logs won't appear
2. **Wrong process selected**: Make sure you're viewing "ShareExtension" process logs, not "platnm" app logs
3. **Log level filtering**: Some log viewers filter by level - make sure DEBUG/INFO logs are shown
4. **Device vs Simulator**: Physical device logs require additional setup (Console.app or idevicesyslog)

## Quick Test

After sharing from Spotify, immediately:
1. Open Console.app
2. Select your iPhone
3. Search: `PLATNM_SHARE_EXT_2024`
4. You should see logs starting with `viewDidLoad called`

If you see NO logs at all, the extension might not be launching. Check:
- Is the Share Extension properly installed? (Settings → General → VPN & Device Management)
- Is the extension enabled? (Settings → Share Extension → Platnm)
- Does the extension target build successfully?

