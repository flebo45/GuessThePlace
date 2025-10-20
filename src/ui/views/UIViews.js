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
          <img id="photoElement" alt="Guess the location" class="game-photo" />
        </div>
        
        <div class="controls">
          <button id="confirmGuessBtn" disabled>Confirm Guess</button>
          <button id="nextRoundBtn" style="display:none;">Next Round</button>
        </div>  
      </div>
      <div id="map"></div>
    `;

    this.container = this.root.querySelector(".game-ui-container");
    this.mapContainer = this.root.querySelector("#map");
    this.photoElement = this.root.querySelector("#photoElement");
    this.confirmButton = this.root.querySelector("#confirmGuessBtn");
    this.nextButton = this.root.querySelector("#nextRoundBtn");
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

  // --- Presentation updates ---
  setPhoto(url) {
    if (this.photoElement) this.photoElement.src = url;
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

  showNextButton(visible) {
    if (this.nextButton)
      this.nextButton.style.display = visible ? "inline-block" : "none";
  }

  addRoundScore(round, score, distance) {
    this.setStatus(`Round ${round}: ${score} points (${distance.toFixed(2)} km)`);
  }

  showGameOver(totalScore) {
    this.setStatus(`Game over! Total score: ${totalScore}`);
  }

  reset() {
    if (this.photoElement) this.photoElement.src = "";
    this.clearStatus();
  }

  /** Provide a reference to the map container so controller can init GameMapController */
  getMapContainerId() {
    return "map";
  }
}
