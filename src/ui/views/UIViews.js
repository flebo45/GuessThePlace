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
  }

  renderGameUI() {
    this.root.innerHTML = `
      <div class="game-ui-container">
        <div id="status" class="game-status"></div>
        <div class="photo-container">
          <img id="photoElement" alt="Guess the location" class="game-photo hidden" />
        </div>
        
        <div class="scoreboard">
          <h3>Round scores</h3>
          <ul id="scoreList" class="score-list"></ul>
        </div>
        
        <div class="controls">
          <button id="confirmGuessBtn" disabled>Confirm Guess</button>
          <button id="nextRoundBtn" disabled>Next Round</button>
        </div>  
      </div>
      <div id="map"></div>
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

  setStatus(message) {
    if (this.statusElement) this.statusElement.textContent = message;
  }

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
  }

  /** Provide a reference to the map container so controller can init GameMapController */
  getMapContainerId() {
    return "map";
  }
}
