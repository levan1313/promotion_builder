export function createExportButton(iframe: HTMLIFrameElement): HTMLElement {
    // Create the log button
    const logButton = document.createElement('button');
    logButton.id = 'log-btn';
    logButton.textContent = 'Log Iframe Content';
  
    // Add click event listener to log the iframe content
    logButton.addEventListener('click', () => {
      const iframeDocument = iframe.contentDocument;
  
      if (iframeDocument) {
        // Log the entire HTML content
      } else {
        console.error('Failed to access iframe document. Ensure the iframe is same-origin.');
      }
    });
  
    return logButton;
  }
  