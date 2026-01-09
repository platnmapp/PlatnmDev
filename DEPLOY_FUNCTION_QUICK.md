# Quick Deploy Instructions

## If Supabase CLI is installed, run these commands:

```bash
cd ~/Desktop/PlatnmDev

# 1. Login (will open browser)
supabase login

# 2. Link to your project
supabase link --project-ref uirmafqpkulwkkpyfmrj

# 3. Set secrets (replace with your actual credentials)
# Get these from your Spotify app dashboard: https://developer.spotify.com/dashboard
supabase secrets set SPOTIFY_CLIENT_ID=your_client_id_here
supabase secrets set SPOTIFY_CLIENT_SECRET=your_client_secret_here

# 4. Deploy the function
supabase functions deploy process-music-link
```

## Get Your Spotify Credentials:

1. Go to https://developer.spotify.com/dashboard
2. Select your app (or create one)
3. Copy **Client ID** and **Client Secret**

## After Deployment:

Test it works:
```bash
curl -X POST "https://uirmafqpkulwkkpyfmrj.supabase.co/functions/v1/process-music-link" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcm1hZnFwa3Vsd2trcHlmbXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDEwMjMsImV4cCI6MjA4MDM3NzAyM30.OwH5ZtpySBNAXaV4-C1Am1-oLJi42RoXc_3yqgQo-PI" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"}'
```

