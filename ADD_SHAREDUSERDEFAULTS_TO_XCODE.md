# How to Add SharedUserDefaults Files to Xcode Project

## Step-by-Step Instructions

### Step 1: Open Xcode Project
1. Open Terminal and navigate to your project:
   ```bash
   cd ~/Desktop/PlatnmDev/ios
   ```
2. Open the Xcode workspace (NOT the .xcodeproj):
   ```bash
   open platnm.xcworkspace
   ```
   **Important:** Use `.xcworkspace`, not `.xcodeproj` - this ensures CocoaPods are properly loaded.

### Step 2: Locate the Files in Finder
1. In Finder, navigate to: `~/Desktop/PlatnmDev/ios/platnm/`
2. Verify these files exist:
   - `SharedUserDefaults.swift`
   - `SharedUserDefaults.m`

### Step 3: Add SharedUserDefaults.swift to Xcode
1. In Xcode, in the left sidebar (Project Navigator), find the `platnm` folder (the blue folder icon, not the yellow folder)
2. Right-click on the `platnm` folder (or click it, then right-click)
3. Select **"Add Files to 'platnm'..."**
4. In the file browser that opens:
   - Navigate to: `~/Desktop/PlatnmDev/ios/platnm/`
   - Select `SharedUserDefaults.swift`
   - **IMPORTANT:** Check these options:
     - ✅ **"Copy items if needed"** - UNCHECK this (file is already in the right location)
     - ✅ **"Create groups"** - Keep this checked
     - ✅ **"Add to targets: platnm"** - Make sure this is CHECKED (this is critical!)
   - Click **"Add"**

### Step 4: Add SharedUserDefaults.m to Xcode
1. Repeat Step 3, but this time select `SharedUserDefaults.m`
2. Make sure **"Add to targets: platnm"** is CHECKED
3. Click **"Add"**

### Step 5: Verify Files Are Added
1. In Xcode's Project Navigator (left sidebar), expand the `platnm` folder
2. You should now see:
   - `SharedUserDefaults.swift`
   - `SharedUserDefaults.m`
3. Select `SharedUserDefaults.swift` in the Project Navigator
4. Look at the right sidebar (File Inspector) - make sure "platnm" target is checked under "Target Membership"
5. Select `SharedUserDefaults.m` and verify the same

### Step 6: Verify Build Settings
1. Click on the project name "platnm" (blue icon) at the very top of the Project Navigator
2. Select the "platnm" target (under TARGETS)
3. Go to the "Build Phases" tab
4. Expand "Compile Sources"
5. Verify you see:
   - `SharedUserDefaults.swift`
   - `SharedUserDefaults.m`
   - `AppDelegate.swift`
   - (Other Swift files)

### Step 7: Clean Build Folder
1. In Xcode menu bar: **Product** → **Clean Build Folder** (or press `Shift + Cmd + K`)
2. Wait for the clean to complete

### Step 8: Rebuild the App
1. Close Xcode
2. In Terminal, navigate to your project root:
   ```bash
   cd ~/Desktop/PlatnmDev
   ```
3. Rebuild the app:
   ```bash
   npx expo run:ios --device "00008030-0015654C1ED8C02E"
   ```

### Step 9: Verify It Works
1. After the app launches, check the logs for:
   ```
   session_debug: AuthContext module loaded, SharedUserDefaults available: true
   ```
   (Should now say `true` instead of `false`)

2. You should also see:
   ```
   session_debug: SharedUserDefaults is available
   session_debug: SUCCESS - Session data stored successfully in App Group
   ```

## Troubleshooting

### If files don't appear in Xcode:
- Make sure you're looking in the correct folder (the blue `platnm` folder, not yellow folders)
- Try right-clicking directly on the `platnm` folder (blue icon) in Project Navigator

### If "Add to targets" option doesn't show:
- The file might already be in the project but not added to the target
- Select the file in Project Navigator
- In the right sidebar, check "Target Membership" section
- Make sure "platnm" is checked

### If build fails:
- Make sure both `.swift` and `.m` files are added to the same target
- Clean build folder and try again
- Check that `platnm-Bridging-Header.h` exists and is empty (which is fine)

### If NativeModule still shows as unavailable:
- Double-check that both files are in "Compile Sources" under Build Phases
- Verify the target membership for both files
- Make sure you're building for the correct target (platnm, not ShareExtension)

