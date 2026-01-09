# Quick Steps: Deploy via Supabase Dashboard

## 1. Go to Edge Functions
In your Supabase dashboard (already open), click **"Edge Functions"** in the left sidebar.

## 2. Create/Edit Function
- **If function doesn't exist**: Click **"Create Function"** or **"+ New Function"**
- **If it exists**: Click on `process-music-link` to edit it

## 3. Copy Code
1. Open the file `FUNCTION_CODE_FOR_DASHBOARD.ts` (I just created it)
2. Select ALL the code (Cmd+A) and copy (Cmd+C)
3. Paste it into the dashboard editor

## 4. Set Secrets
1. In Edge Functions page, go to **"Settings"** or find **"Secrets"** section
2. Click **"Add Secret"** or **"Manage Secrets"**
3. Add these two:
   - Name: `SPOTIFY_CLIENT_ID` → Value: (your Spotify Client ID)
   - Name: `SPOTIFY_CLIENT_SECRET` → Value: (your Spotify Client Secret)

**Get Spotify credentials:**
- Go to https://developer.spotify.com/dashboard
- Select your app
- Copy Client ID and Client Secret

## 5. Deploy
Click **"Deploy"** or **"Save"** button.

## 6. Test
After deployment, use the test panel or test button with:
```json
{
  "link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"
}
```

You should get back:
```json
{
  "title": "Song Name",
  "artist": "Artist Name",
  "artworkURL": "https://...",
  "spotifyURL": "...",
  "appleMusicURL": null
}
```

---

**The file `FUNCTION_CODE_FOR_DASHBOARD.ts` contains the complete code ready to paste!**

