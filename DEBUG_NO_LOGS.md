# Debugging: No Console Logs Appear

## Problem
When sharing from Spotify to Platnm, **NO console logs appear at all**.

## Why This Happens
If no logs appear, it means one of these things:
1. **The Share Extension isn't launching** (most likely)
2. **The Share Extension is crashing immediately** before any code runs
3. **The extension code isn't being executed** (wrong view controller or not configured)

## Critical Check: File-Based Logging

The code now writes logs to a **file** in the App Group container. This is the most reliable way to see if the extension is running.

### How to Check the Log File

1. **Connect your iPhone to your Mac**
2. **Open Xcode**
3. **Window → Devices and Simulators** (or press `Cmd+Shift+2`)
4. **Select your iPhone** from the left sidebar
5. **Click on "platnm" app** under "Installed Apps"
6. **Click "Download Container..."**
7. **Right-click the downloaded `.xcappdata` file → "Show Package Contents"**
8. **Navigate to**: `AppData/Library/Group Containers/group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app/share_extension_log.txt`

### What to Look For

If the file exists and has content, the extension IS running, but logs aren't showing in Console.app.

If the file doesn't exist or is empty, the extension IS NOT running at all.

## Most Likely Issues

### Issue 1: Extension Not Properly Installed
**Solution**: Uninstall and reinstall the app completely:
```bash
# On your iPhone, delete the app completely
# Then rebuild and install:
cd ~/Desktop/PlatnmDev
npx expo run:ios --device "00008030-0015654C1ED8C02E"
```

### Issue 2: Extension Not Enabled in Settings
1. Go to **Settings → Platnm** on your iPhone
2. Look for **Share Extension** or **Siri & Search** settings
3. Make sure the extension is enabled

### Issue 3: Extension Bundle ID Mismatch
The extension bundle ID must be: `com.leonardodeltoro.platnm.app.ShareExtension`

To check:
1. Open Xcode
2. Select the **ShareExtension** target
3. Go to **Signing & Capabilities**
4. Verify the **Bundle Identifier** is correct

### Issue 4: Info.plist Configuration
The `NSExtensionPrincipalClass` in `Info.plist` must match exactly:
- Must be: `ShareExtension.ShareViewController` (or `$(PRODUCT_MODULE_NAME).ShareViewController`)

## Next Steps

1. **Check the log file first** (instructions above)
2. **If file doesn't exist**: Extension isn't running - check installation and bundle ID
3. **If file exists but empty**: Extension is crashing immediately - check for crashes in Console.app
4. **If file has content**: Extension is running! Logs are just not showing in Console.app - use file-based logging

## Search Console.app for Crashes

Even if you don't see our logs, look for **crashes**:

1. Open Console.app
2. Search for: `ShareExtension` OR `com.leonardodeltoro.platnm.app.ShareExtension`
3. Filter by: **Errors and Faults** tab
4. Look for crash reports right after you try to share

## Alternative: Check Extension Process

In Console.app, search for:
- `xpcservice` (this is how extensions run)
- Filter by Process containing: `platnm` or `ShareExtension`
- Look for any messages right when you share

