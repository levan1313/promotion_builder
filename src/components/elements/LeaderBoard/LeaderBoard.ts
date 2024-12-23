import { EditorConfigI, LeaderBoardGroupI, LeaderBoardI } from "../../..";
import { generateRandomId, rgbToHex } from "../../../utils/helpers";

export class LeaderBoardManager {
  private iframeDocument: Document;
  public leaderboardKey: string;
  public leaderboardsData: LeaderBoardI;
  public colors: Record<string, string> = {base: '#00141E', secondary: '#062733',  main: "#189541"};

  constructor(iframeDocument: Document, leaderboardsData: LeaderBoardI, editorConfig?: EditorConfigI) {
    this.iframeDocument = iframeDocument;
    this.leaderboardKey = "0";
    this.leaderboardsData = leaderboardsData;
    this.colors = editorConfig?.colors || this.colors;
  }
  

  // Builds the leaderboard UI in the iframe
  public constructLeaderBoard({
    id,
    leaderboards,
  }: {
    id: string;
    leaderboards: LeaderBoardI;
  }): void {
    const { title, entries } = leaderboards[this.leaderboardKey];

    // Remove existing leaderboard container if any
    const existingContainer = this.iframeDocument.getElementById(id);
    if (existingContainer) existingContainer.remove();

    // Create leaderboard components
    const container = this.createContainer(id);
    const heading = this.createHeading(title);
    const table = this.createTable(entries);

    // Append components to container
    container.appendChild(heading);
    container.appendChild(table);
    this.iframeDocument.body.appendChild(container);

    // Add mouse events for additional UI interactions
    this.handleMouseEvents(container, id);
  }

  // Creates a container for the leaderboard
  private createContainer(id: string): HTMLDivElement {
    const container = this.iframeDocument.createElement("div");
    Object.assign(container.style, {
      width: "100%",
      margin: "20px 0",
      position: "relative",
      backgroundColor: this.colors.base,
      borderRadius: "10px",
      padding: "10px",
    });
    container.id = id;
    return container;
  }

  // Creates the leaderboard heading
  private createHeading(titleText: string): HTMLElement {
    const glowingBorder = this.iframeDocument.createElement("div");
    glowingBorder.className = "glowing-border";

    const leaderboardHeader = this.iframeDocument.createElement("div");
    leaderboardHeader.className = "leaderboard-header";
    leaderboardHeader.style.background = this.colors.base;
    glowingBorder.appendChild(leaderboardHeader);

    const title = this.iframeDocument.createElement("h2");
    title.className = "leaderboard-header__title";

    const icon = this.iframeDocument.createElement("img");
    icon.className = "medal-icon";
    icon.src = "./images/leaderboard/lb_header_icon.png";
    icon.alt = "1st";

    title.appendChild(icon);
    title.appendChild(this.iframeDocument.createTextNode(titleText));
    leaderboardHeader.appendChild(title);

    return glowingBorder;
  }

