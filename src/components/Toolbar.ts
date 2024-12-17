import { SharedDataI } from "..";
import { createBanner } from "./elements/Banner";
import { createButton } from "./elements/Button";
import { createExportButton } from "./elements/ExportButton";
import { LeaderBoardManager } from "./elements/LeaderBoard";

export function createToolbar({view, sharedData}:{view: HTMLIFrameElement; sharedData: SharedDataI}): HTMLElement {
    // Create the toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = "toolbar";
    toolbar.style.width = '200px';
    toolbar.style.background = "#c42523"
    toolbar.style.padding = "10px";
    toolbar.style.boxShadow = "2px 0 5px rgba(0, 0, 0, 0.1)"
    // Create the draggable buttons

    const button = createButton(sharedData);
    const logButton = createExportButton(view);
    const banner = createBanner();

    const leaderboardManager = new LeaderBoardManager(document, sharedData.leaderBoards);

    const leaderBoardButton = leaderboardManager.createLeaderBoardButton();

    console.log(sharedData.leaderBoards)
    // Append buttons to the toolbar
    toolbar.appendChild(button);
    toolbar.appendChild(banner);
    toolbar.appendChild(logButton);
    toolbar.appendChild(leaderBoardButton);

    return toolbar;
  }
  