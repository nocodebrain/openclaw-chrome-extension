// OpenClaw Browser Relay - Background Service Worker

console.log('OpenClaw Browser Relay: Background worker started');

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.type === 'ping') {
    sendResponse({ status: 'ok', message: 'OpenClaw Relay Active' });
  }
  
  return true;
});

// Track active tab
let activeTabId = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
  console.log('Active tab changed to:', activeTabId);
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});
