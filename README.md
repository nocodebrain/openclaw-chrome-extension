# OpenClaw Browser Relay Extension v2.0

Professional Chrome extension for connecting your browser to OpenClaw.

## Features

- ✅ **WebSocket Relay** - Connects to OpenClaw gateway for browser control
- ✅ **Tab Management** - Create, navigate, close tabs
- ✅ **Page Interaction** - Click, type, evaluate JavaScript
- ✅ **Screenshots** - Capture visible tab content
- ✅ **Auto-Reconnect** - Maintains connection with automatic retry
- ✅ **Tab Attachment** - Click extension icon to attach specific tabs
- ✅ **All Sites** - Works on any website including Google Calendar, Missive, etc.

## Installation

### Windows Installation

1. **Download the extension**
   - Download this entire `openclaw-chrome-extension` folder
   - Or clone: `git clone https://github.com/nocodebrain/openclaw-chrome-extension.git`

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `openclaw-chrome-extension` folder
   - Extension will appear with 🔱 icon

4. **Configure connection**
   - Click the extension icon in toolbar
   - Gateway URL should be: `ws://127.0.0.1:18792`
   - Click "Test Connection" - should show success

5. **Attach tabs**
   - Navigate to any site (e.g., calendar.google.com)
   - Click the extension icon
   - Badge should change to "ON" (green)
   - Tab is now controlled by OpenClaw

## Usage

### Attach a Tab
1. Open the website you want to automate
2. Click the OpenClaw extension icon
3. Badge shows "ON" = tab is attached
4. OpenClaw can now control this tab

### Check Status
- Click extension icon to see connection status
- Green dot = Connected to OpenClaw
- Grey dot = Disconnected
- Red dot = Connection error

### Configuration
- Default gateway: `ws://127.0.0.1:18792`
- Change in popup if your OpenClaw uses different port
- Click "Reconnect Now" after changing settings

## Troubleshooting

**Connection Failed**
- Make sure OpenClaw gateway is running
- Check port 18792 is not blocked
- Try "Test Connection" button

**Tab Not Responding**
- Refresh the tab
- Detach and reattach (click icon twice)
- Check browser console for errors

**Permission Issues**
- Extension needs "Access your data on all websites"
- This is required for automation to work
- Grant permission when Chrome prompts

## For Developers

### File Structure
```
openclaw-chrome-extension/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Service worker (WebSocket relay)
├── content.js         # Injected into pages
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
└── icons/            # Extension icons
```

### API Messages

**From OpenClaw to Extension:**
- `relay.ping` - Health check
- `browser.action` - Execute action (click, type, etc.)
- `tabs.list` - Get all tabs
- `tabs.create` - Open new tab
- `tabs.navigate` - Go to URL
- `tabs.execute` - Run JavaScript

**From Extension to OpenClaw:**
- `relay.handshake` - Initial connection
- `relay.pong` - Ping response
- `browser.response` - Action result
- `tab.attached` - Tab connected
- `tab.updated` - Tab finished loading

## Security

- Extension only connects to localhost (127.0.0.1)
- No external servers or data collection
- All data stays on your machine
- Open source - review the code

## Version History

### v2.0.0 (2026-02-08)
- Complete rebuild with proper architecture
- Manifest V3 migration
- WebSocket relay protocol
- Tab attachment system
- Auto-reconnect logic
- Modern UI with status indicators

### v1.0.0 (2026-02-07)
- Initial release (basic version)

## License

MIT License - Free to use and modify

---

**Need help?** Check OpenClaw docs or ask in Discord: https://discord.com/invite/clawd
