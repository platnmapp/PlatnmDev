# How to Check if Share Extension is Running

## Method 1: Check the Log File (MOST RELIABLE)

The Share Extension now writes logs to a file that both the extension and main app can access.

**To view the logs:**

1. **Using Xcode:**
   - Open your project in Xcode
   - Go to **Window → Devices and Simulators**
   - Select your iPhone
   - Click **"View Device Logs"** (not "Open Console")
   - OR use Finder to browse the app's container

2. **Using Terminal:**
   ```bash
   # The log file is stored in the App Group container
   # You can access it from your Mac if you have the app's container path
   ```

3. **From your React Native app:**
   Add this code to read the log file:
   ```typescript
   import RNFS from 'react-native-fs';
   
   const readShareExtensionLogs = async () => {
     const appGroupId = "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app";
     // The log file path would be in the App Group container
   };
   ```

## Method 2: Check System Logs (All Processes)

In Console.app, search for:
- Process: `ShareExtension`
- OR subsystem: `com.leonardodeltoro.platnm.app.ShareExtension`
- OR just search for any text containing: `ShareExtension`

## Method 3: Verify Extension is Installed

1. Go to **Settings → General → VPN & Device Management** on your iPhone
2. Check that your development profile shows both:
   - `platnm` (main app)
   - `ShareExtension` (the extension)

3. Go to **Settings → Share Extension** (or Settings → [Your App Name])
4. Make sure "Platnm" share extension is enabled

## Method 4: Check for Crashes

1. In Xcode: **Window → Devices and Simulators → View Device Logs**
2. Look for any crash reports from "ShareExtension"
3. Check the crash reason and stack trace

## Method 5: Add Breakpoint

1. Open `ShareViewController.swift` in Xcode
2. Set a breakpoint at the first line of `viewDidLoad()`
3. Run your app
4. Share from Spotify
5. Xcode should pause at the breakpoint - this confirms the extension is running

## Debugging Steps

If you see NO logs at all:

1. **Extension might not be installed:**
   - Delete the app completely from your iPhone
   - Rebuild and reinstall: `npx expo run:ios --device`

2. **Extension might be crashing immediately:**
   - Check Xcode crash logs
   - Look for any red error messages in Xcode when building

3. **Extension process name might be different:**
   - In Console.app, search for: `platnm` (without ShareExtension)
   - Or search for: `com.leonardodeltoro.platnm`

4. **Try this command to see ALL system logs:**
   ```bash
   # In Terminal, stream ALL logs from your device
   idevicesyslog | grep -i "platnm\|share"
   ```

## What to Look For

Even if `PLATNM_SHARE_EXT_2024` doesn't appear, look for:
- Any mention of "ShareExtension"
- Any crash reports
- Any errors related to the extension
- The bundle identifier: `com.leonardodeltoro.platnm.app.ShareExtension`

