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
        console.log("entered")
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
  
    button.addEventListener("click", () => {openSettingsMenu(container, id); console.log("click")});
    return button;
  }
  
// Separate function for opening the settings menu
export interface OpenSettingsMenuParams {
  colors: Record<string, string>;
  leaderboardsData: Record<string, { title: string }>;
  leaderboardKey: string;
  onApplyChanges: (selectedKey: string, newColors: Record<string, string>) => void;
  id: string;
}

export function openSettingsMenu({
  colors,
  leaderboardsData,
  leaderboardKey,
  onApplyChanges,
  id,
}: OpenSettingsMenuParams): void {
  const toolbar = document.getElementById("toolbar");
  if (!toolbar) return;

  // Remove existing settings if any
  document.getElementById("leaderboard-settings")?.remove();

  const settingsContainer = document.createElement("div");
  settingsContainer.id = "leaderboard-settings";
  settingsContainer.style.marginTop = "10px";

  const settingsHeader = document.createElement("h3");
  settingsHeader.innerText = "Leaderboard Settings";
  settingsHeader.style.color = "white";

  settingsContainer.appendChild(settingsHeader);

  // Inputs configuration
  interface InputConfig {
    name: string;
    defaultValue: string;
    type: string;
    options?: { value: string; label: string }[];
  }

  const inputsConfig: InputConfig[] = [
    {
      name: "base",
      defaultValue: colors.base,
      type: "color",
    },
    {
      name: "secondary",
      defaultValue: colors.secondary,
      type: "color",
    },
    {
      name: "main",
      defaultValue: colors.main,
      type: "color",
    },
    {
      name: "textColor",
      defaultValue: colors.textColor,
      type: "select",
      options: [
        { value: "#000000", label: "Black" },
        { value: "#ffffff", label: "White" },
      ],
    },
  ];

  // Container for inputs
  const inputsContainer = document.createElement("div");
  inputsContainer.style.display = "flex";
  inputsContainer.style.flexDirection = "column";

  // Object to store input references
  const inputElements: Record<string, HTMLInputElement | HTMLSelectElement> = {};

  // Create inputs dynamically
  inputsConfig.forEach((inputConfig) => {
    const label = document.createElement("label");
    label.innerText = inputConfig.name;
    label.style.marginTop = "5px";
    label.style.color = "white";

    let input: HTMLInputElement | HTMLSelectElement;

    if (inputConfig.type === "select" && inputConfig.options) {
      input = document.createElement("select");
      
      inputConfig.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        input.appendChild(optionElement);
      });
      console.log(inputConfig.defaultValue)
      input.value = inputConfig.defaultValue;
    } else {
      input = document.createElement("input");
      input.type = inputConfig.type;
      input.value = inputConfig.defaultValue;
    }

    inputsContainer.appendChild(label);
    inputsContainer.appendChild(input);

    inputElements[inputConfig.name] = input;
  });

  // Leaderboard selection dropdown
  const selectLeaderBoard = document.createElement("select");
  Object.entries(leaderboardsData).forEach(([key, board]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = board.title;
    selectLeaderBoard.appendChild(option);
  });
  selectLeaderBoard.value = leaderboardKey;

  // Apply changes button
  const applyButton = document.createElement("button");
  applyButton.textContent = "Apply Changes";
  applyButton.style.marginTop = "10px";

  applyButton.addEventListener("click", () => {
    const newColors = {
      base: (inputElements["base"] as HTMLInputElement).value,
      secondary: (inputElements["secondary"] as HTMLInputElement).value,
      main: (inputElements["main"] as HTMLInputElement).value,
      textColor: (inputElements["textColor"] as HTMLSelectElement).value,
    };

    const selectedKey = selectLeaderBoard.value;
    onApplyChanges(selectedKey, newColors);
  });

  // Append elements to settings container
  settingsContainer.appendChild(selectLeaderBoard);
  settingsContainer.appendChild(inputsContainer);
  settingsContainer.appendChild(applyButton);

  // Append settings container to toolbar
  toolbar.appendChild(settingsContainer);
}


