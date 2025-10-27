/**
 * UIView class responsible for rendering and managing the game UI using Bootstrap.
 */
export class UIView {
  constructor(root) {
    this.root = root;

    // Riferimenti agli elementi DOM verranno impostati in renderGameUI
    this.container = null;
    this.mapContainer = null;
    this.photoElement = null;
    this.confirmButton = null;
    this.nextButton = null;
    this.statusElement = null;
    this.playArea = null;
    this.scoreListEl = null;
    this.gameMessageEl = null;
    this.photoContainer = null; // Aggiunto riferimento al contenitore della foto

    this.handlers = {};
    this._loaderEl = null;
    this._loaderShownAt = 0;
    this._loaderMinMs = 250; // Valore di default
  }

  /**
   * Renders the game UI structure inside the root element using Bootstrap grid.
   */
  renderGameUI() {
    this.root.innerHTML = `
      <div class="container-fluid play-area mt-3">
        <div id="gameMessage" class="col-12 mb-3 top-message d-none text-center"></div>

        <div class="row g-3 mb-3"> 
            <div class="col-lg-7">
                 <div id="status" class="game-status mb-2 text-center" style="color: var(--text);"></div>
                <div class="photo-container mb-3 position-relative shadow" style="aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden; background-color: var(--card);">
                    <img id="photoElement" alt="Guess the location" class="game-photo d-none w-100 h-100" style="object-fit: cover; border-radius: 10px;" />
                </div>
                <div class="controls text-center text-lg-start">
                    <button id="confirmGuessBtn" class="btn btn-primary me-2" disabled>
                        <i class="bi bi-check-circle-fill me-1"></i>Confirm Guess
                    </button>
                    <button id="nextRoundBtn" class="btn btn-secondary" disabled>
                        <i class="bi bi-arrow-right-circle-fill me-1"></i>Next Round
                    </button>
                </div>
            </div>

            <div class="col-lg-5">
                <div class="scoreboard card h-100 shadow" style="background-color: var(--card); color: var(--text);">
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title text-center mb-3">Round scores</h3>
                        <ul id="scoreList" class="score-list list-unstyled flex-grow-1 overflow-auto mb-0">
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 map-row">
                <div id="map" class="map-panel w-100 shadow" style="height: min(60vh, 620px); min-height: 400px; border-radius: 10px; overflow: hidden;"></div>
            </div>
        </div>
      </div>
    `;

    // Seleziona gli elementi dopo averli creati
    this.playArea = this.root.querySelector('.play-area');
    this.mapContainer = this.root.querySelector("#map");
    this.photoContainer = this.root.querySelector(".photo-container"); // Salva riferimento
    this.photoElement = this.root.querySelector("#photoElement");
    this.confirmButton = this.root.querySelector("#confirmGuessBtn");
    this.nextButton = this.root.querySelector("#nextRoundBtn");
    this.scoreListEl = this.root.querySelector("#scoreList");
    this.statusElement = this.root.querySelector("#status");
    this.gameMessageEl = this.root.querySelector('#gameMessage');

    // Aggiungi listener ai bottoni
    this.confirmButton.addEventListener("click", () => {
      this.handlers.onConfirmGuess?.();
    });
    this.nextButton.addEventListener("click", () => {
      this.handlers.onNextRound?.();
    });
  }

  /**
   * Registers event handlers for UI interactions.
   */
  on(event, callback) {
    this.handlers[event] = callback;
  }

  /**
   * Sets the photo URL to display. Uses d-none for hiding.
   */
  setPhoto(url) {
    if (!this.photoElement) return;
    if (url) {
      this.photoElement.src = url;
      this.photoElement.classList.remove("d-none");
    } else {
      this.photoElement.classList.add("d-none");
      this.photoElement.removeAttribute('src');
    }
  }

  /**
   * Shows a loading spinner (Bootstrap spinner) over the photo area.
   */
  showLoader({ minMs = 250 } = {}) {
      if (!this.photoContainer) return; // Usa il riferimento salvato
      if (this._loaderEl) return; // Già mostrato

      const el = document.createElement('div');
      el.className = 'js-loader'; // Mantieni la classe per la gestione JS
      el.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>'; // Spinner Bootstrap
      this.photoContainer.appendChild(el);
      this._loaderEl = el;
      this._loaderShownAt = Date.now();
      this._loaderMinMs = Number(minMs) || 250;
  }

