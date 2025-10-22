export class UIView {
  constructor(root) {
    this.root = root;
  
    this.container = null;
    this.mapContainer = null;
    this.photoElement = null;
    this.confirmButton = null;
    this.nextButton = null;
    this.statusElement = null;

    this.handlers = {};
    this._loaderEl = null;
    this._loaderShownAt = 0;
  }

  renderGameUI() {
    this.root.innerHTML = `
      <div class="play-area">
        <div class="left-panel">
          <div id="status" class="game-status"></div>
          <div class="photo-container">
            <img id="photoElement" alt="Guess the location" class="game-photo hidden" />
          </div>

          <div class="controls">
            <button id="confirmGuessBtn" disabled>Confirm Guess</button>
            <button id="nextRoundBtn" disabled>Next Round</button>
          </div>
        </div>

        <div class="right-panel">
          <div id="map" class="map-panel"></div>
          <div class="scoreboard">
            <h3>Round scores</h3>
            <ul id="scoreList" class="score-list"></ul>
          </div>
        </div>
      </div>
    `;

    this.container = this.root.querySelector(".game-ui-container");
    this.mapContainer = this.root.querySelector("#map");
    this.photoElement = this.root.querySelector("#photoElement");
    this.confirmButton = this.root.querySelector("#confirmGuessBtn");
    this.nextButton = this.root.querySelector("#nextRoundBtn");
    this.scoreListEl = this.root.querySelector("#scoreList");
    this.statusElement = this.root.querySelector("#status");

    this.confirmButton.addEventListener("click", () => {
      this.handlers.onConfirmGuess?.();
    });
    this.nextButton.addEventListener("click", () => {
      this.handlers.onNextRound?.();
    });
  }

  /** Allow controllers to attach logic */
  on(event, callback) {
    this.handlers[event] = callback;
  }


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

  /** Show a JS-managed loader overlay inside the photo container.
   * Ensures a minimum visible time to avoid flicker. Safe to call repeatedly.
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

  setStatus(message) {
    if (this.statusElement) this.statusElement.textContent = message;
  }

  // loader removed: showLoader/hideLoader are intentionally not present

  clearStatus() {
    if (this.statusElement) this.statusElement.textContent = '';
  }

  setConfirmEnabled(enabled) {
    if (this.confirmButton) this.confirmButton.disabled = !enabled;
  }

  showNextButton(enabled) {
    if (this.nextButton) this.nextButton.disabled = !enabled;
  }

  addRoundScore(round, score, distance) {
    if (this.scoreListEl) {
      const li = document.createElement('li');
      li.textContent = `Round ${round}: ${score} points (${distance.toFixed(2)} km)`;
      this.scoreListEl.appendChild(li);
    }
    //this.setStatus(`Round ${round}: ${score} points (${distance.toFixed(2)} km)`);
  }

  showGameOver(totalScore) {
    this.setStatus(`Game over! Total score: ${totalScore}`);
    if (this.nextButton) this.nextButton.disabled = true;
  }

  reset() {
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
