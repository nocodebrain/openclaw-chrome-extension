// Popup script
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const gatewayUrlInput = document.getElementById('gatewayUrl');
const reconnectBtn = document.getElementById('reconnect');
const testBtn = document.getElementById('testConnection');

// Load settings
chrome.storage.local.get(['gatewayUrl'], (result) => {
  if (result.gatewayUrl) {
    gatewayUrlInput.value = result.gatewayUrl;
  }
});

// Check connection status
function checkStatus() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response && response.connected) {
      statusDot.className = 'status-dot connected';
      statusText.textContent = 'Connected to OpenClaw';
    } else {
      statusDot.className = 'status-dot';
      statusText.textContent = 'Disconnected';
    }
  });
}

// Save settings
gatewayUrlInput.addEventListener('change', () => {
  chrome.storage.local.set({ 
    gatewayUrl: gatewayUrlInput.value 
  });
});

// Reconnect
reconnectBtn.addEventListener('click', () => {
  chrome.storage.local.set({ 
    gatewayUrl: gatewayUrlInput.value 
  }, () => {
    chrome.runtime.sendMessage({ action: 'reconnect' });
    statusText.textContent = 'Reconnecting...';
    setTimeout(checkStatus, 1000);
  });
});

// Test connection
testBtn.addEventListener('click', async () => {
  statusText.textContent = 'Testing...';
  try {
    const ws = new WebSocket(gatewayUrlInput.value);
    ws.onopen = () => {
      statusText.textContent = 'Test successful!';
      statusDot.className = 'status-dot connected';
      ws.close();
      setTimeout(checkStatus, 1000);
    };
    ws.onerror = () => {
      statusText.textContent = 'Connection failed';
      statusDot.className = 'status-dot error';
    };
  } catch (error) {
    statusText.textContent = 'Connection failed';
    statusDot.className = 'status-dot error';
  }
});

// Check status on load
checkStatus();
setInterval(checkStatus, 3000);
