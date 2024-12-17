import "./style.css";
import { createToolbar } from "./components/Toolbar";
import { createView } from "./components/view/View";

// Define the interface for a single leaderboard entry
interface LeaderBoardEntryI {
  leaderboardRecordId: number;
  playerId: number;
  playerUsername: string;
  amount: number;
  placement: number;
  coinId: string;
  prizeAmount: number;
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

let sharedData: SharedDataI = {
  user: "",
  buttonLabel: "",
  leaderBoards: {}, // Adjusted to match the grouped leaderboard structure
}; // Store the shared data globally within the package

let app: HTMLElement | null = null; // Store the app element reference

/**
 * Initialize the package with shared data.
 * @param data Shared data to initialize the package.
 */
export function initializePackage(data: SharedDataI): void {
  sharedData = { ...data };
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
    app = document.createElement("div");
    app.id = "builder";
    app.style.display = "flex";
    app.style.height = "100vh";
    app.style.width = "100%";

    // Create and append the view (iframe) to the app
    const view = createView();
    app.appendChild(view);

    // Create and append the toolbar to the app
    const toolbar = createToolbar({ view, sharedData });
    app.appendChild(toolbar);

    document.body.appendChild(app);
  }
}

// Standalone development mode
if (import.meta.env.MODE === "development") {

  initializePackage({
    user: "Standalone User",
    buttonLabel: "Development Mode Button",
    leaderBoards: {
      "0": {
        title: "First Leaderboard",
        entries: [
          {
            leaderboardRecordId: 1,
            playerId: 6076,
            playerUsername: "player_1",
            amount: 7,
            placement: 19,
            coinId: "coin_1",
            prizeAmount: 603.97,
          },
          {
            leaderboardRecordId: 2,
            playerId: 8542,
            playerUsername: "player_2",
            amount: 5,
            placement: 15,
            coinId: "coin_2",
            prizeAmount: 300.0,
          },
        ],
      },
      "1": {
        title: "Second Leaderboard",
        entries: [
          {
            leaderboardRecordId: 3,
            playerId: 9432,
            playerUsername: "player_3",
            amount: 8,
            placement: 5,
            coinId: "coin_3",
            prizeAmount: 1200.5,
          },
          {
            leaderboardRecordId: 4,
            playerId: 1211,
            playerUsername: "player_4",
            amount: 4,
            placement: 20,
            coinId: "coin_4",
            prizeAmount: 450.75,
          },
        ],
      },
    },
  });

  renderApp();
}

export default {
  initializePackage,
  useSharedData,
  renderApp,
};
