# How to Find Share Extension Logs

## The Issue
iOS Share Extensions don't show up as "ShareExtension" process - they run as **XPC services**!

## What to Search For

In Console.app, try these searches:

### Option 1: Search by Bundle Identifier
Search for: `com.leonardodeltoro.platnm.app.ShareExtension`

### Option 2: Search for XPC Service
Search for: `xpcservice`

### Option 3: Search for Our Log Identifier
Search for: `PLATNM_SHARE_EXT_2024`

### Option 4: Filter by Process Name
1. In Console.app, look at the "Process" column
2. You should see entries like: `xpcservice<com.leonardodeltoro.platnm.app.ShareExtension>`
3. Click on one of those entries
4. Console.app should filter to show only that process

### Option 5: Check Subsystem
1. In Console.app, enable the "Subsystem" column (right-click column headers)
2. Filter by: `com.leonardodeltoro.platnm.app.ShareExtension`

## What You Should See

When the Share Extension runs, you should see logs like:
- Process: `xpcservice<com.leonardodeltoro.platnm.app.ShareExtension>`
- PID: Usually starts with 26xxx or similar
- Messages containing: `PLATNM_SHARE_EXT_2024`

## If You Still Don't See Logs

1. **Make sure the extension is actually launching:**
   - Share from Spotify again while Console.app is open
   - Watch the logs appear in real-time
   - The logs appear immediately when you tap "Share" in Spotify

2. **Check the Process ID:**
   - Look for the PID mentioned in your logs (like 26684)
   - Search for that specific PID number

3. **Enable all log levels:**
   - In Console.app, go to **Action → Include Info Messages**
   - Also enable **Action → Include Debug Messages**

4. **Try searching in the Message column:**
   - Make sure you're searching in "Message" column, not just "Process"
   - Search for: `PLATNM_SHARE_EXT_2024`

