# Installation Guide - OpenClaw Chrome Extension

## Quick Install (Windows)

### Step 1: Get the Extension Files

**Option A: Download from GitHub**
1. Go to: https://github.com/nocodebrain/openclaw-chrome-extension
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder (e.g., `C:\openclaw-extension\`)

**Option B: Git Clone (if you have Git)**
```bash
git clone https://github.com/nocodebrain/openclaw-chrome-extension.git
cd openclaw-chrome-extension
```

### Step 2: Install in Chrome

1. **Open Chrome Extensions page**
   - Type `chrome://extensions/` in address bar and press Enter
   - OR: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in top-right corner
   - Turn it ON (it should be blue)

3. **Load the Extension**
   - Click "Load unpacked" button (appears after enabling Developer mode)
   - Browse to the folder where you extracted/cloned the extension
   - Select the `openclaw-chrome-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - Extension should appear in your extensions list
   - You should see: "OpenClaw Browser Relay v2.0.0"
   - Icon: 🔱 (blue square)
   - Status: Enabled

### Step 3: Configure & Test

1. **Pin the Extension** (optional but recommended)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "OpenClaw Browser Relay"
   - Click the pin icon so it's always visible

2. **Check Connection**
   - Click the OpenClaw extension icon
   - Popup should open showing connection status
   - Gateway URL should be: `ws://127.0.0.1:18792`
   - Click "Test Connection"
   - Should show: "Test successful!" with green dot

3. **Attach Your First Tab**
   - Open a website (try https://calendar.google.com)
   - Click the OpenClaw extension icon
   - Badge on icon should change to "ON" (green background)
   - Tab is now attached and controllable by OpenClaw

## Troubleshooting

### "Connection Failed" Error

**Check OpenClaw is Running:**
```bash
# In your terminal/WSL
openclaw gateway status
```
If not running:
```bash
openclaw gateway start
```

**Check Port:**
- Default port is 18792
- Make sure nothing else is using this port
- Check Windows Firewall isn't blocking it

### Extension Not Loading

**Make sure you selected the RIGHT folder:**
- You need to select the folder that contains `manifest.json`
- NOT a parent folder, NOT a subfolder
- Should see files: manifest.json, background.js, popup.html, etc.

**Check for errors:**
- On `chrome://extensions/` page
- Look for red "Errors" button under the extension
- Click it to see what went wrong

### Tab Not Attaching

**Refresh the page:**
- Sometimes you need to refresh the tab after installing the extension
- Press F5 or Ctrl+R

**Check permissions:**
- Chrome may ask for permission to "access data on all websites"
- You must click "Allow" for the extension to work

### Badge Not Showing "ON"

**Click the icon again:**
- First click attaches the tab (badge shows "ON")
- Second click detaches (badge shows "OFF")
- It's a toggle

**Check console:**
- Open Developer Tools (F12)
- Click "Console" tab
- Look for [OpenClaw] messages
- Should see "Content script loaded"

## Next Steps

Once installed and connected:

1. **Tell OpenClaw to use it:**
   ```
   Use the Chrome extension to access my Google Calendar
   ```

2. **Test automation:**
   ```
   Open calendar.google.com in the attached tab and tell me what events I have today
   ```

3. **Automate Missive:**
   ```
   Open mail.missiveapp.com and check my inbox
   ```

## Updating the Extension

When a new version is released:

1. **Git users:**
   ```bash
   cd openclaw-chrome-extension
   git pull
   ```
   Then click "Reload" button on `chrome://extensions/` page

2. **ZIP users:**
   - Download new ZIP
   - Extract to SAME folder (overwrite old files)
   - Click "Reload" button on `chrome://extensions/` page

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "OpenClaw Browser Relay"
3. Click "Remove"
4. Confirm removal

---

**Still stuck?** Open an issue on GitHub or ask in OpenClaw Discord.
