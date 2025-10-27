import { Session } from "../components/Session";
import { GameManager } from "../../application/controllers/GameManager.js";
import { GameController } from "../../application/controllers/GameController.js";
import { GameMapController } from "../../application/controllers/GameMapController.js";
import { UIView } from "./UIViews.js";
import { UserController } from "../../application/controllers/UserController.js";
import { LeaderboardView } from "./LeaderboardView.js";
// Assicurati che bootstrap sia disponibile globalmente o importa l'oggetto Modal se necessario
// import { Modal } from 'bootstrap'; // Esempio se usi npm

/**
 * Renders the main game view using Bootstrap layout and components.
 * Handles routing when the leaderboard modal is closed and ensures backdrop removal.
 */
export async function gameView(root, router, options = {}) {
    const mode = options.mode || 'home';
    // Ensure correct body class
    document.body.className = 'body d-flex flex-column min-vh-100'; // Usa flex per layout

    root.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color: var(--card);">
      <div class="container-fluid">
        <a class="navbar-brand" href="/game">Guess The Place</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavGame" aria-controls="navbarNavGame" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNavGame">
            <div class="navbar-nav align-items-center">
                 <div class="nav-item dropdown me-3 search-wrapper">
                    <input type="text" id="userSearchInput" class="form-control form-control-sm dropdown-toggle" placeholder="Search user..."
                           autocomplete="off" data-bs-toggle="dropdown" aria-expanded="false">
                    <ul id="searchResults" class="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="userSearchInput">
                         <li><p class="dropdown-header px-3 pt-1 pb-0">Start typing to search...</p></li>
                    </ul>
                 </div>
                 <div class="nav-item">
                    <div id="sessionContainer"></div>
                 </div>
            </div>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-5 pt-3 flex-grow-1">
        <main class="game-main h-100">
            <div class="hero-viewport text-center my-5 py-5 ${mode !== 'home' ? 'd-none' : ''}">
                <div class="hero-actions">
                    <button id="startGameButton" class="btn btn-success btn-lg mx-2">
                        <i class="bi bi-play-circle-fill me-2"></i>Start new game
                    </button>
                    <button id="leaderboardButton" class="btn btn-warning btn-lg mx-2" data-bs-toggle="modal" data-bs-target="#leaderboardModal">
                        <i class="bi bi-trophy-fill me-2"></i>Scoreboard
                    </button>
                </div>
            </div>

            <div id="gameContainer" class="${mode !== 'play' ? 'd-none' : ''}"></div>
        </main>
    </div>
    `; // Chiusura div container-fluid e main

    // Initialize Session Component
    const sessionContainer = root.querySelector("#sessionContainer");
    Session(sessionContainer); // Session ora gestisce il modal amici

    // --- Inizio Logica di Ricerca (Invariata come prima) ---
    const searchInput = root.querySelector("#userSearchInput");
    const searchResultsDiv = root.querySelector("#searchResults");
    let debounceTimer;
    const userController = UserController; // Assicurati sia importato

    function renderResults(users) {
        if (!users || users.length === 0) {
            searchResultsDiv.innerHTML = '<li><p class="dropdown-item text-muted disabled">No users found.</p></li>';
            return;
        }
        searchResultsDiv.innerHTML = ""; // Clear previous results or placeholder
        users.forEach((user) => {
            const id = user.getId ? user.getId() : user.id;
            const username = user.getUsername ? user.getUsername() : user.username;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = "dropdown-item search-result-item";
            a.href = "#"; // Prevent page reload
            a.dataset.userId = id;
            a.dataset.username = username;
            a.textContent = username;
            li.appendChild(a);
            searchResultsDiv.appendChild(li);
        });
    }

    async function performSearch(prefix) {
        if (!prefix || prefix.length < 1) { // Riduci soglia per iniziare ricerca
            searchResultsDiv.innerHTML = '<li><p class="dropdown-header px-3 pt-1 pb-0">Start typing to search...</p></li>';
            return;
        }
        searchResultsDiv.innerHTML = '<li><p class="dropdown-item text-muted disabled">Searching...</p></li>';
        try {
            const results = await userController.searchPrefix(prefix, 10);
            renderResults(results);
        } catch (error) {
            console.error("Error during user search:", error);
            searchResultsDiv.innerHTML = `<li><p class="dropdown-item text-danger disabled">Error: ${error.message}</p></li>`;
        }
    }

     searchInput.addEventListener("input", () => {
        const prefix = searchInput.value.trim();
        clearTimeout(debounceTimer);
        var dropdown = bootstrap.Dropdown.getInstance(searchInput) || new bootstrap.Dropdown(searchInput);
        dropdown.show();
        debounceTimer = setTimeout(() => performSearch(prefix), 300);
    });

    searchResultsDiv.addEventListener("click", async (event) => {
        event.preventDefault();
        const userItem = event.target.closest(".search-result-item");
        if (!userItem) return;
        
        event.stopPropagation();

        const selectedUserId = userItem.dataset.userId;
        let profileSlot = searchResultsDiv.querySelector('.search-profile-slot');
        if (!profileSlot) {
            const divider = document.createElement('li');
            divider.innerHTML = '<hr class="dropdown-divider">';
            searchResultsDiv.appendChild(divider);
            profileSlot = document.createElement('li');
            profileSlot.className = 'search-profile-slot p-2';
            searchResultsDiv.appendChild(profileSlot);
        }
        profileSlot.innerHTML = '<div class="text-center text-muted">Loading profile...</div>';
        try {
            const { UserView } = await import("./UserView.js");
            const userView = new UserView(profileSlot, userController);
            await userView.render(selectedUserId);
        } catch (err) {
            console.error("Error rendering user profile:", err);
            profileSlot.innerHTML = `<div class="alert alert-danger alert-sm m-0">Error loading profile.</div>`;
        }
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        const clickedInsideSearch = event.target.closest('.search-wrapper');
        const isSearchInput = event.target === searchInput;
        if (!clickedInsideSearch && !isSearchInput) {
            var dropdown = bootstrap.Dropdown.getInstance(searchInput);
            if (dropdown && searchResultsDiv.classList.contains('show')) {
                dropdown.hide();
                searchResultsDiv.innerHTML = '<li><p class="dropdown-header px-3 pt-1 pb-0">Start typing to search...</p></li>';
            }
        }
    });
    // --- Fine Logica di Ricerca ---

    // --- Inizio Logica di Gioco e Scoreboard ---
    const startGameButton = root.querySelector("#startGameButton");
    const leaderboardButton = root.querySelector("#leaderboardButton"); // Bottone che triggera il modal
    const gameContainer = root.querySelector("#gameContainer");
    const heroActionsDiv = root.querySelector('.hero-viewport');

    function startPlay() {
        gameContainer.classList.remove("d-none");
        heroActionsDiv.classList.add('d-none');
        const uiView = new UIView(gameContainer);
        uiView.renderGameUI();
        const gameController = new GameController();
        const mapController = new GameMapController(uiView.getMapContainerId());
        const gameManager = new GameManager({ gameController, gameMapController: mapController, uiView });
        uiView.on("onConfirmGuess", () => gameManager.confirmGuess());
        uiView.on("onNextRound", () => gameManager.nextRound());
        mapController.onMapClick((latlng) => gameManager.setTempGuess(latlng));
        gameManager.startNewGame();
        setTimeout(() => mapController.invalidateSize(), 100);
        window.addEventListener('resize', () => mapController.invalidateSize());
    }

    async function loadScoreboardData() {
        const modalElement = document.getElementById('leaderboardModal');
        if (!modalElement) return; // Se il modal non è nel DOM, esci
        const modalBody = modalElement.querySelector('#leaderboardModalBody');
        const modalFooter = modalElement.querySelector('.modal-footer');

        modalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

        const oldRefreshBtn = modalFooter.querySelector('#leaderboardRefreshBtn');
        if (oldRefreshBtn) {
            modalFooter.removeChild(oldRefreshBtn);
        }

        try {
            await LeaderboardView(modalBody, modalFooter);
        } catch (err) {
            console.error('Error rendering leaderboard view:', err);
            modalBody.innerHTML = '<div class="alert alert-danger">Unable to load leaderboard.</div>';
        }
    }

    // Aggiungi il listener per l'evento 'hidden.bs.modal' UNA SOLA VOLTA
    const leaderboardModalElement = document.getElementById('leaderboardModal');
    if (leaderboardModalElement && !leaderboardModalElement.dataset.listenerAttached) {
        leaderboardModalElement.addEventListener('hidden.bs.modal', () => {
            // console.log("Modal hidden, current path:", window.location.pathname); // Debug
            if (router && window.location.pathname === '/game/scoreboard') {
                // console.log("Navigating back to /game"); // Debug
                router.navigate('/game', { replace: true });
            }
            // *** NUOVA PARTE: Rimuovi manualmente il backdrop se ancora presente ***
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                // console.log("Removing lingering backdrop"); // Debug
                backdrop.parentNode.removeChild(backdrop);
                // Potrebbe essere necessario ripristinare lo scroll sul body se bloccato
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                 document.body.classList.remove('modal-open');
            }
             // *** FINE NUOVA PARTE ***
        });
        leaderboardModalElement.dataset.listenerAttached = 'true';
    }

    // Button listeners
    startGameButton.addEventListener("click", () => {
        if (router) {
            router.navigate('/game/play');
        } else {
            startPlay();
        }
    });

    leaderboardButton.addEventListener("click", async () => {
        if (router && window.location.pathname !== '/game/scoreboard') {
            router.navigate('/game/scoreboard');
        }
        // Il caricamento dati ora avviene SOLO quando il modal sta per essere mostrato
        // await loadScoreboardData(); // Rimosso da qui
    });

     // NUOVO: Listener per caricare i dati quando il modal sta per essere mostrato
     if (leaderboardModalElement) {
        leaderboardModalElement.addEventListener('show.bs.modal', async () => {
            await loadScoreboardData();
        });
     }


    // Auto-apply mode on initial render
    if (mode === 'play') {
        startPlay();
    } else if (mode === 'scoreboard') {
        const modalElement = document.getElementById('leaderboardModal');
        if (modalElement) {
             // Inizializza e mostra il modal se non è già gestito da show.bs.modal
             const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
             if (!modalElement.classList.contains('show')) {
                 modal.show();
                 // loadScoreboardData verrà chiamato dall'evento 'show.bs.modal'
             } else {
                // Se è già show (magari da un refresh pagina), carica i dati
                 await loadScoreboardData();
             }
        }
    }
    // --- Fine Logica di Gioco e Scoreboard ---
}