import { Session } from "../components/Session";
import { GameManager } from "../../application/controllers/GameManager.js";
import { GameController } from "../../application/controllers/GameController.js";
import { GameMapController } from "../../application/controllers/GameMapController.js";
import { UIView } from "./UIViews.js";
import { map } from "leaflet";

export function gameView(root) {
    root.innerHTML = `
    <div class="game-menu-container">
      <header class="game-header">
        <h2>Guess The Place</h2>
        <div id="sessionContainer"></div>
      </header>

      <main class="game-main">
        <div class="menu-section">
          <input 
            type="text" 
            id="userSearchInput" 
            placeholder="🔍 Search user by username..." 
            class="menu-input"
          />
          <button id="searchButton" class="menu-button">Search</button>
        </div>

        <div class="menu-section">
          <button id="startGameButton" class="menu-button">🎮 Start New Game</button>
          <button id="leaderboardButton" class="menu-button">🏆 Leaderboard</button>
        </div>

        <div id="searchResults" class="menu-section search-results"></div>
        <div id="gameContainer" class="hidden"></div>
        </main>
    </div>
    `;

    const sessionContainer = root.querySelector("#sessionContainer");
    Session(sessionContainer);

    // Elements
    const searchInput = root.querySelector("#userSearchInput");
    const searchButton = root.querySelector("#searchButton");
    const startGameButton = root.querySelector("#startGameButton");
    const leaderboardButton = root.querySelector("#leaderboardButton");
    const searchResultsDiv = root.querySelector("#searchResults");
    const gameContainer = root.querySelector("#gameContainer");
    

    let debounceTimer;

    searchInput.addEventListener("input", () => {
      const prefix = searchInput.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        if (prefix.length < 3) {
            searchResultsDiv.innerHTML = "";
            return;
        }
      
        try {
            const { SearchUser } = await import("../../application/usecases/SearchUser.js");
            const results = await SearchUser.byUsernamePrefix(prefix, 10);

            searchResultsDiv.innerHTML = results.length
              ? results.map(user => `<div class="search-result-item">${user.getUsername()}</div>`).join("")
              : "<p>No users found.</p>";
        } catch (error) {
            console.error("Error during user search: ", error);
            searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
        }
      }, 300); // Debounce delay of 300ms
    });


    searchButton.addEventListener("click", async () => {
        const prefix = searchInput.value.trim();
        if (!prefix) {
            searchResultsDiv.innerHTML = "<p>Please enter a username prefix to search.</p>";
            return;
        }

        searchResultsDiv.innerHTML = "<p>Searching...</p>";

        try {
            const { SearchUser } = await import("../../application/usecases/SearchUser.js");
            const results = await SearchUser.byUsernamePrefix(prefix);

            if (results.length === 0) {
                searchResultsDiv.innerHTML = "<p>No users found.</p>";
                return;
            }

            searchResultsDiv.innerHTML = results.length
              ? results.map(user => `<div class="search-result-item">${user.getUsername()}</div>`).join("")
              : "<p>No users found.</p>";
        } catch (error) {
            console.error("Error during user search: ", error);
            searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
        }
    });

    searchResultsDiv.addEventListener("click", (event) => {
      const userItem = event.target.closest(".search-result-item");
      if (userItem) {
          console.log(`User selected: ${userItem.textContent}`);
      }
    });

    startGameButton.addEventListener("click", () => {
      gameContainer.classList.remove("hidden");
      const uiView = new UIView(gameContainer);
      uiView.renderGameUI();
      const gameController = new GameController();
      const mapController = new GameMapController(uiView.getMapContainerId());
      
      const gameManager = new GameManager({ 
        gameController, 
        gameMapController: mapController, 
        uiView 
      });

      // Link Handler
      uiView.on("onConfirmGuess", () => gameManager.confirmGuess());
      uiView.on("onNextRound", () => gameManager.nextRound());
      mapController.onMapClick((latlng) => gameManager.setTempGuess(latlng));

      // Start the game
      gameManager.startNewGame();
      
    });


    leaderboardButton.addEventListener("click", () => {
        alert("Showing leaderboard...");
    });
}