  /**
   * Hides the loading spinner.
   */
  hideLoader() {
      if (!this._loaderEl) return;
      const elapsed = Date.now() - (this._loaderShownAt || 0);
      const remaining = Math.max(0, (this._loaderMinMs || 0) - elapsed);
      const remove = () => {
          try {
              if (this._loaderEl && this._loaderEl.parentNode) {
                  this._loaderEl.parentNode.removeChild(this._loaderEl);
              }
          } catch (err) { /* ignore */ }
          this._loaderEl = null;
          this._loaderShownAt = 0;
          this._loaderMinMs = 0;
      };
      if (remaining > 0) {
          setTimeout(remove, remaining);
      } else {
          remove();
      }
  }


  /**
   * Sets the status message in the UI.
   */
  setStatus(message) {
    if (this.statusElement) this.statusElement.textContent = message;
  }

  /**
   * Clears the status message in the UI.
   */
  clearStatus() {
    if (this.statusElement) this.statusElement.textContent = '';
  }

  /**
   * Enables or disables the confirm button.
   */
  setConfirmEnabled(enabled) {
    if (this.confirmButton) this.confirmButton.disabled = !enabled;
  }

  /**
   * Enables or disables the next button (cambiato da show a enable/disable).
   */
  showNextButton(enabled) {
    if (this.nextButton) this.nextButton.disabled = !enabled;
  }

  /**
   * Adds a round score entry to the scoreboard.
   */
  addRoundScore(round, score, distance) {
    if (this.scoreListEl) {
      const li = document.createElement('li');
      // Aggiungi classi Bootstrap o mantieni stile custom se preferito
      li.className = 'd-flex justify-content-between align-items-center py-1';
      li.innerHTML = `
        <span>Round ${round}: <strong class="text-primary">${score} pts</strong></span>
        <small class="text-muted">(${distance.toFixed(1)} km)</small>
      `;
      this.scoreListEl.appendChild(li);
       // Scrolla all'ultimo punteggio aggiunto
       this.scoreListEl.scrollTop = this.scoreListEl.scrollHeight;
    }
  }

   /**
   * Scrolls the window to the top smoothly.
   */
  scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }

  /**
   * Displays the game over message with the total score. Uses d-none.
   */
  showGameOver(totalScore) {
      this.scrollToTop(); // Scrolla in cima alla pagina
      if (this.gameMessageEl) {
          this.gameMessageEl.textContent = `Game over! Final score: ${totalScore}`;
          this.gameMessageEl.classList.remove('d-none');
          this.gameMessageEl.classList.add('game-over'); // Aggiungi classe per animazione
          try {
              // Scrolla al messaggio di game over se necessario
              // this.gameMessageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (_) {}
      }
      if (this.nextButton) this.nextButton.disabled = true;
      if (this.confirmButton) this.confirmButton.disabled = true; // Disabilita anche conferma

      // Potresti voler mostrare di nuovo i bottoni hero dopo un ritardo
      // setTimeout(() => {
      //     const heroActions = document.querySelector('.hero-viewport'); // Cerca fuori da this.root
      //     if (heroActions) heroActions.classList.remove('d-none');
      // }, 3000); // Esempio: dopo 3 secondi
  }


  /** Resets the UI to the initial state for a new game. Uses d-none. */
  reset() {
      if (this.playArea) this.playArea.classList.remove("d-none");

      if (this.photoElement) {
          this.photoElement.classList.add("d-none");
          this.photoElement.removeAttribute('src');
      }
      if (this.nextButton) this.nextButton.disabled = true;
      if (this.confirmButton) this.confirmButton.disabled = true; // Assicurati sia disabilitato
      if (this.scoreListEl) this.scoreListEl.innerHTML = ''; // Pulisci punteggi
      if (this.gameMessageEl) { // Nascondi messaggio game over
          this.gameMessageEl.classList.add('d-none');
          this.gameMessageEl.classList.remove('game-over');
          this.gameMessageEl.textContent = '';
      }
      this.clearStatus();
      this.hideLoader(); // Assicura rimozione loader
  }


  /** Provide the ID of the map container. */
  getMapContainerId() {
    return "map"; // L'ID è definito nell'HTML generato
  }
}