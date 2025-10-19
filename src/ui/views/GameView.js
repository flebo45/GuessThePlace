import { Session } from "../components/Session";

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

            searchResultsDiv.innerHTML = "<ul>" + results.map(user => `<li>${user.getUsername()}</li>`).join("") + "</ul>";
        } catch (error) {
            console.error("Error during user search: ", error);
            searchResultsDiv.innerHTML = `<p class="error">Error searching users: ${error.message}</p>`;
        }
    });

    startGameButton.addEventListener("click", () => {
        alert("Starting new game...");
    });
    leaderboardButton.addEventListener("click", () => {
        alert("Showing leaderboard...");
    });
}
