# Deploy Edge Function via Supabase Dashboard

## Step 1: Go to Edge Functions

In your Supabase dashboard:
1. Click **"Edge Functions"** in the left sidebar
2. If you don't see it, it might be under **"Project Settings"** → **"Functions"**

## Step 2: Create/Edit the Function

### If the function doesn't exist:
1. Click **"Create a new function"** or **"+ New Function"**
2. Name it: `process-music-link`
3. Select **TypeScript** as the language

### If the function already exists:
1. Click on `process-music-link` to edit it
2. Replace all the code with the content from `supabase/functions/process-music-link/index.ts`

## Step 3: Copy the Function Code

**IMPORTANT:** Use the file `FUNCTION_CODE_FOR_DASHBOARD_FIXED.ts` (not the one in supabase/functions folder)

1. Open the file: `FUNCTION_CODE_FOR_DASHBOARD_FIXED.ts` on your computer
2. Select all the code (Cmd+A) and copy it (Cmd+C)
3. Paste it into the dashboard editor

**Why?** The dashboard version has the correct import format that Supabase requires.

## Step 4: Set Environment Variables (Secrets)

1. In the Edge Functions page, go to **"Settings"** or **"Environment Variables"**
2. Click **"Add Secret"** or **"Manage Secrets"**
3. Add these secrets one by one (copy-paste the values exactly):

### Secret 1: SPOTIFY_CLIENT_ID
- **Name**: `SPOTIFY_CLIENT_ID`
- **Value**: `e7a90886b8cf42be8b4447a9e575e1ff`

### Secret 2: SPOTIFY_CLIENT_SECRET
- **Name**: `SPOTIFY_CLIENT_SECRET`
- **Value**: `598fe147e8274c21bf3253a471eb91d2`

### Secret 3: APPLE_TEAM_ID (Optional - for Apple Music)
- **Name**: `APPLE_TEAM_ID`
- **Value**: `R6N8B58A4N`

### Secret 4: APPLE_KEY_ID (Optional - for Apple Music)
- **Name**: `APPLE_KEY_ID`
- **Value**: `GKBV592446`

### Secret 5: APPLE_PRIVATE_KEY (Optional - for Apple Music)
- **Name**: `APPLE_PRIVATE_KEY`
- **Value**: (Copy this entire block, including the BEGIN/END lines)
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgN81rT4Q8nUf1dd14
ocrc9C7EfbrYU02lWDWjz5Rs0fGgCgYIKoZIzj0DAQehRANCAARvML/xm4GPQKhT
2WymL19R025VsFQ0tSvfbFTvfLbsY4mKDGD0fOgOhfa8VJ7l1CzEwzY2p8TGeemI
UvucvbZ1
-----END PRIVATE KEY-----
```

**Important:** Make sure to copy the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines!

## Step 5: Deploy

1. Click **"Deploy"** or **"Save"** button
2. Wait for deployment to complete (you'll see a success message)

## Step 6: Test It

After deployment, you can test it in the dashboard:
1. Go to the function page
2. Look for a **"Test"** or **"Invoke"** button
3. Or use the test panel with this JSON:
```json
{
  "link": "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"
}
```

## Alternative: Quick Deploy Button

Some Supabase dashboards have a **"Quick Deploy"** button that lets you:
1. Connect to your GitHub repo
2. Select the function folder
3. Auto-deploy on push

Look for **"Deploy from GitHub"** or **"Connect Repository"** in the Edge Functions section.

