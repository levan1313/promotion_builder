export function createExportButton(iframe: HTMLIFrameElement, callBack: (doc: Document) => void): HTMLElement {
  const logButton = document.createElement('button');
  logButton.id = 'log-btn';
  logButton.textContent = 'Log Iframe Content';

  logButton.addEventListener('click', () => {
    const iframeDocument = iframe.contentDocument;
    if (iframeDocument) {
      // Execute the callback with the iframe document
      callBack(iframeDocument);
    } else {
      console.error('Failed to access iframe document. Ensure the iframe is same-origin.');
    }
  });

  return logButton;
}