# Debugging Black Screen Issue

## Current Status
- ✅ App launches (no immediate crash)
- ❌ Shows black screen (JavaScript not loading)
- ❌ Dev menu not accessible via shake

## Steps to Debug

### 1. Check Xcode Console
In Xcode, look at the console output (bottom panel). Look for:
- Connection attempts to Metro bundler
- JavaScript errors
- Failed network requests
- Any red error messages

### 2. Check Metro Terminal Output
Look at the terminal where `expo start --dev-client` is running. You should see:
- Connection requests from your iPhone
- Bundle requests
- Any error messages

If you see NO connection attempts, the app isn't finding Metro.

### 3. Verify Network Connection
Make sure:
- ✅ iPhone and Mac are on the **same WiFi network**
- ✅ Firewall isn't blocking port 8081
- ✅ Mac's IP: `192.168.0.137`
- ✅ Metro URL should be: `exp://192.168.0.137:8081`

### 4. Try Manual Connection
Since dev menu isn't accessible, try:

**Option A: Close and Reopen App**
1. Force close the app completely (swipe up from app switcher)
2. Reopen it
3. It should try to auto-connect to Metro

**Option B: Restart Metro**
1. Stop Metro (Ctrl+C in the terminal)
2. Restart it: `npx expo start --dev-client --tunnel`
   - The `--tunnel` flag uses Expo's servers to help with connection

**Option C: Try 3-Finger Tap**
Some dev clients use a 3-finger tap instead of shake to open dev menu.

### 5. Check if JavaScript Bundle is Loading
In Xcode console, you should see messages like:
- "Loading JavaScript bundle..."
- "Bundle loaded successfully"
- Or connection errors

### 6. If Still Black Screen
The black screen might be caused by:
- JavaScript error preventing render
- Missing dependencies
- Environment variable issues

Check Xcode console for JavaScript errors.

## Quick Test
Try running on simulator first to see if it works:
```bash
cd /Users/platnm/Desktop/PlatnmDev
npx expo run:ios
```

If simulator works, it's a network/connection issue.
If simulator also shows black screen, it's a code/dependency issue.

