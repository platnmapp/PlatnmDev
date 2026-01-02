# Fixing Xcode Signing Issues

## Step-by-Step Fix

### Issue 1: Add Your Apple ID to Xcode

1. **Open Xcode Settings:**
   - Click **Xcode** in the menu bar → **Settings** (or press `Cmd + ,`)

2. **Add Your Apple ID:**
   - Click on the **"Accounts"** tab (top of the settings window)
   - Click the **"+"** button at the bottom left
   - Select **"Apple ID"**
   - Sign in with your Apple ID email and password
   - If you don't have a free Apple Developer account, you'll be prompted to create one (it's free!)

### Issue 2: Configure Signing for Main App

1. **In Xcode, select the project:**
   - Click on **"platnm"** (blue icon) in the left sidebar

2. **Select the `platnm` target:**
   - Under "TARGETS", click on **"platnm"**
   - Click on the **"Signing & Capabilities"** tab

3. **Configure signing:**
   - ✅ Check **"Automatically manage signing"**
   - Under **"Team"**, select your Apple ID from the dropdown
   - Xcode will automatically create provisioning profiles

4. **Handle the App Group:**
   - If you see an error about the App Group, Xcode will automatically try to register it
   - If it fails, you have two options:
     - **Option A**: Remove the App Group temporarily (will break Share Extension)
     - **Option B**: Register it manually on [developer.apple.com](https://developer.apple.com)

### Issue 3: Configure Signing for ShareExtension

1. **Select the `ShareExtension` target:**
   - Still in the same project settings
   - Under "TARGETS", click on **"ShareExtension"**
   - Click on the **"Signing & Capabilities"** tab

2. **Configure signing:**
   - ✅ Check **"Automatically manage signing"**
   - Under **"Team"**, select the **same Apple ID** as the main app
   - Make sure the Bundle Identifier is `com.platnm.app.v2.ShareExtension`

### If App Group Registration Fails

The App Group `group.com.platnm.app.v2` needs to be registered on Apple Developer Portal. Here's how:

#### Option 1: Let Xcode Auto-Register (Easiest)
- Sometimes Xcode will automatically register it when you enable "Automatically manage signing"
- Try building and see if it works

#### Option 2: Register Manually (If Auto-Register Fails)
1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in with your Apple ID
3. Go to **Certificates, Identifiers & Profiles**
4. Click **Identifiers** → **App Groups**
5. Click the **"+"** button
6. Enter:
   - **Description**: Platnm App Group
   - **Identifier**: `group.com.platnm.app.v2`
7. Click **Continue** → **Register**

#### Option 3: Temporarily Remove App Group (Quick Test, But Breaks Share Extension)
If you just want to test the app without the share extension first:

1. Edit `ios/platnm/platnm.entitlements`:
   - Remove or comment out the `com.apple.security.application-groups` section

2. Edit `ios/ShareExtension/ShareExtension.entitlements`:
   - Remove or comment out the `com.apple.security.application-groups` section

3. **Note**: This will break the Share Extension feature, so you won't be able to test "Share with Platnm" from Spotify

### After Fixing

1. **Clean the build:**
   - In Xcode: **Product** → **Clean Build Folder** (or press `Cmd + Shift + K`)

2. **Try building again:**
   - Select your iPhone from the device dropdown
   - Click the **Play** button (▶️) or press `Cmd + R`

3. **Trust on iPhone:**
   - When the app installs, go to **Settings** → **General** → **VPN & Device Management**
   - Tap your Apple ID → **Trust**

## Quick Checklist

- [ ] Added Apple ID to Xcode (Settings → Accounts)
- [ ] Enabled "Automatically manage signing" for `platnm` target
- [ ] Selected Team for `platnm` target
- [ ] Enabled "Automatically manage signing" for `ShareExtension` target
- [ ] Selected Team for `ShareExtension` target
- [ ] App Group registered (or temporarily removed)
- [ ] Clean build folder
- [ ] Build and run on iPhone

## Common Errors & Solutions

### "No profiles found"
- Make sure "Automatically manage signing" is checked
- Make sure you've selected a Team

### "App Group not available"
- Register the App Group on developer.apple.com (see Option 2 above)
- OR temporarily remove it from entitlements files (Option 3)

### "No account for team"
- Add your Apple ID in Xcode Settings → Accounts
- Make sure you're signed in with the correct account

