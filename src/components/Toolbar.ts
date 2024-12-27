import { EditorConfigI, SharedDataI } from "..";
import { createBannerButton } from "./elements/Banner/Banner";
import { createExportButton } from "./elements/ExportButton";
import { createGeneralSettings } from "./elements/GeneralSettings";
import { LeaderBoardManager } from "./elements/LeaderBoard/LeaderBoard";
import { createLeaderBoardButton } from "./elements/LeaderBoard/uiHelpers";

export function createToolbar({view, sharedData, editorConfig}:{view: HTMLIFrameElement; sharedData: SharedDataI, editorConfig: EditorConfigI}): HTMLElement {
    // Create the toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = "toolbar";
    toolbar.style.width = '250px';
    toolbar.style.background = "#2C3E50";
    toolbar.style.padding = "15px 15px 100px 15px";
    toolbar.style.boxShadow = "2px 0 10px rgba(0, 0, 0, 0.2)";
    toolbar.style.display = "flex";
    toolbar.style.flexDirection = "column";
    toolbar.style.gap = "15px";
    toolbar.style.overflowY = "auto";
  

      // Add scrollbar styles
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    #toolbar {
      scrollbar-width: thin; /* For Firefox */
      scrollbar-color: #34495E #2C3E50; /* Thumb and track color */
    }

    #toolbar::-webkit-scrollbar {
      width: 8px; /* Scrollbar width */
    }

    #toolbar::-webkit-scrollbar-thumb {
      background: #34495E; /* Scrollbar thumb color */
      border-radius: 4px; /* Rounded edges */
    }

    #toolbar::-webkit-scrollbar-thumb:hover {
      background: #16A085; /* Thumb hover color */
    }

    #toolbar::-webkit-scrollbar-track {
      background: #2C3E50; /* Scrollbar track color */
    }
  `;
  document.head.appendChild(styleElement);

    // Reusable function to create styled sections
    function createSection(title: string): HTMLElement {
      const section = document.createElement('div');
      section.style.border = "1px solid #34495E";
      section.style.padding = "15px";
      section.style.borderRadius = "8px";
      section.style.background = "#34495E";
      section.style.marginBottom = "10px";
      section.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
      section.style.transition = "transform 0.2s, box-shadow 0.2s";
  
      // Add hover effect for the section
      section.addEventListener("mouseover", () => {
        section.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
      });
      section.addEventListener("mouseout", () => {
        section.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
      });
  
      const header = document.createElement('h3');
      header.textContent = title;
      header.style.margin = "0 0 10px 0";
      header.style.fontSize = "18px";
      header.style.color = "#ECF0F1";
      header.style.textAlign = "center";
  
      section.appendChild(header);
      return section;
    }
  
    // Create sections
    const generalSettingsSection = createSection("General Settings");
    const componentsSection = createSection("Components");
    const selectedElementSettingsSection = createSection("Selected Element's Settings");
  
    // Create buttons and components
    const generalSettings = createGeneralSettings({ iframeDocument: view });
    const banner = createBannerButton();
    const logButton = createExportButton(view, editorConfig.toolbar.exportButton.callBack);
  
    const leaderboardManager = new LeaderBoardManager(document, sharedData.leaderBoards, editorConfig);
    const leaderBoardButton = createLeaderBoardButton({
      iframeDocument: document,
      leaderboardsData: sharedData.leaderBoards,
    });
  
    // Append components to their respective sections
    generalSettingsSection.appendChild(generalSettings);
    componentsSection.appendChild(banner);
    componentsSection.appendChild(leaderBoardButton);
    // componentsSection.appendChild(logButton);
  
    // Append sections to the toolbar
    toolbar.appendChild(generalSettingsSection);
    toolbar.appendChild(componentsSection);
    toolbar.appendChild(selectedElementSettingsSection);
  


    // Create the popup button
  const popupButton = document.createElement("button");
  popupButton.textContent = "preview";
  popupButton.style.position = "absolute";
  popupButton.style.top = "10px";
  popupButton.style.left = "10px";
  popupButton.style.padding = "10px";
  popupButton.style.backgroundColor = "#1ABC9C";
  popupButton.style.color = "#fff";
  popupButton.style.border = "none";
  popupButton.style.borderRadius = "5px";
  popupButton.style.cursor = "pointer";
  popupButton.style.zIndex = "1000";
  popupButton.style.opacity = "0.4";

  popupButton.addEventListener("mouseover", () => {
    popupButton.style.opacity = "1";
  });

  popupButton.addEventListener("mouseout", () => {
    popupButton.style.opacity = "0.4";
  });

  popupButton.addEventListener("click", () => {
    const popup = window.open("", "_blank", "width=800,height=600");

    if (popup) {
      const iframeDocument = view.contentDocument;
      if(iframeDocument)
      popup.document.write(iframeDocument.documentElement.outerHTML);
    }
  });

  document.body.appendChild(popupButton);
    return toolbar;


  }
  