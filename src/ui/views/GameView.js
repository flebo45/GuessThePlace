// file: GameView.js

import { Session } from "../components/Session";
import { GameManager } from "../../application/controllers/GameManager.js";
import { GameController } from "../../application/controllers/GameController.js";
import { GameMapController } from "../../application/controllers/GameMapController.js";
import { UIView } from "./UIViews.js";
import { UserController } from "../../application/controllers/UserController.js";
import { LeaderboardView } from "./LeaderboardView.js";

export async function gameView(root, router, options = {}) {
    const mode = options.mode || 'home';
    // Ensure only the game body class is active
    document.body.classList.remove("login-register-body");
    document.body.classList.add("body");
        root.innerHTML = `
                    <header class="game-header">
                <div class="title-box"><h2>Guess The Place</h2></div>

                <div class="header-right">
                    <div class="search-wrapper">
                        <div class="menu-section search-bar">
                            <input type="text" id="userSearchInput" placeholder="Search user by username..." class="menu-input" autocomplete="off">
                            <button id="searchButton" class="menu-button">Search</button>
                        </div>
                        <div id="searchResults" class="menu-section search-results"></div>
                    </div>

                    <div id="sessionContainer"></div>
                </div>
                </header>
        <div class="game-menu-container">


            <main class="game-main">
                <div class="hero-viewport">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
               
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    <div class="menu-section hero-actions">
                        <button id="startGameButton" class="hero-btn start">Start new game</button>
                        <button id="leaderboardButton" class="hero-btn score">Scoreboard</button>
                    </div>
                </div>

                <div id="gameContainer" class="hidden"></div>
                <div id="leaderboardContainer" class="hidden"></div>
            </main>
        </div>
        `;


    const sessionContainer = root.querySelector("#sessionContainer");
    Session(sessionContainer);

    const searchInput = root.querySelector("#userSearchInput");
    const searchButton = root.querySelector("#searchButton");
    const startGameButton = root.querySelector("#startGameButton");
    const leaderboardButton = root.querySelector("#leaderboardButton");
    const searchResultsDiv = root.querySelector("#searchResults");
    const gameContainer = root.querySelector("#gameContainer");

    let debounceTimer;
    const userController = UserController;

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

    searchInput.addEventListener("input", () => {
        const prefix = searchInput.value.trim();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(prefix), 300);
    });

    searchButton.addEventListener("click", () => {
        const prefix = searchInput.value.trim();
        performSearch(prefix);
    });

    // Clicking anywhere outside the search area cancels the search and hides results
    document.addEventListener('click', (event) => {
        const clickedInsideSearch = !!event.target.closest('.search-wrapper');
        if (!clickedInsideSearch) {
            // clear input and results
            if (searchInput.value && searchInput.value.trim() !== '') {
                searchInput.value = '';
            }
            if (searchResultsDiv && searchResultsDiv.innerHTML.trim() !== '') {
                searchResultsDiv.innerHTML = '';
            }
        }
    });

    searchResultsDiv.addEventListener("click", async (event) => {
        const userItem = event.target.closest(".search-result-item");
        if (!userItem) return;
        const selectedUserId = userItem.dataset.userId;

        // Render profile inside the searchResults dropdown
        let profileSlot = searchResultsDiv.querySelector('#searchProfile');
        if (!profileSlot) {
            profileSlot = document.createElement('div');
            profileSlot.id = 'searchProfile';
            profileSlot.className = 'search-profile card';
            searchResultsDiv.appendChild(profileSlot);
        }

        profileSlot.innerHTML = '<p>Loading profile...</p>';
        try {
            const { UserView } = await import("../views/UserView.js");
            const userView = new UserView(profileSlot, userController);
            await userView.render(selectedUserId);
            // Ensure the newly rendered profile is visible inside the dropdown
            profileSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            console.error("Error rendering user profile:", err);
            profileSlot.innerHTML = `<div class="error">Error loading user profile.</div>`;
        }
    });

    function startPlay() {                    // come funzione, addEventListener sotto
        gameContainer.classList.remove("hidden");
        const heroActions = root.querySelector('.hero-actions');
        if (heroActions) heroActions.classList.add('hidden');
        const searchBar = root.querySelector('.search-bar');
        if (searchBar) searchBar.classList.add('hidden');

        const uiView = new UIView(gameContainer);
        uiView.renderGameUI();
        const gameController = new GameController();
        const mapController = new GameMapController(uiView.getMapContainerId());
        const gameManager = new GameManager({ gameController, gameMapController: mapController, uiView });

        uiView.on("onConfirmGuess", () => gameManager.confirmGuess());
        uiView.on("onNextRound", () => gameManager.nextRound());
        mapController.onMapClick((latlng) => gameManager.setTempGuess(latlng));
        gameManager.startNewGame();
    }

    async function openScoreboard() {      // come funzione, addEventListener sotto
        const overlay = document.createElement('div');
        overlay.className = 'leaderboard-overlay';

        const panel = document.createElement('div');
        panel.className = 'leaderboard-panel card';

        const header = document.createElement('div');
        header.className = 'leaderboard-header';

        const h3 = document.createElement('h3');
        h3.textContent = 'Leaderboards';
        header.appendChild(h3);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'leaderboard-refresh';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            // return to /game on close if we are on /game/scoreboard
            if (router && window.location.pathname.endsWith('/scoreboard')) {   //aggiunti i due if
                router.navigate('/game', { replace: true });
            }
        });
        header.appendChild(closeBtn);

        panel.appendChild(header);

        const slot = document.createElement('div');
        slot.id = 'leaderboardSlot';
        slot.className = 'leaderboard-slot';
        slot.textContent = 'Loading...';
        panel.appendChild(slot);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        try {
            await LeaderboardView(slot);
        } catch (err) {
            console.error('Error rendering leaderboard view:', err);
            slot.innerHTML = '<div class="error">Unable to load leaderboard.</div>';
        }
    }

    // Wire buttons to routes per collegare le azioni dei bottoni alle rotte e alle funzioni
    startGameButton.addEventListener("click", () => {  
        if (router) {
            router.navigate('/game/play');
        } else {
            startPlay();
        }
    });

    leaderboardButton.addEventListener("click", async () => {
        if (router) {
            router.navigate('/game/scoreboard');
        } else {
            await openScoreboard();
        }
    });

    // Auto-apply mode on initial render
    if (mode === 'play') {
        startPlay();
    } else if (mode === 'scoreboard') {
        await openScoreboard();
    }
}