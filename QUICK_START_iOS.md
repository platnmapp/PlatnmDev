# Running the App on Your iPhone

## Prerequisites

1. **Xcode** - Make sure you have Xcode installed from the App Store
2. **Apple Developer Account** - You'll need a free Apple Developer account (or paid if you want TestFlight)
3. **iPhone** - Your iPhone connected via USB or on the same WiFi network
4. **Your Apple ID** - You'll need to sign the app with your Apple ID

## Option 1: Run on Physical iPhone (Recommended for Testing)

### Step 1: Configure Your iPhone
1. Connect your iPhone to your Mac via USB cable
2. On your iPhone: Go to **Settings → General → VPN & Device Management** (or **Device Management**)
3. Trust your computer if prompted
4. Make sure your iPhone is unlocked

### Step 2: Open Xcode and Configure Signing
1. Open Xcode:
   ```bash
   open /Users/platnm/Desktop/PlatnmDev/ios/platnm.xcworkspace
   ```
   (Or double-click the `.xcworkspace` file in Finder)

2. In Xcode:
   - Select the `platnm` project in the left sidebar
   - Select the `platnm` target
   - Go to the **"Signing & Capabilities"** tab
   - Check **"Automatically manage signing"**
   - Select your **Team** (your Apple ID)
   - Xcode will automatically create a bundle identifier for you

### Step 3: Select Your iPhone as Destination
1. In Xcode's toolbar, click the device selector (next to the play button)
2. Select your connected iPhone from the list

### Step 4: Build and Run
You can either:
- **Option A**: Click the ▶️ Play button in Xcode, OR
- **Option B**: Run from terminal:
   ```bash
   cd /Users/platnm/Desktop/PlatnmDev
   npx expo run:ios --device
   ```

### Step 5: Trust the Developer on iPhone
On your iPhone, when the app is installed:
1. Go to **Settings → General → VPN & Device Management**
2. Tap on your Apple ID under "Developer App"
3. Tap **"Trust [Your Name]"**

## Option 2: Run on iOS Simulator

If you want to test on a simulator first:

```bash
cd /Users/platnm/Desktop/PlatnmDev
npx expo run:ios
```

This will open the iOS Simulator and install the app.

## Option 3: Build with EAS Build (For Testing on Multiple Devices)

If you want to build a development build that you can install on any iPhone:

1. Install EAS CLI (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. Login to EAS:
   ```bash
   eas login
   ```

3. Build development client:
   ```bash
   eas build --profile development --platform ios
   ```

4. Once built, you'll get a link to download the `.ipa` file
5. Install it on your iPhone using TestFlight or direct installation

## Troubleshooting

### Issue: "No devices found"
- Make sure your iPhone is unlocked
- Check that you trusted your computer
- Try unplugging and re-plugging the USB cable
- Make sure you're using a data cable (not just a charging cable)

### Issue: Code signing errors
- Make sure you've selected your Team in Xcode
- Check that "Automatically manage signing" is enabled
- You might need to adjust the bundle identifier if there's a conflict

### Issue: Build fails
- Make sure all pods are installed: `cd ios && pod install`
- Clean build folder in Xcode: Product → Clean Build Folder (Cmd+Shift+K)
- Delete derived data: Xcode → Settings → Locations → Derived Data → Delete

### Issue: App crashes on launch
- Check the Xcode console for error messages
- Make sure your server is running (the app needs the server for some features)
- Check that all environment variables are set correctly

## Running the Development Server

The app needs a server running for some features. Start it with:

```bash
cd /Users/platnm/Desktop/PlatnmDev
npm start
```

This will start both the Expo dev server and your backend server.

## Next Steps

Once the app is installed:
1. Open the app on your iPhone
2. The Expo dev client will load
3. You can scan QR codes or manually enter the dev server URL to load your app
4. Any code changes will hot-reload automatically!

## Notes

- First build may take 5-10 minutes
- You'll need to rebuild the native app (`expo run:ios`) if you:
  - Add new native dependencies
  - Change native code
  - Modify app.json iOS configuration
- For JavaScript changes, the app will hot-reload automatically


