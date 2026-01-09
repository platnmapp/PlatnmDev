# Test the Deployed Function

The function is deployed! Now test it to make sure it works:

## Test via Terminal

```bash
curl -X POST 'https://uirmafqpkulwkkpyfmrj.supabase.co/functions/v1/process-music-link' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcm1hZnFwa3Vsd2trcHlmbXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDEwMjMsImV4cCI6MjA4MDM3NzAyM30.OwH5ZtpySBNAXaV4-C1Am1-oLJi42RoXc_3yqgQo-PI' \
  -H 'Content-Type: application/json' \
  --data '{"link":"https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"}'
```

## Test via Supabase Dashboard

1. In the function page, click **"Invoke function"** or **"Test"**
2. Use this JSON:
```json
{
  "link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"
}
```

## Expected Response

You should get back:
```json
{
  "title": "Song Name",
  "artist": "Artist Name",
  "artworkURL": "https://i.scdn.co/image/...",
  "spotifyURL": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC",
  "appleMusicURL": null
}
```

## If It Works

✅ **The Share Extension should now work!**

Try sharing from Spotify again - the extension should fetch the song metadata and display it properly.

## If There Are Errors

Check the function logs in Supabase Dashboard:
- Go to **Edge Functions** → **process-music-link** → **Logs**
- Look for any error messages

Common issues:
- Missing secrets (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
- Database table `spotify_config` doesn't exist
- Invalid Spotify credentials

