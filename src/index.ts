import "./style.css";
import { createToolbar } from "./components/Toolbar";
import { createView } from "./components/view/View";

// Define the interface for a single leaderboard entry
interface LeaderBoardEntryI {
  id: number;
  playerId: number;
  userName: string;
  segment: string | null;
  place: number;
  score: number;
  prizeType: string;
  prizeValue: number;

}

// Define the interface for a leaderboard group with title and entries
export interface LeaderBoardGroupI {
  title: string;
  entries: LeaderBoardEntryI[];
}

export interface LeaderBoardI {
  
    [key: string]: LeaderBoardGroupI;
  
}

// Shared data structure, updated to match the adjusted leaderboard structure
export interface SharedDataI {
  user: string;
  buttonLabel: string;
  leaderBoards: LeaderBoardI;
}

export interface EditorConfigI {
  containerId?: string;
  toolbar: {
    exportButton: {
      callBack:() => void;
    };
  };
  colors?: Record<string, string>;
}
// default sharedData config
let sharedData: SharedDataI = {
  user: "",
  buttonLabel: "",
  leaderBoards: {}, // Adjusted to match the grouped leaderboard structure
}; // Store the shared data globally within the package

// default editor config data

let editorConfig = {
  containerId: "builder",
  toolbar: {
    exportButton: {
      callBack:() => {}
    }
  },
  colors: {base: '#00141E', secondary: '#062733',  main: "#189541", textColor: "#000000"}
}
let app: HTMLElement | null = null; // Store the app element reference

/**
 * Initialize the package with shared data.
 * @param data Shared data to initialize the package.
 */
export function initializePackage({data,editorConfig}:{data: SharedDataI; editorConfig:EditorConfigI}): void {
  sharedData = { ...data };
  editorConfig = { ...editorConfig };
}

/**
 * Get the shared data.
 * @returns The shared data.
 */
export function useSharedData(): SharedDataI {
  if (!sharedData) {
    throw new Error(
      "Package not initialized. Call initializePackage(data) first."
    );
  }
  return sharedData;
}

/**
 * Render the package UI inside the app container.
 */
export function renderApp(): void {
  if (!app) {
    // Ensure the `app` element is created only once
    app = document.getElementById(editorConfig.containerId || "builder");
    if(!app) return;
    app.id = "builder";
    app.style.display = "flex";
    app.style.height = "100vh";
    app.style.width = "100%";

    // Create and append the view (iframe) to the app
    const view = createView();
    app.appendChild(view);

    // Create and append the toolbar to the app
    const toolbar = createToolbar({ view, sharedData, editorConfig });
    app.appendChild(toolbar);

    document.body.appendChild(app);
  }
}

// Standalone development mode
if (import.meta.env.MODE === "development") {
const data = {
  user: "Standalone User",
  buttonLabel: "Development Mode Button",
  leaderBoards: {
    "0": {
      title: "First Leaderboard 12",
      entries: [
        {
          id: 0,
          playerId: 1,
          userName: "test",
          segment: null,
          place: 1,
          score: 1,
          prizeType: "gold",
          prizeValue: 1000,
        },
        {
          id: 1,
          playerId: 2,
          userName: "player2",
          segment: null,
          place: 2,
          score: 950,
          prizeType: "silver",
          prizeValue: 750,
        },
      ],
    },
    "1": {
      title: "Second Leaderboard 12",
      entries: [
        {
          id: 2,
          playerId: 3,
          userName: "player3",
          segment: "A",
          place: 3,
          score: 900,
          prizeType: "bronze",
          prizeValue: 500,
        },
        {
          id: 3,
          playerId: 4,
          userName: "player4",
          segment: "B",
          place: 4,
          score: 850,
          prizeType: "gold",
          prizeValue: 1000,
        },
        {
          id: 4,
          playerId: 5,
          userName: "player5",
          segment: "C",
          place: 5,
          score: 800,
          prizeType: "silver",
          prizeValue: 750,
        },
      ],
    },
  },
}
  initializePackage({data, editorConfig});

  renderApp();
}

export default {
  initializePackage,
  useSharedData,
  renderApp,
};
