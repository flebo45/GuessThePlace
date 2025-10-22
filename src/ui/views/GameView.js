import { Session } from "../components/Session";
import { GameManager } from "../../application/controllers/GameManager.js";
import { GameController } from "../../application/controllers/GameController.js";
import { GameMapController } from "../../application/controllers/GameMapController.js";
import { UIView } from "./UIViews.js";
import { UserController } from "../../application/controllers/UserController.js";
import { LeaderboardView } from "./LeaderboardView.js";

export async function gameView(root) {
    root.innerHTML = `
    <div class="game-menu-container">
      <header class="game-header">
        <h2>Guess The Place</h2>
        <div id="sessionContainer"></div>
      </header>

      <main class="game-main">
        <div class="hero-viewport">
          <div class="menu-section search-bar">
          <input 
            type="text" 
            id="userSearchInput" 
            placeholder="🔍 Search user by username..." 
            class="menu-input"
          />
          <button id="searchButton" class="menu-button">Search</button>
          </div>

          <div class="menu-section hero-actions">
            <button id="startGameButton" class="hero-btn start">Start new game</button>
            <button id="leaderboardButton" class="hero-btn score">Scoreboard</button>
          </div>
        </div>

        <div id="searchResults" class="menu-section search-results"></div>
        <div id="gameContainer" class="hidden"></div>
        <div id="leaderboardContainer" class="hidden"></div>
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

    const userController = UserController;

      // Helper: clear and render results
    function renderResults(users) {
      if (!users || users.length === 0) {
        searchResultsDiv.innerHTML = "<p>No users found.</p>";
        return;
      }

      searchResultsDiv.innerHTML = "";
      users.forEach((user) => {
        const id = user.getId ? user.getId() : user.id;
        const username = user.getUsername ? user.getUsername() : user.username;
        const userDiv = document.createElement("div");
        userDiv.className = "search-result-item";
        userDiv.dataset.userId = id;
        userDiv.dataset.username = username;

        const nameBox = document.createElement('div');
        nameBox.className = 'user-name-box';
        nameBox.textContent = username;

        userDiv.appendChild(nameBox);
        searchResultsDiv.appendChild(userDiv);
      });
    }

      // --- SEARCH LOGIC ---
    async function performSearch(prefix) {
      if (!prefix) {
        searchResultsDiv.innerHTML = "<p>Please enter a username prefix to search.</p>";
        return;
      }

      searchResultsDiv.innerHTML = "<p>Searching...</p>";

      try {
        const { SearchUser } = await import("../../application/usecases/SearchUser.js");
        const results = await SearchUser.byUsernamePrefix(prefix, 10);
        renderResults(results);
      } catch (error) {
        console.error("Error during user search:", error);
        searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
      }
    }

    // --- DEBOUNCED INPUT SEARCH ---
    searchInput.addEventListener("input", () => {
      const prefix = searchInput.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => performSearch(prefix), 300);
    });

    // --- BUTTON SEARCH ---
    searchButton.addEventListener("click", () => {
      const prefix = searchInput.value.trim();
      performSearch(prefix);
    });

    // --- RESULT CLICK HANDLER ---
    searchResultsDiv.addEventListener("click", async (event) => {
      const userItem = event.target.closest(".search-result-item");
      if (!userItem) return;

      const selectedUserId = userItem.dataset.userId;
      const selectedUsername = userItem.dataset.username;
      console.log(`User selected: ${selectedUsername} (id=${selectedUserId})`);

      // Show user profile in gameContainer
      gameContainer.classList.remove("hidden");
      gameContainer.innerHTML = "<p>Loading profile...</p>";

      try {
        const { UserView } = await import("../views/UserView.js");
        const userView = new UserView(gameContainer, userController);
        await userView.render(selectedUserId);
      } catch (err) {
        console.error("Error rendering user profile:", err);
        gameContainer.innerHTML = `<div class="error">Error loading user profile.</div>`;
      }
    });

    // searchInput.addEventListener("input", () => {
    //   const prefix = searchInput.value.trim();
    //   clearTimeout(debounceTimer);
    //   debounceTimer = setTimeout(async () => {
    //     if (prefix.length < 3) {
    //         searchResultsDiv.innerHTML = "";
    //         return;
    //     }
      
    //     try {
    //         const { SearchUser } = await import("../../application/usecases/SearchUser.js");
    //         const results = await SearchUser.byUsernamePrefix(prefix, 10);

    //         searchResultsDiv.innerHTML = results.length
    //           ? results.map(user => `<div class="search-result-item">${user.getUsername()}</div>`).join("")
    //           : "<p>No users found.</p>";
    //     } catch (error) {
    //         console.error("Error during user search: ", error);
    //         searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
    //     }
    //   }, 300); // Debounce delay of 300ms
    // });


    // searchButton.addEventListener("click", async () => {
    //     const prefix = searchInput.value.trim();
    //     if (!prefix) {
    //         searchResultsDiv.innerHTML = "<p>Please enter a username prefix to search.</p>";
    //         return;
    //     }

    //     searchResultsDiv.innerHTML = "<p>Searching...</p>";

    //     try {
    //         const { SearchUser } = await import("../../application/usecases/SearchUser.js");
    //         const results = await SearchUser.byUsernamePrefix(prefix);

    //         if (results.length === 0) {
    //             searchResultsDiv.innerHTML = "<p>No users found.</p>";
    //             return;
    //         }

    //         searchResultsDiv.innerHTML = results.length
    //           ? results.map(user => `<div class="search-result-item">${user.getUsername()}</div>`).join("")
    //           : "<p>No users found.</p>";
    //     } catch (error) {
    //         console.error("Error during user search: ", error);
    //         searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
    //     }
    // });

    // searchResultsDiv.addEventListener("click", (event) => {
    //   const userItem = event.target.closest(".search-result-item");
    //   if (userItem) {
    //       console.log(`User selected: ${userItem.textContent}`);
    //   }
    // });

    startGameButton.addEventListener("click", () => {
      gameContainer.classList.remove("hidden");
      // Hide the hero actions and search bar once the game starts
      const heroActions = root.querySelector('.hero-actions');
      if (heroActions) heroActions.classList.add('hidden');
      const searchBar = root.querySelector('.search-bar');
      if (searchBar) searchBar.classList.add('hidden');
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


  leaderboardButton.addEventListener("click", async () => {
    // Create overlay (modal) similar to Friends panel
    const overlay = document.createElement('div');
    overlay.className = 'leaderboard-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '4000';

    const panel = document.createElement('div');
    panel.className = 'leaderboard-panel card';
    panel.style.width = '760px';
    panel.style.maxHeight = '85vh';
    panel.style.overflowY = 'auto';
    panel.style.padding = '18px';

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h3>Leaderboards</h3>
        <button id="closeLeaderboard" class="btn secondary">Close</button>
      </div>
      <div id="leaderboardSlot" style="margin-top:12px">Loading...</div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.querySelector('#closeLeaderboard').addEventListener('click', () => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });

    try {
      const slot = panel.querySelector('#leaderboardSlot');
      // Use the existing LeaderboardView to populate the slot
      await LeaderboardView(slot);
    } catch (err) {
      console.error('Error rendering leaderboard view:', err);
      const slot = panel.querySelector('#leaderboardSlot');
      if (slot) slot.innerHTML = '<div class="error">Unable to load leaderboard.</div>';
    }
  });
}
