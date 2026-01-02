# Troubleshooting Dev Client Connection

## Issue: App stuck on white screen / Dev menu not working

### Step 1: Check Xcode Console

1. In Xcode, look at the bottom console area
2. Check for any error messages or crash logs
3. Look for messages about Metro bundler connection

### Step 2: Manual Metro Connection

Since shaking doesn't work, try connecting manually:

1. **Get your Mac's IP address:**
   - Run in terminal: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Or check: System Settings → Network → Wi-Fi → Details → IP Address

2. **On your iPhone:**
   - The app should try to connect automatically
   - If it doesn't, we may need to configure the connection URL

### Step 3: Check if App is Actually Running

The white screen might mean:
- ✅ App launched but can't connect to Metro
- ❌ App crashed immediately (check Xcode console)
- ❌ JavaScript bundle not loading

### Step 4: Alternative Ways to Open Dev Menu

1. **3-finger tap** on the screen
2. **Long press** with 3 fingers
3. Check if there's a button overlay (some dev clients show a floating button)

### Step 5: Rebuild with Proper Dev Client

If nothing works, we might need to rebuild:
```bash
cd /Users/platnm/Desktop/PlatnmDev
npx expo run:ios --device
```

This will rebuild the app with proper dev client configuration.

### Step 6: Check Metro Bundler Output

Look at the terminal where Metro is running. You should see:
- "Metro waiting on..."
- Connection attempts from your device
- Any error messages

### Step 7: Network Requirements

Make sure:
- ✅ iPhone and Mac are on the same WiFi network
- ✅ Firewall isn't blocking port 8081
- ✅ Metro bundler is running (`lsof -ti:8081`)

## Quick Fix: Force Reload

If the app is running but stuck:
1. Close the app completely on iPhone (swipe up and close it)
2. Reopen it
3. It should try to connect to Metro automatically

## If Still Not Working

The app might need to be rebuilt with the dev client properly embedded. Let me know what you see in:
1. Xcode console output
2. Metro bundler terminal output
3. Any error messages on the white screen

