import { LeaderBoardI } from "../../..";
import { generateRandomId, rgbToHex } from "../../../utils/helpers";

interface createLeaderBoardButtonI {
    iframeDocument: Document;
    leaderboardsData: LeaderBoardI;

}

// leaderboard dragger

export function createLeaderBoardButton(
{iframeDocument, leaderboardsData}: createLeaderBoardButtonI
): HTMLElement {
    const button = iframeDocument.createElement("button");
    button.id = "drag-btn";
    button.draggable = true;
    button.textContent = "leaderboard";

    // Add dragstart event to pass leaderboard data
    button.addEventListener("dragstart", (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id: generateRandomId(),
            type: "leaderboard",
            label: "leaderboard",
            leaderboards: leaderboardsData,
          })
        );
      }
    });

    return button;
  }

// mouse event handler

  export function handleMouseEvents(
    iframeDocument: Document,
    container: HTMLDivElement,
    createSettingsButton: (container: HTMLDivElement, id: string) => HTMLButtonElement,
    id: string
  ): void {
    container.addEventListener("mouseenter", () => {
      if (!iframeDocument.getElementById(`${id}-button`)) {
        const button = createSettingsButton(container, id);
        container.appendChild(button);
      }
    });
  
    container.addEventListener("mouseleave", () => {
      const button = iframeDocument.getElementById(`${id}-button`);
      if (button) container.removeChild(button);
    });
  }

  export function createSettingsButton(
    iframeDocument: Document,
    openSettingsMenu: (container: HTMLDivElement, id: string) => void,
    container: HTMLDivElement,
    id: string
  ): HTMLButtonElement {
    const button = iframeDocument.createElement("button");
    button.id = `${id}-button`;
    button.textContent = "settings";
    Object.assign(button.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    });
  
    button.addEventListener("click", () => openSettingsMenu(container, id));
    return button;
  }
  
  export function openSettingsMenu(
    iframeDocument: Document,
    leaderboardsData: Record<string, any>,
    constructLeaderBoard: ({
      id,
      leaderboards,
      backgroundColor,
    }: {
      id: string;
      leaderboards: Record<string, any>;
      backgroundColor: string;
    }) => void,
    container: HTMLDivElement,
    id: string
  ): void {
    const toolbar = document.getElementById("toolbar");
    console.log("შემოვიდა მაღლა")
      if (!toolbar) return;
  
    document.getElementById("leaderboard-settings")?.remove();
  
    const settingsContainer = document.createElement("div");
    settingsContainer.id = "leaderboard-settings";
    settingsContainer.style.marginTop = "10px";
  
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Background Color:";
    colorLabel.style.display = "block";
  
    const backgroundColorInput = document.createElement("input");
    backgroundColorInput.type = "color";
    backgroundColorInput.value = rgbToHex(
      window.getComputedStyle(container).backgroundColor
    );
  
    const inputsConfig = [
      {
        name: "primary",
        defaultValue: "#007bff",
        type: "color",
      },
      {
        name: "secondary",
        defaultValue: "#007bff",
        type: "color",
      },
      {
        name: "base",
        defaultValue: "#007bff",
        type: "color",
      },
      {
        name: "textColor",
        defaultValue: "#007bff",
        type: "color",
      }
    ]
    
    interface inputConfigI {
      name: string;
      defaultValue: string;
      type: string; 
    }
  
    const inputsContainer = document.createElement("div");
  
    console.log("შემოვიდა მაღლა")
    function inputsDrawer(inputsConfig:inputConfigI[]) {
      inputsConfig.forEach(inputConfig => {
        const input = document.createElement("input");
        input.type = inputConfig.type;
        input.value = rgbToHex(
          window.getComputedStyle(container).backgroundColor
        );
        inputsContainer.appendChild(input);
      })
    }
    console.log("შემოვიდა")
    inputsDrawer(inputsConfig);
  
    const primaryColorInput = document.createElement("input");
    primaryColorInput.type = "color";
  
    const secondaryColorInput = document.createElement("input");
  
  
  
    
    
    const selectLeaderBoard = iframeDocument.createElement("select");
    Object.entries(leaderboardsData).forEach(([key, board]) => {
      const option = iframeDocument.createElement("option");
      option.value = key;
      option.textContent = board.title;
      selectLeaderBoard.appendChild(option);
    });
  
    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply Changes";
    applyButton.style.marginTop = "10px";
  
    
    applyButton.addEventListener("click", () => {
      constructLeaderBoard({
        id,
        leaderboards: leaderboardsData,
        backgroundColor: backgroundColorInput.value,
      });
    });
  
    settingsContainer.appendChild(colorLabel);
    settingsContainer.appendChild(backgroundColorInput);
    settingsContainer.appendChild(selectLeaderBoard);
    settingsContainer.appendChild(applyButton);
    settingsContainer.appendChild(inputsContainer);
    toolbar.appendChild(settingsContainer);
  }