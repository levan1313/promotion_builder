import { EditorConfigI, LeaderBoardI } from "../../..";
import { openSettingsMenu } from "./uiHelpers";

export class LeaderBoardManager {
  private iframeDocument: Document;
  public leaderboardKey: string;
  public leaderboardsData: LeaderBoardI;
  public colors: Record<string, string> = {base: '#00141E', secondary: '#062733',  main: "#189541", textColor: "#ffffff"};

  constructor(iframeDocument: Document, leaderboardsData: LeaderBoardI, editorConfig?: EditorConfigI) {
    this.iframeDocument = iframeDocument;
    this.leaderboardKey = "0";
    this.leaderboardsData = leaderboardsData;
    this.colors = editorConfig?.colors || this.colors;
  }
  

  public constructLeaderBoard({
    id,
    leaderboards,
  }: {
    id: string;
    leaderboards: LeaderBoardI;
  }): void {
    const { title, entries } = leaderboards[this.leaderboardKey];
  
    // Check if the leaderboard container already exists
    const container = this.iframeDocument.getElementById(id) as HTMLDivElement;
  
    if (container) {
      // Update container background
      container.style.backgroundColor = this.colors.base;
      container.style.color = this.colors.textColor;
      // Update header background and content
      const heading = container.querySelector(".leaderboard-header") as HTMLDivElement;
     
      if (heading) {
        heading.style.backgroundColor = this.colors.base;
        heading.style.color = this.colors.textColor;
  
        // Update title text
        const titleElement = heading.querySelector("h2") as HTMLElement;
        if (titleElement) {
          titleElement.textContent = title;
        }
  
        // Update icon URL (ensure the icon is not lost)
        const icon = heading.querySelector(".medal-icon") as HTMLImageElement;
        if (icon) {
          icon.src = leaderboards[this.leaderboardKey].iconUrl || icon.src;
        } else {
          // If the icon doesn't exist, create and append it
          const newIcon = this.iframeDocument.createElement("img");
          newIcon.className = "medal-icon";
          newIcon.src = leaderboards[this.leaderboardKey].iconUrl;
          newIcon.alt = "1st";
          titleElement?.prepend(newIcon);
        }
      }
  
      // Update the first row background in the table
      const firstRow = container.querySelector(".leaderboard-table__row") as HTMLTableRowElement;
      if (firstRow) {
        firstRow.style.backgroundColor = this.colors.secondary;
      }
  
      // Update table content if necessary
      const tableWrapper = container.querySelector(".leaderboard-table-wrapper");
      if (tableWrapper) {
        tableWrapper.replaceWith(this.createTable(entries));
      }
    } else {
      // Create new leaderboard container and components if it doesn't exist
      const newContainer = this.createContainer(id);
      const heading = this.createHeading(title, leaderboards[this.leaderboardKey].iconUrl);
      const table = this.createTable(entries);
  
      // Append components to the new container
      newContainer.appendChild(heading);
      newContainer.appendChild(table);
      this.iframeDocument.body.appendChild(newContainer);
  
      // Add mouse events for additional UI interactions
      this.handleMouseEvents(newContainer, id);
    }
  }

  // Creates a container for the leaderboard
  private createContainer(id: string): HTMLDivElement {
    const container = this.iframeDocument.createElement("div");
    Object.assign(container.style, {
      width: "100%",
      position: "relative",
      backgroundColor: this.colors.base,
      borderRadius: "10px",
      padding: "10px",
      maxWidth: "765px",
      margin: "0 auto",
    });
    container.id = id;
    return container;
  }

  // Creates the leaderboard heading
  private createHeading(titleText: string, imgUrl: string): HTMLElement {
    const glowingBorder = this.iframeDocument.createElement("div");
    glowingBorder.className = "glowing-border";

    const leaderboardHeader = this.iframeDocument.createElement("div");
    leaderboardHeader.className = "leaderboard-header";
    leaderboardHeader.style.background = this.colors.base;
    leaderboardHeader.style.color = this.colors.textColor;
    glowingBorder.appendChild(leaderboardHeader);

    const title = this.iframeDocument.createElement("h2");
    title.className = "leaderboard-header__title";

    const icon = this.iframeDocument.createElement("img");
    icon.className = "medal-icon";
    icon.src = imgUrl;
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
  const wrapperTextColor = this.colors.textColor;
  wrapper.style.color = wrapperTextColor;
  const table = this.iframeDocument.createElement("table");
  table.className = "leaderboard-table";
  wrapper.appendChild(table);

  // Add table headers
  const headers = ["Place", "Player", "Points", "Prize"];
  const thead = this.iframeDocument.createElement("thead");
  thead.style.color = this.colors.textColor + "80";
  thead.style.backgroundColor = this.colors.base;
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
    row.style.color = this.colors.textColor;
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
        const button = this.createSettingsButton(id);
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
    id: string
  ): HTMLButtonElement {
    const button = this.iframeDocument.createElement("button");
    button.id = `${id}-button`;
    button.textContent = "Settings";
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

    button.addEventListener("click", () => {
      console.log(this.colors);
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
        onDelete: () => {
          this.deleteLeaderBoard(id);
        },
        id,
      });
    });
    return button;
  }

  // Deletes the leaderboard
  private deleteLeaderBoard(id: string): void {
    const container = this.iframeDocument.getElementById(id);
    if (container) {
      container.remove();
      console.log(`Leaderboard with ID "${id}" deleted successfully.`);
    } else {
      console.error(`Leaderboard with ID "${id}" not found.`);
    }
  }
}




