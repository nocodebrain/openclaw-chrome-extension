// OpenClaw Browser Relay - Content Script
console.log('[OpenClaw] Content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[OpenClaw] Content received:', message);
  
  try {
    switch (message.action) {
      case 'getHTML':
        sendResponse({ html: document.documentElement.outerHTML });
        break;
        
      case 'getText':
        sendResponse({ text: document.body.innerText });
        break;
        
      case 'click':
        const clickEl = document.querySelector(message.selector);
        if (clickEl) {
          clickEl.click();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Element not found' });
        }
        break;
        
      case 'type':
        const typeEl = document.querySelector(message.selector);
        if (typeEl) {
          typeEl.value = message.text;
          typeEl.dispatchEvent(new Event('input', { bubbles: true }));
          typeEl.dispatchEvent(new Event('change', { bubbles: true }));
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Element not found' });
        }
        break;
        
      case 'evaluate':
        try {
          const result = eval(message.code);
          sendResponse({ success: true, result });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep channel open for async response
});
