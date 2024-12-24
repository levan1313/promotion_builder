import { constructElement } from "./elementConstructors";
import { leaderboard_01 } from "../elements/LeaderBoard/leaderboards.style";

export function createView(): HTMLIFrameElement {
const lb_01 = leaderboard_01;
  // Define the HTML template as a string
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Draggable Button</title>
      <style>
              @font-face {
      font-family: 'Satoshi';
      src: url('https://fonts.cdnfonts.com/s/84480/Satoshi-Regular.woff2') format('woff2'),
          url('https://fonts.cdnfonts.com/s/84480/Satoshi-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Satoshi';
      src: url('https://fonts.cdnfonts.com/s/84480/Satoshi-Bold.woff2') format('woff2'),
          url('https://fonts.cdnfonts.com/s/84480/Satoshi-Bold.woff') format('woff');
      font-weight: bold;
      font-style: normal;
    }

    /* General reset */
    * {
      font-family: 'Satoshi', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
      ${leaderboard_01}
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
