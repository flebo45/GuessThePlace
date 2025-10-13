// src/application/controllers/GameManager.js

export class GameManager {
  constructor(gameController, gameMapController, uiController) {
    this.gameController = gameController;
    this.gameMapController = gameMapController;
    this.uiController = uiController;
    this.tempGuess = null;
  }

  setTempGuess(latlng) {
    if (this.gameController.isGameOver()) return;
    
    const roundNumber = this.gameController.getCurrentRound();
    this.tempGuess = new Guess(latlng.lat, latlng.lng, roundNumber);
    this.uiController.setConfirmEnabled(true);
  }

  confirmGuess() {
    if (this.gameController.isGameOver() || !this.tempGuess) return;

    const result = this.gameController.confirmGuess(this.tempGuess);
    const currPhoto = this.gameController.getCurrentPhoto();

    this.gameMapController.setSolutionPosition({ lat: currPhoto.lat, lng: currPhoto.lng });
    this.gameMapController.showLineBetween();

    this.uiController.addRoundScore(this.gameController.getCurrentRound(), result.score, result.distance);

    this.uiController.setConfirmEnabled(false);
    this.uiController.showNextButton(true);
  }

  nextRound() {
    if (!this.gameController.nextRound()) {
      alert(`Gioco finito! Punteggio totale: ${this.gameController.getTotalScore()}`);
      this.uiController.setConfirmEnabled(false);
      this.uiController.showNextButton(false);
      this.tempGuess = null;
      return false;
    }
    this.resetRound();
    return true;
  }

  newGame() {
    this.resetAll();
    this.gameController.startNewGame();
    this.updateUI();
  }

  resetRound() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiController.setConfirmEnabled(false);
    this.uiController.showNextButton(false);
    this.updateUI();
  }

  resetAll() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiController.reset();
    this.uiController.setConfirmEnabled(false);
    this.uiController.showNextButton(false);
  }

  updateUI() {
    if (this.gameController.isGameOver()) return;
    const photo = this.gameController.getCurrentPhoto();
    if (photo) this.uiController.setPhoto(photo.url);
    else this.uiController.setPhoto('');
  }
}
