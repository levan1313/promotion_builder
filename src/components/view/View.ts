import { constructElement } from "./elementConstructors";

export function createView(): HTMLIFrameElement {

  // Define the HTML template as a string
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Draggable Button</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        #view-id div {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
    </body>
    </html>
  `;

  // Create the iframe element
  const iframe = document.createElement("iframe");
  iframe.id = "view";
  iframe.style.flex = "1";
  iframe.style.border = "none";
  iframe.style.width = "100%";

  // Write the string HTML into the iframe
  iframe.addEventListener("load", () => {
    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return;

    iframeDocument.open();
    iframeDocument.write(htmlTemplate);
    iframeDocument.close();

    // Add event listeners
    iframeDocument.addEventListener("dragover", (event) => {
      event.preventDefault(); // Allow dropping
    });

    iframeDocument.addEventListener("drop", (event) => {
      event.preventDefault();

      const rawData = event.dataTransfer?.getData("text/plain");
      if (!rawData) {
        console.warn("No data was dropped.");
        return;
      }

      constructElement(rawData, iframeDocument);
    });

  });

  return iframe;
}
