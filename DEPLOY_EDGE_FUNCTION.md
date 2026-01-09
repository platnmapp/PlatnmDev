# Deploy Supabase Edge Function: process-music-link

## Step 1: Install Supabase CLI

```bash
# On macOS (using Homebrew)
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

## Step 3: Link to Your Project

```bash
cd ~/Desktop/PlatnmDev
supabase link --project-ref uirmafqpkulwkkpyfmrj
```

(Your project ref is in the URL: `https://uirmafqpkulwkkpyfmrj.supabase.co`)

## Step 4: Set Environment Variables

The function needs these secrets:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SUPABASE_URL` (auto-set)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-set)
- `APPLE_TEAM_ID` (optional, for Apple Music)
- `APPLE_KEY_ID` (optional, for Apple Music)
- `APPLE_PRIVATE_KEY` (optional, for Apple Music)

Set them via Supabase dashboard or CLI:

```bash
# Set Spotify credentials
supabase secrets set SPOTIFY_CLIENT_ID=your_spotify_client_id
supabase secrets set SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Optional: Set Apple Music credentials
supabase secrets set APPLE_TEAM_ID=your_apple_team_id
supabase secrets set APPLE_KEY_ID=your_apple_key_id
supabase secrets set APPLE_PRIVATE_KEY="$(cat path/to/your/private_key.p8)"
```

## Step 5: Deploy the Function

```bash
supabase functions deploy process-music-link
```

## Step 6: Verify Deployment

```bash
curl -X POST "https://uirmafqpkulwkkpyfmrj.supabase.co/functions/v1/process-music-link" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"}'
```

Replace `YOUR_ANON_KEY` with your Supabase anon key (the one you're using in the app).

## Alternative: Deploy via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions** in the left sidebar
4. Click **Create a new function**
5. Name it `process-music-link`
6. Copy-paste the code from `supabase/functions/process-music-link/index.ts`
7. Set environment variables in **Settings → Edge Functions → Secrets**
8. Deploy

