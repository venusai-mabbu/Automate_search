document.getElementById('injectIframe').addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) {
    console.error('No active tab found');
    return;
  }

  try {
    // Execute the content script in the active tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injectIframe.js']
    });
    
    // Update button text to show success
    const button = document.getElementById('injectIframe');
    const originalText = button.textContent;
    button.textContent = 'Injected Successfully!';
    button.style.backgroundColor = '#34a853';
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 2000);
    
    // Optional: Close popup after injection
    // window.close();
    
  } catch (error) {
    console.error('Error injecting content script:', error);
    
    // Show error on button
    const button = document.getElementById('injectIframe');
    button.textContent = 'Error - Try Again';
    button.style.backgroundColor = '#ea4335';
    
    setTimeout(() => {
      button.textContent = 'Inject Iframe to Page';
      button.style.backgroundColor = '';
    }, 2000);
  }
});