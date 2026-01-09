#!/bin/bash

# Deploy Supabase Edge Function: process-music-link
# This script will guide you through the deployment process

echo "🚀 Deploying Supabase Edge Function: process-music-link"
echo ""

# Check if logged in
echo "Step 1: Checking Supabase login status..."
if ! supabase projects list &>/dev/null; then
    echo "❌ Not logged in. Please run: supabase login"
    echo "   (This will open your browser to authenticate)"
    exit 1
fi

echo "✅ Already logged in"
echo ""

# Link to project
echo "Step 2: Linking to project..."
supabase link --project-ref uirmafqpkulwkkpyfmrj

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Check if secrets are set
echo "Step 3: Checking environment secrets..."
echo "⚠️  You need to set these secrets manually:"
echo ""
echo "   supabase secrets set SPOTIFY_CLIENT_ID=your_spotify_client_id"
echo "   supabase secrets set SPOTIFY_CLIENT_SECRET=your_spotify_client_secret"
echo ""
echo "Do you want to set them now? (You'll need your Spotify credentials)"
read -p "Enter Spotify Client ID (or press Enter to skip): " SPOTIFY_CLIENT_ID

if [ ! -z "$SPOTIFY_CLIENT_ID" ]; then
    read -p "Enter Spotify Client Secret: " SPOTIFY_CLIENT_SECRET
    supabase secrets set SPOTIFY_CLIENT_ID="$SPOTIFY_CLIENT_ID"
    supabase secrets set SPOTIFY_CLIENT_SECRET="$SPOTIFY_CLIENT_SECRET"
    echo "✅ Secrets set"
else
    echo "⚠️  Skipping secrets setup. Make sure to set them before deploying!"
    echo "   You can set them later with:"
    echo "   supabase secrets set SPOTIFY_CLIENT_ID=your_id"
    echo "   supabase secrets set SPOTIFY_CLIENT_SECRET=your_secret"
fi

echo ""
echo "Step 4: Deploying function..."
supabase functions deploy process-music-link

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Function deployed successfully!"
    echo ""
    echo "Test it with:"
    echo 'curl -X POST "https://uirmafqpkulwkkpyfmrj.supabase.co/functions/v1/process-music-link" \'
    echo '  -H "Authorization: Bearer YOUR_ANON_KEY" \'
    echo '  -H "Content-Type: application/json" \'
    echo '  -d '"'"'{"link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"}'"'"
else
    echo "❌ Deployment failed"
    exit 1
fi

