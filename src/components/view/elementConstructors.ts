import { BannerManager } from "../elements/Banner/Banner";
import { LeaderBoardManager } from "../elements/LeaderBoard/LeaderBoard";

// Utility function to create a button
export function constructElement(rawData: string, iframeiframeDocument: Document) {

  

  try {
    const data = JSON.parse(rawData);
    console.log("data", data)
    const LeaderBoard = new LeaderBoardManager(iframeiframeDocument, data.leaderboards);
    const Banner = new BannerManager(iframeiframeDocument);
    // Handle different types of elements
    if (data.type === "button") {
      constructButton({ iframeDocument: iframeiframeDocument, id: data.id, label: data.label });
    } else if (data.type === "banner") {
      Banner.constructBanner();
    } else if (data.type === "leaderboard") {
      LeaderBoard.constructLeaderBoard({id: data.id, leaderboards:data.leaderboards });
    } else {
      console.warn("Unsupported element type:", data.type);
    }
  } catch (error) {
    console.error("Error parsing dropped data:", error);
  }
}

// Creating a button
interface ConstructButtonI {
  iframeDocument: Document;
  id: string;
  label: string;
}

export function constructButton({ iframeDocument, id, label }: ConstructButtonI) {
  const button = iframeDocument.createElement("button");
  button.textContent = label;
  button.id = id;

  iframeDocument.body.appendChild(button);

  // Inject a script into the iframe to add an event listener
  const script = iframeDocument.createElement("script");
  script.textContent = `
      iframeDocument.getElementById('${id}').addEventListener('click', function() {
        alert('Button ${label} was clicked!');
      });
    `;

  // Append the script to the iframe's head
  iframeDocument.body.appendChild(script);
}

// Utility function to create a banner (image)
interface ConstructBannerI {
  iframeDocument: Document;
  id: string;
  src: string;
}

// export function constructBanner({ iframeDocument, id, src }: ConstructBannerI) {
//   const image = iframeDocument.createElement("img");
//   image.src = src;
//   image.alt = "Dropped Banner";
//   image.style.width = "100%";
//   image.style.height = "200px";
//   image.style.objectFit = "cover";
//   image.id = id;

//   iframeDocument.body.appendChild(image);
// }

