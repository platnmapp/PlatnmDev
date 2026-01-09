# Quick Check: Is Share Extension Running?

## Fastest Way to Check

1. **Share from Spotify to Platnm** (as you normally would)
2. **Immediately go to your Mac** and open Console.app
3. **Search for**: `xpcservice` (all lowercase)
4. **Look for entries** with `platnm` or `ShareExtension` in them
5. **Check the timestamp** - it should match when you tried to share

## If You See Nothing

The extension isn't launching. Do this:

1. **Uninstall the app completely from your iPhone**
2. **Rebuild and reinstall**:
   ```bash
   cd ~/Desktop/PlatnmDev
   npx expo run:ios --device "00008030-0015654C1ED8C02E"
   ```
3. **Try sharing again**
4. **Check Console.app immediately** (within 5 seconds of sharing)

## What Success Looks Like

You should see entries like:
- `xpcservice<com.leonardodeltoro.platnm.app.ShareExtension>`
- Messages containing: `PLATNM_SHARE_EXT_2024`

If you see these, the extension IS running - we just need to fix why logs aren't appearing.

