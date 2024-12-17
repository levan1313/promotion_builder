import { LeaderBoardGroupI, LeaderBoardI } from "../..";
import { generateRandomId } from "../../utils/helpers";

export class LeaderBoardManager {
  private iframeDocument: Document;
  public leaderboardKey: string;
  public leaderboardsData: LeaderBoardI;

  constructor(iframeDocument: Document, leaderboardsData: LeaderBoardI) {
    this.iframeDocument = iframeDocument;
    this.leaderboardKey = "0";
    this.leaderboardsData = leaderboardsData;
  }

  // Creates a draggable leaderboard button
  public createLeaderBoardButton(): HTMLElement {
    const leaderboardButton = this.iframeDocument.createElement("button");
    leaderboardButton.id = "drag-btn";
    leaderboardButton.draggable = true;
    leaderboardButton.textContent = "leaderboard";

    leaderboardButton.addEventListener("dragstart", (event: DragEvent) => {
      const id = generateRandomId();
      if (event.dataTransfer) {
        event.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            type: "leaderboard",
            label: "leaderboard",
            leaderboards: this.leaderboardsData,
          })
        );
      }
    });

    return leaderboardButton;
  }

  // Constructs the leaderboard in the iframe document
  public constructLeaderBoard({
    id,
    leaderboards,
    backgroundColor = "",
  }: {
    id: string;
    leaderboards: LeaderBoardI;
    backgroundColor?: string;
  }): void {
    const { title, entries } = leaderboards[this.leaderboardKey];

    // Clear existing container if any
    const existingContainer = this.iframeDocument.getElementById(id);
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = this.createContainer(id, backgroundColor);
    const heading = this.createHeading(title);
    const table = this.createTable(entries);

    container.appendChild(heading);
    container.appendChild(table);
    this.iframeDocument.body.appendChild(container);

    this.handleMouseEvents(container, id);
  }

  // Utility to create container
  private createContainer(id: string, backgroundColor: string): HTMLDivElement {
    const container = this.iframeDocument.createElement("div");
    container.id = id;
    Object.assign(container.style, {
      width: "100%",
      margin: "20px 0",
      position: "relative",
      backgroundColor: backgroundColor || "#1a1a2e", // Default background
      borderRadius: "10px",
      padding: "10px",
    });
    return container;
  }

  // Utility to create heading
  private createHeading(title: string): HTMLHeadingElement {
    const heading = this.iframeDocument.createElement("h3");
    heading.textContent = title;
    Object.assign(heading.style, {
      textAlign: "center",
      marginBottom: "10px",
      color: "#ffffff",
      fontSize: "1.5em",
      fontWeight: "bold",
    });
    return heading;
  }

  // Utility to create table
  private createTable(entries: Record<string, any>[]): HTMLTableElement {
    const table = this.iframeDocument.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.color = "#ffffff";

    const headers = ["Record ID", "Player ID", "Username", "Amount", "Placement", "Coin ID", "Prize Amount"];

    const thead = this.iframeDocument.createElement("thead");
    const headerRow = this.iframeDocument.createElement("tr");
    Object.assign(headerRow.style, { backgroundColor: "#062733", color: "#00ffcc" });

    headers.forEach((header) => {
      const th = this.iframeDocument.createElement("th");
      th.textContent = header;
      Object.assign(th.style, {
        padding: "12px",
        textAlign: "center",
      });
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = this.iframeDocument.createElement("tbody");
    entries.forEach((entry, index) => {
      const row = this.iframeDocument.createElement("tr");
      row.style.backgroundColor = index % 2 === 0 ? "#162e3f" : "#112533";

      Object.values(entry).forEach((value) => {
        const td = this.iframeDocument.createElement("td");
        td.textContent = String(value);
        Object.assign(td.style, {
          padding: "12px",
          textAlign: "center",
        });
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  // Handle mouse events for settings button
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

  // Creates a settings button
  private createSettingsButton(container: HTMLDivElement, id: string): HTMLButtonElement {
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

    button.addEventListener("click", () => this.openSettingsMenu(container, id));
    return button;
  }

  // Opens a settings menu for customization
  private openSettingsMenu(container: HTMLDivElement, id: string): void {
    const toolbar = document.getElementById("toolbar");
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
    backgroundColorInput.value = this.rgbToHex(window.getComputedStyle(container).backgroundColor);

    const selectLeaderBoard = this.iframeDocument.createElement("select");
    Object.entries(this.leaderboardsData).forEach(([id, leaderBoard]) => {
      const option = this.iframeDocument.createElement("option");
      option.value = id;
      option.textContent = leaderBoard.title;
      selectLeaderBoard.appendChild(option);
    });

    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply Changes";
    applyButton.style.marginTop = "10px";

    applyButton.addEventListener("click", () => {
      this.leaderboardKey = selectLeaderBoard.value;
      this.constructLeaderBoard({
        id,
        leaderboards: this.leaderboardsData,
        backgroundColor: backgroundColorInput.value,
      });
    });

    settingsContainer.appendChild(colorLabel);
    settingsContainer.appendChild(backgroundColorInput);
    settingsContainer.appendChild(selectLeaderBoard);
    settingsContainer.appendChild(applyButton);

    toolbar.appendChild(settingsContainer);
  }

  private rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match) return "#ffffff";
    const [r, g, b] = match.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
