(function () {
  if (document.getElementById('gemini-extension-iframe-wrapper')) return;

  const selectedText = window.getSelection().toString().trim();

  // Create a container div for drag + resize
  const wrapper = document.createElement('div');
  wrapper.id = 'gemini-extension-iframe-wrapper';
  wrapper.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 350px;
    min-width: 300px;
    min-height: 280px;
    border: 2px solid #4285f4;
    border-radius: 8px;
    z-index: 999999;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Draggable bar with close button
  const dragBar = document.createElement('div');
  dragBar.style.cssText = `
    background: #4285f4;
    color: white;
    padding: 8px 12px;
    cursor: move;
    font-size: 14px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px 6px 0 0;
    height: 36px;
    box-sizing: border-box;
  `;
  
  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'Gemini Assistant';
  dragBar.appendChild(titleSpan);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: background-color 0.2s;
  `;
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.backgroundColor = 'transparent';
  });
  closeBtn.addEventListener('click', () => {
    wrapper.remove();
  });
  dragBar.appendChild(closeBtn);

  wrapper.appendChild(dragBar);

  // Content area (replacing iframe with direct content)
  const contentArea = document.createElement('div');
  contentArea.style.cssText = `
    width: 100%;
    height: calc(100% - 36px);
    padding: 15px;
    box-sizing: border-box;
    background: #f8f9fa;
    overflow-y: auto;
    position: relative;
  `;

  // Dark mode toggle
  const darkModeContainer = document.createElement('div');
  darkModeContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: right;
    margin-bottom: 15px;
    gap: 10px;
  `;

  const darkModeLabel = document.createElement('label');
  darkModeLabel.textContent = 'Dark Mode';
  darkModeLabel.style.cssText = `
    font-size: 14px;
    color: #333;
    cursor: pointer;
  `;

  const toggleContainer = document.createElement('label');
  toggleContainer.style.cssText = `
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    cursor: pointer;
  `;

  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.style.cssText = `
    opacity: 0;
    width: 0;
    height: 0;
  `;

  const toggleSlider = document.createElement('span');
  toggleSlider.style.cssText = `
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;
  `;

  const toggleSliderBefore = document.createElement('span');
  toggleSliderBefore.style.cssText = `
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;
  toggleSlider.appendChild(toggleSliderBefore);

  toggleInput.addEventListener('change', () => {
    if (toggleInput.checked) {
      toggleSlider.style.backgroundColor = '#4285f4';
      toggleSliderBefore.style.transform = 'translateX(26px)';
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = 'white';
      document.body.classList.add('dark-mode');
    } else {
      toggleSlider.style.backgroundColor = '#ccc';
      toggleSliderBefore.style.transform = 'translateX(0)';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.classList.remove('dark-mode');
    }
  });

  toggleContainer.appendChild(toggleInput);
  toggleContainer.appendChild(toggleSlider);
  darkModeContainer.appendChild(darkModeLabel);
  darkModeContainer.appendChild(toggleContainer);
  contentArea.appendChild(darkModeContainer);

  // Selected text display
  const selectedDiv = document.createElement('div');
  selectedDiv.style.cssText = `
    margin-bottom: 12px;
    padding: 10px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 40px;
    font-size: 13px;
    color: #333;
    border-left: 4px solid #4285f4;
  `;
  selectedDiv.textContent = selectedText || "No text selected";
  contentArea.appendChild(selectedDiv);

  // Get Selected Text button
  const getTextBtn = document.createElement('button');
  getTextBtn.textContent = 'Get Selected Text';
  getTextBtn.style.cssText = `
    background-color: #34a853;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 12px;
    width: 100%;
    transition: background-color 0.2s;
  `;
  getTextBtn.addEventListener('mouseenter', () => {
    getTextBtn.style.backgroundColor = '#2d8f47';
  });
  getTextBtn.addEventListener('mouseleave', () => {
    getTextBtn.style.backgroundColor = '#34a853';
  });
  getTextBtn.addEventListener('click', () => {
    const newSelectedText = window.getSelection().toString().trim();
    if (newSelectedText) {
      selectedDiv.textContent = newSelectedText;
      // Send postMessage for extensibility
      window.postMessage({ 
        type: "gemini-selected-text", 
        text: newSelectedText 
      }, "*");
    } else {
      selectedDiv.textContent = "No text currently selected on the page";
    }
  });
  contentArea.appendChild(getTextBtn);

  // Prompt input
  const promptInput = document.createElement('input');
  promptInput.type = 'text';
  promptInput.placeholder = 'Enter your prompt...';
  promptInput.style.cssText = `
    color: black;
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  `;
  promptInput.addEventListener('focus', () => {
    promptInput.style.borderColor = '#4285f4';
  });
  promptInput.addEventListener('blur', () => {
    promptInput.style.borderColor = '#ddd';
  });
  contentArea.appendChild(promptInput);

  // Send to Gemini button
  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send to Gemini';
  sendBtn.style.cssText = `
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 12px;
    transition: background-color 0.2s;
  `;
  sendBtn.addEventListener('mouseenter', () => {
    sendBtn.style.backgroundColor = '#3367d6';
  });
  sendBtn.addEventListener('mouseleave', () => {
    sendBtn.style.backgroundColor = '#4285f4';
  });

  // Response area
  const responseDiv = document.createElement('div');
  responseDiv.style.cssText = `
    padding: 12px;
    background: #e8f0fe;
    border-left: 4px solid #4285f4;
    border-radius: 6px;
    font-size: 13px;
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
    color: #333;
  `;
  responseDiv.textContent = 'Response will appear here...';

  sendBtn.addEventListener('click', async () => {
    const selected = selectedDiv.textContent;
    const prompt = promptInput.value.trim();
    
    // if (!prompt) {
    //   responseDiv.textContent = 'Please enter a prompt first.';
    //   return;
    // }

    const combinedText = prompt + ': ' + selected;
    console.log(combinedText);
    responseDiv.textContent = 'Loading...';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    

    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ inputText: combinedText }),
      });

      const responseData = await response.text();
      responseDiv.textContent = responseData;
    } catch (error) {
      responseDiv.textContent = 'Error: Could not connect to Gemini server. Make sure your local server is running on port 3000.';
      console.error('Gemini API Error:', error);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send to Gemini';
    }
  });

  contentArea.appendChild(sendBtn);
  contentArea.appendChild(responseDiv);

  // Resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.style.cssText = `
    width: 15px;
    height: 15px;
    background: #4285f4;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: se-resize;
    border-radius: 0 0 6px 0;
  `;
  resizeHandle.innerHTML = '<div style="position: absolute; right: 3px; bottom: 3px; width: 5px; height: 5px; border-right: 2px solid white; border-bottom: 2px solid white;"></div>';

  wrapper.appendChild(contentArea);
  wrapper.appendChild(resizeHandle);
  document.body.appendChild(wrapper);

  // Drag functionality
  let isDragging = false;
  let isResizing = false;
  let offsetX, offsetY;

  dragBar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    isDragging = true;
    offsetX = e.clientX - wrapper.getBoundingClientRect().left;
    offsetY = e.clientY - wrapper.getBoundingClientRect().top;
    document.body.style.userSelect = 'none';
    wrapper.style.opacity = '0.9';
  });

  // Resize functionality
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
    wrapper.style.opacity = '0.9';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      
      // Keep within viewport bounds
      const maxLeft = window.innerWidth - wrapper.offsetWidth;
      const maxTop = window.innerHeight - wrapper.offsetHeight;
      
      wrapper.style.left = Math.max(0, Math.min(maxLeft, newLeft)) + 'px';
      wrapper.style.top = Math.max(0, Math.min(maxTop, newTop)) + 'px';
      wrapper.style.right = 'auto';
      wrapper.style.bottom = 'auto';
    }

    if (isResizing) {
      const rect = wrapper.getBoundingClientRect();
      const newWidth = Math.max(300, e.clientX - rect.left);
      const newHeight = Math.max(280, e.clientY - rect.top);
      
      wrapper.style.width = newWidth + 'px';
      wrapper.style.height = newHeight + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging || isResizing) {
      wrapper.style.opacity = '1';
    }
    isDragging = false;
    isResizing = false;
    document.body.style.userSelect = '';
  });

  // Listen for postMessage events
  window.addEventListener('message', (event) => {
    if (event.data.type === 'gemini-selected-text') {
      console.log('Selected text received:', event.data.text);
    }
  });

  // Prevent text selection while dragging
  document.addEventListener('selectstart', (e) => {
    if (isDragging || isResizing) {
      e.preventDefault();
    }
  });

  // Allow Enter key to send
  promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
})();