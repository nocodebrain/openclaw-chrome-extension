// OpenClaw Browser Relay - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.getElementById('testButton');
  
  testButton.addEventListener('click', async () => {
    testButton.textContent = 'Testing...';
    testButton.disabled = true;
    
    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({ type: 'ping' });
      
      if (response && response.status === 'ok') {
        testButton.textContent = '✓ Connection OK';
        testButton.style.background = '#48bb78';
        
        setTimeout(() => {
          testButton.textContent = 'Test Connection';
          testButton.style.background = '#667eea';
          testButton.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('Test failed:', error);
      testButton.textContent = '✗ Test Failed';
      testButton.style.background = '#f56565';
      
      setTimeout(() => {
        testButton.textContent = 'Test Connection';
        testButton.style.background = '#667eea';
        testButton.disabled = false;
      }, 2000);
    }
  });
  
  // Get current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('Current tab:', tabs[0].url);
    }
  });
});
