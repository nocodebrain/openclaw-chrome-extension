// OpenClaw Browser Relay - Background Service Worker
let ws = null;
let reconnectTimer = null;
let connectedTabs = new Set();
let gatewayUrl = 'ws://127.0.0.1:18792';
let isConnected = false;

// Connect to OpenClaw gateway
function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('[OpenClaw] Already connected');
    return;
  }

  console.log(`[OpenClaw] Connecting to ${gatewayUrl}...`);
  
  try {
    ws = new WebSocket(gatewayUrl);
    
    ws.onopen = () => {
      console.log('[OpenClaw] Connected to gateway');
      isConnected = true;
      updateBadge('ON');
      clearTimeout(reconnectTimer);
      
      // Send handshake
      send({
        type: 'relay.handshake',
        source: 'chrome-extension',
        version: '2.0.0'
      });
    };
    
    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[OpenClaw] Received:', message);
        await handleMessage(message);
      } catch (error) {
        console.error('[OpenClaw] Message error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('[OpenClaw] WebSocket error:', error);
      isConnected = false;
      updateBadge('ERR');
    };
    
    ws.onclose = () => {
      console.log('[OpenClaw] Disconnected');
      isConnected = false;
      updateBadge('OFF');
      ws = null;
      
      // Reconnect after 3 seconds
      reconnectTimer = setTimeout(connect, 3000);
    };
  } catch (error) {
    console.error('[OpenClaw] Connection error:', error);
    reconnectTimer = setTimeout(connect, 3000);
  }
}

// Send message to gateway
function send(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    return true;
  }
  console.warn('[OpenClaw] Cannot send - not connected');
  return false;
}

// Update extension badge
function updateBadge(text) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ 
    color: text === 'ON' ? '#00FF00' : text === 'ERR' ? '#FF0000' : '#808080'
  });
}

// Handle messages from gateway
async function handleMessage(message) {
  const { type, requestId, tabId, action } = message;
  
  try {
    let result;
    
    switch (type) {
      case 'relay.ping':
        send({ type: 'relay.pong', requestId });
        break;
        
      case 'browser.action':
        result = await executeBrowserAction(message);
        send({ type: 'browser.response', requestId, result });
        break;
        
      case 'tabs.list':
        result = await chrome.tabs.query({});
        send({ type: 'tabs.response', requestId, tabs: result });
        break;
        
      case 'tabs.create':
        result = await chrome.tabs.create({ url: action.url });
        send({ type: 'tabs.response', requestId, tab: result });
        break;
        
      case 'tabs.navigate':
        await chrome.tabs.update(tabId, { url: action.url });
        send({ type: 'tabs.response', requestId, success: true });
        break;
        
      case 'tabs.close':
        await chrome.tabs.remove(tabId);
        send({ type: 'tabs.response', requestId, success: true });
        break;
        
      case 'tabs.execute':
        result = await executeScript(tabId, action);
        send({ type: 'tabs.response', requestId, result });
        break;
        
      default:
        console.warn('[OpenClaw] Unknown message type:', type);
    }
  } catch (error) {
    send({ 
      type: 'browser.error', 
      requestId, 
      error: error.message 
    });
  }
}

// Execute browser action
async function executeBrowserAction(message) {
  const { tabId, action } = message;
  
  switch (action.type) {
    case 'click':
      return await executeScript(tabId, {
        code: `document.querySelector('${action.selector}').click();`
      });
      
    case 'type':
      return await executeScript(tabId, {
        code: `
          const el = document.querySelector('${action.selector}');
          el.value = '${action.text}';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        `
      });
      
    case 'screenshot':
      return await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      
    case 'html':
      return await executeScript(tabId, {
        code: 'document.documentElement.outerHTML'
      });
      
    case 'evaluate':
      return await executeScript(tabId, { code: action.code });
      
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Execute script in tab
async function executeScript(tabId, action) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: action.func || new Function(action.code)
  });
  return results[0]?.result;
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isConnected && changeInfo.status === 'complete') {
    send({
      type: 'tab.updated',
      tabId,
      url: tab.url,
      title: tab.title
    });
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (isConnected) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      send({
        type: 'tab.activated',
        tabId: activeInfo.tabId,
        url: tab.url,
        title: tab.title
      });
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (connectedTabs.has(tab.id)) {
    connectedTabs.delete(tab.id);
    chrome.action.setBadgeText({ text: 'OFF', tabId: tab.id });
  } else {
    connectedTabs.add(tab.id);
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    
    if (isConnected) {
      send({
        type: 'tab.attached',
        tabId: tab.id,
        url: tab.url,
        title: tab.title
      });
    }
  }
});

// Load settings and connect
chrome.storage.local.get(['gatewayUrl'], (result) => {
  if (result.gatewayUrl) {
    gatewayUrl = result.gatewayUrl;
  }
  connect();
});

console.log('[OpenClaw] Background service worker initialized');
