import { LeaderBoardI } from "../../..";
import { generateRandomId, rgbToHex } from "../../../utils/helpers";
import { styleComponentButton } from "../uiHelpers";

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


      // Add styles to the button
      styleComponentButton(button);

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
  onDelete: () => void
}

export function openSettingsMenu({
  colors,
  leaderboardsData,
  leaderboardKey,
  onApplyChanges,
  onDelete, // New callback for deletion
  id,
}: OpenSettingsMenuParams): void {
  const toolbar = document.getElementById("toolbar");
  if (!toolbar) return;

  // Remove existing settings if any
  document.getElementById("leaderboard-settings")?.remove();

  const settingsContainer = document.createElement("div");
  settingsContainer.id = "leaderboard-settings";
  Object.assign(settingsContainer.style, {
    marginTop: "10px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#34495E",
    color: "#ECF0F1",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  });

  const settingsHeader = document.createElement("h3");
  settingsHeader.innerText = "Leaderboard Settings";
  Object.assign(settingsHeader.style, {
    marginBottom: "15px",
    fontSize: "18px",
    textAlign: "center",
  });

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
  Object.assign(inputsContainer.style, {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  });

  // Object to store input references
  const inputElements: Record<string, HTMLInputElement | HTMLSelectElement> = {};

  // Create inputs dynamically
  inputsConfig.forEach((inputConfig) => {
    const label = document.createElement("label");
    label.innerText = inputConfig.name;
    label.style.color = "#ECF0F1";

    let input: HTMLInputElement | HTMLSelectElement;

    if (inputConfig.type === "select" && inputConfig.options) {
      input = document.createElement("select");

      inputConfig.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        input.appendChild(optionElement);
      });
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
  Object.assign(selectLeaderBoard.style, {
    padding: "5px",
    borderRadius: "4px",
    backgroundColor: "#2C3E50",
    color: "#ECF0F1",
    border: "1px solid #2C3E50",
    marginBottom: "10px",
  });

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
  Object.assign(applyButton.style, {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    backgroundColor: "#1ABC9C",
    color: "#FFFFFF",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  });

  applyButton.addEventListener("mouseover", () => {
    applyButton.style.backgroundColor = "#16A085";
  });

  applyButton.addEventListener("mouseout", () => {
    applyButton.style.backgroundColor = "#1ABC9C";
  });

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

  // Delete leaderboard button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Leaderboard";
  Object.assign(deleteButton.style, {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    backgroundColor: "#e74c3c",
    color: "#FFFFFF",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  });

  deleteButton.addEventListener("mouseover", () => {
    deleteButton.style.backgroundColor = "#c0392b";
  });

  deleteButton.addEventListener("mouseout", () => {
    deleteButton.style.backgroundColor = "#e74c3c";
  });

  deleteButton.addEventListener("click", () => {
    if (onDelete) {
      onDelete();
    }
  });

  // Append elements to settings container
  settingsContainer.appendChild(selectLeaderBoard);
  settingsContainer.appendChild(inputsContainer);
  settingsContainer.appendChild(applyButton);
  settingsContainer.appendChild(deleteButton);

  // Append settings container to toolbar
  toolbar.appendChild(settingsContainer);
}