  // Creates the leaderboard table
private createTable(entries: Record<string, any>[]): HTMLDivElement {
  const wrapper = this.iframeDocument.createElement("div");
  wrapper.className = "leaderboard-table-wrapper";

  const table = this.iframeDocument.createElement("table");
  table.className = "leaderboard-table";
  wrapper.appendChild(table);

  // Add table headers
  const headers = ["Place", "Player", "Points", "Prize"];
  const thead = this.iframeDocument.createElement("thead");
  const headerRow = this.iframeDocument.createElement("tr");

  headers.forEach((header) => {
    const th = this.iframeDocument.createElement("th");
    th.className = "leaderboard-table__header-cell";
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Add table body
  const tbody = this.iframeDocument.createElement("tbody");
  tbody.className = "leaderboard-rows";
  entries.forEach((entry, index) => {
    const row = this.iframeDocument.createElement("tr");
    row.className = "leaderboard-table__row";
    row.style.backgroundColor = this.colors.secondary;

    const values = [index + 1, entry.userName, entry.score, entry.prizeValue];
    values.forEach((value) => {
      const td = this.iframeDocument.createElement("td");
      td.className = "leaderboard-table__cell";
      td.textContent = String(value);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Add table footer
  const footer = this.createFooter(entries[entries.length - 1]);
  table.appendChild(footer);

  return wrapper;
}

// Creates the leaderboard footer
private createFooter(lastEntry: Record<string, any>): HTMLElement {
  const tfoot = this.iframeDocument.createElement("tfoot");
  const footerRow = this.iframeDocument.createElement("tr");
  footerRow.className = "leaderboard-table__row sticky-footer";
  // tfoot.style.backgroundColor = this.colors.main;
  // Apply green background to footer
  footerRow.style.backgroundColor = this.colors.main;

  // Populate footer with last entry values
  const values = ["Total", lastEntry.userName, lastEntry.score, lastEntry.prizeValue];
  values.forEach((value) => {
    const td = this.iframeDocument.createElement("td");
    td.className = "leaderboard-table__cell";
    td.textContent = String(value);
    footerRow.appendChild(td);
  });

  tfoot.appendChild(footerRow);
  return tfoot;
}

  // Handles mouse events for showing/hiding settings button
  private handleMouseEvents(container: HTMLDivElement, id: string): void {
    container.addEventListener("mouseenter", () => {
      if (!this.iframeDocument.getElementById(`${id}-button`)) {
        const button = this.createSettingsButton(container, id);
        container.appendChild(button);
      }
    });

    container.addEventListener("mouseleave", () => {
      const button = this.iframeDocument.getElementById(`${id}-button`);
      if (button) container.removeChild(button);
    });
  }

  // Creates a settings button for leaderboard customization
  private createSettingsButton(
    container: HTMLDivElement,
    id: string
  ): HTMLButtonElement {
    const button = this.iframeDocument.createElement("button");
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

    button.addEventListener("click", () =>
      openSettingsMenu({
      colors: this.colors,
      leaderboardsData: this.leaderboardsData,
      leaderboardKey: this.leaderboardKey,
      onApplyChanges: (selectedKey, newColors) => {
        this.leaderboardKey = selectedKey;
        this.colors = newColors;
        this.constructLeaderBoard({
        id,
        leaderboards: this.leaderboardsData,
        });
      },
      id,
      })
    );
    return button;
  }

  // Opens a settings menu for leaderboard customization
  // private openSettingsMenu(container: HTMLDivElement, id: string): void {
  //   const toolbar = document.getElementById("toolbar");
  //   if (!toolbar) return;
  
  //   // Remove existing settings if any
  //   document.getElementById("leaderboard-settings")?.remove();
  
  //   const settingsContainer = document.createElement("div");
  //   settingsContainer.id = "leaderboard-settings";
  //   settingsContainer.style.marginTop = "10px";

  //   const settingsHeader = document.createElement("h3");
  //   settingsHeader.innerText = "Leaderboard Settings";
  //   settingsHeader.style.color = "white";

  //   settingsContainer.appendChild(settingsHeader);
  
  //   // Inputs configuration
  //   const inputsConfig = [
  //     {
  //       name: "base",
  //       defaultValue: this.colors.base,
  //       type: "color",
  //     },
  //     {
  //       name: "secondary",
  //       defaultValue: this.colors.secondary,
  //       type: "color",
  //     },
  //     {
  //       name: "main",
  //       defaultValue: this.colors.main,
  //       type: "color",
  //     },
  //     {
  //       name: "textColor",
  //       defaultValue: "#000000",
  //       type: "color",
  //     },
  //   ];
  
  //   interface InputConfig {
  //     name: string;
  //     defaultValue: string;
  //     type: string;
  //   }
  
  //   // Container for inputs
  //   const inputsContainer = document.createElement("div");
  //   inputsContainer.style.display = "flex";
  //   inputsContainer.style.flexDirection = "column";
  
  //   // Object to store input references
  //   const inputElements: { [key: string]: HTMLInputElement } = {};
  
  //   // Function to create inputs
  //   function inputsDrawer(inputsConfig: InputConfig[]) {
  //     inputsConfig.forEach((inputConfig) => {
  //       const label = document.createElement("label");
  //       label.innerText = inputConfig.name;
  //       label.style.marginTop = "5px";
  //       label.style.color = "white";

  //       const input = document.createElement("input");
  //       input.type = inputConfig.type;
  //       input.value = inputConfig.defaultValue;
  
  //       // Append label and input to the container
  //       inputsContainer.appendChild(label);
  //       inputsContainer.appendChild(input);
  
  //       // Store reference to the input element
  //       inputElements[inputConfig.name] = input;
  //     });
  //   }
  
  //   // Call the function to create inputs
  //   inputsDrawer(inputsConfig);
  
  //   // Leaderboard selection dropdown
  //   const selectLeaderBoard = document.createElement("select");
  //   Object.entries(this.leaderboardsData).forEach(([key, board]) => {
  //     const option = document.createElement("option");
  //     option.value = key;
  //     option.textContent = board.title;
  //     selectLeaderBoard.appendChild(option);
  //   });
  
  //   // Apply changes button
  //   const applyButton = document.createElement("button");
  //   applyButton.textContent = "Apply Changes";
  //   applyButton.style.marginTop = "10px";
  
  //   // Event listener for the apply button
  //   applyButton.addEventListener("click", () => {
  //     // Log the background color value
  
  //     // Log the values of all inputs
  //     Object.entries(inputElements).forEach(([name, input]) => {
  //       console.log(`${name}: ${input.value}`);
  //     });
  
  //     // Existing functionality to reconstruct the leaderboard
  //     this.leaderboardKey = selectLeaderBoard.value;
  //     const colors = {
  //       base: inputElements["base"].value,
  //       secondary: inputElements["secondary"].value,
  //       main: inputElements["main"].value,
  //       textColor: inputElements["textColor"].value,
  //     }

  //     this.colors.base = inputElements["base"].value;
  //     this.colors.secondary = inputElements["secondary"].value;
  //     this.colors.main = inputElements["main"].value;
  //     console.log("Colors:", inputElements["base"].value);
  //     this.constructLeaderBoard({
  //       id,
  //       leaderboards: this.leaderboardsData,
  //       backgroundColor: this.colors.base,
  //       colors,
  //     });
  //   });
  
  //   // Append all elements to the settings container
  //   settingsContainer.appendChild(selectLeaderBoard);
  //   settingsContainer.appendChild(inputsContainer);
  //   settingsContainer.appendChild(applyButton);
  
  //   // Append the settings container to the toolbar
  //   toolbar.appendChild(settingsContainer);
  // }
  
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
      defaultValue: "#000000",
      type: "color",
    },
  ];

  // Container for inputs
  const inputsContainer = document.createElement("div");
  inputsContainer.style.display = "flex";
  inputsContainer.style.flexDirection = "column";

  // Object to store input references
  const inputElements: Record<string, HTMLInputElement> = {};

  // Create inputs dynamically
  inputsConfig.forEach((inputConfig) => {
    const label = document.createElement("label");
    label.innerText = inputConfig.name;
    label.style.marginTop = "5px";
    label.style.color = "white";

    const input = document.createElement("input");
    input.type = inputConfig.type;
    input.value = inputConfig.defaultValue;

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
      base: inputElements["base"].value,
      secondary: inputElements["secondary"].value,
      main: inputElements["main"].value,
      textColor: inputElements["textColor"].value,
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

