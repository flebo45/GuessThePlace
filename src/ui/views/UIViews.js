/**
 * UIView class responsible for rendering and managing the game UI.
 */
export class UIView {
  constructor(root) {
    this.root = root;
  
    this.container = null;
    this.mapContainer = null;
    this.photoElement = null;
    this.confirmButton = null;
    this.nextButton = null;
    this.statusElement = null;
    this.playArea = null;

    this.handlers = {};
    this._loaderEl = null;
    this._loaderShownAt = 0;
    this._scrollTimerId = null;
  }

  /**
   * Renders the game UI structure inside the root element.
   */
  renderGameUI() {
    this.root.innerHTML = `
      <div class="play-area grid-layout">
        <div id="gameMessage" class="top-message hidden"></div>
        <div class="top-left">
          <div id="status" class="game-status"></div>
          <div class="photo-container">
            <img id="photoElement" alt="Guess the location" class="game-photo hidden" />
          </div>

          <div class="controls">
            <button id="confirmGuessBtn" class="btn" disabled>Confirm Guess</button>
            <button id="nextRoundBtn" class="btn" disabled>Next Round</button>
          </div>
        </div>

        <div class="top-right">
          <div class="scoreboard">
            <h3>Round scores</h3>
            <ul id="scoreList" class="score-list"></ul>
          </div>
        </div>

        <div class="map-row">
          <div id="map" class="map-panel"></div>
        </div>
      </div>
    `;

    this.container = this.root.querySelector(".game-ui-container");
  this.playArea = this.root.querySelector('.play-area');
  this.mapContainer = this.root.querySelector("#map");
    this.photoElement = this.root.querySelector("#photoElement");
    this.confirmButton = this.root.querySelector("#confirmGuessBtn");
    this.nextButton = this.root.querySelector("#nextRoundBtn");
  this.scoreListEl = this.root.querySelector("#scoreList");
  this.statusElement = this.root.querySelector("#status");
  this.gameMessageEl = this.root.querySelector('#gameMessage');

    this.confirmButton.addEventListener("click", () => {
      this.handlers.onConfirmGuess?.();
    });
    this.nextButton.addEventListener("click", () => {
      this.handlers.onNextRound?.();
    });
  }

  /**
   * Registers event handlers for UI interactions.
   * @param {string} event - The event name.
   * @param {Function} callback - The callback function to handle the event.
   */
  on(event, callback) {
    this.handlers[event] = callback;
  }


  /**
   * Sets the photo URL to display in the game UI.
   * @param {string} url - The URL of the photo to display.
   */
  setPhoto(url) {
    if (!this.photoElement) return;
    if (url) {
      this.photoElement.src = url;
      this.photoElement.classList.remove("hidden");
    } else {
      this.photoElement.classList.add("hidden");
      this.photoElement.removeAttribute('src');
    }
  }

  /**
   * Shows a loading spinner over the photo area.
   * @param {Object} options - Options for showing the loader.
   * @param {number} options.minMs - Minimum time in milliseconds to show the loader.
   */
  showLoader({ minMs = 250 } = {}) {
    try {
      const container = this.root.querySelector('.photo-container');
      if (!container) return;
      if (this._loaderEl) return; // already shown

      const el = document.createElement('div');
      el.className = 'js-loader';
      el.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
      container.appendChild(el);
      this._loaderEl = el;
      this._loaderShownAt = Date.now();
      this._loaderMinMs = Number(minMs) || 250;
    } catch (e) {
      console.warn('showLoader failed', e);
    }
  }

  /**
   * Hides the loading spinner.
   */
  hideLoader() {
    try {
      if (!this._loaderEl) return;
      const elapsed = Date.now() - (this._loaderShownAt || 0);
      const remaining = Math.max(0, (this._loaderMinMs || 0) - elapsed);
      const remove = () => {
        try {
          if (this._loaderEl && this._loaderEl.parentNode) this._loaderEl.parentNode.removeChild(this._loaderEl);
        } catch (err) { /* ignore */ }
        this._loaderEl = null;
        this._loaderShownAt = 0;
        this._loaderMinMs = 0;
      };
      if (remaining > 0) setTimeout(remove, remaining);
      else remove();
    } catch (e) {
      console.warn('hideLoader failed', e);
    }
  }

  /**
   * Sets the status message in the UI.
   * @param {string} message - The status message to display.
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
   * @param {boolean} enabled - Whether the button should be enabled.
   */
  setConfirmEnabled(enabled) {
    if (this.confirmButton) this.confirmButton.disabled = !enabled;
  }

  /**
   * Shows or hides the next button.
   * @param {boolean} enabled - Whether the button should be shown.
   */
  showNextButton(enabled) {
    if (this.nextButton) this.nextButton.disabled = !enabled;
  }

  /**   * Adds a round score entry to the scoreboard.
   * @param {number} round - The round number.
   * @param {number} score - The score for the round.
   * @param {number} distance - The distance in kilometers.
   */
  addRoundScore(round, score, distance) {
    if (this.scoreListEl) {
      const li = document.createElement('li');
      li.textContent = `Round ${round}: ${score} points (${distance.toFixed(2)} km)`;
      this.scoreListEl.appendChild(li);
    }
    //this.setStatus(`Round ${round}: ${score} points (${distance.toFixed(2)} km)`);
  }

  /**
   * Scrolls the window to the top after a delay.
   */
 scrollToTop() {
    // Definisci il tempo di attesa in millisecondi (es: 500ms = mezzo secondo)
    const delayInMilliseconds = 4000; 

    setTimeout(() => {
        // Questo codice verrà eseguito DOPO che il ritardo è passato
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Rende lo scroll graduale
        });
    }, delayInMilliseconds); // Passa il ritardo qui
}

  /**
   * Displays the game over message with the total score.
   * @param {number} totalScore - The total score achieved in the game.
   */
  showGameOver(totalScore) {
    this.scrollToTop();
    // Show message below the two buttons, above photo and scoreboard
    if (this.gameMessageEl) {
      this.gameMessageEl.textContent = `Game over! Total score: ${totalScore}`;
      this.gameMessageEl.classList.remove('hidden');
      try { this.gameMessageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (_) {}
    }
    if (this.nextButton) this.nextButton.disabled = true;
    // Keep play area visible so message remains in view
  }

  /** Resets the UI to the initial state for a new game. */
  reset() {
    if (this.playArea) this.playArea.classList.remove("hidden");

    if (this.photoElement) {
      this.photoElement.classList.add("hidden");
      this.photoElement.removeAttribute('src');
    }
    if (this.nextButton) this.nextButton.disabled = true;
    //if (this.scoreListEl) this.scoreListEl.innerHTML = '';
    this.clearStatus();
    // ensure loader removed when resetting UI
    this.hideLoader?.();
  }

  /** Provide a reference to the map container so controller can init GameMapController */
  getMapContainerId() {
    return "map";
  }
}
