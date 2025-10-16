// src/application/controllers/GameManager.js
import { Guess } from '../../domain/entities/Guess.js';

export class GameManager {
  constructor(gameController, gameMapController, uiView) {
    this.gameController = gameController;
    this.gameMapController = gameMapController;
    this.uiView = uiView;
    this.tempGuess = null;
  }

  setTempGuess(latlng) {
    if (this.gameController.isGameOver()) return;
    // Store only the raw lat/lng for the tentative guess. The domain entity
    // `Guess` will be created at confirmation to ensure the correct round
    // number is used. Use the `Guess` entity when the data will be persisted
    // or passed to domain services (scoring/distance); for transient UI state
    // plain {lat,lng} objects are acceptable.
    this.tempGuess = { lat: latlng.lat, lng: latlng.lng };
  this.uiView.setConfirmEnabled(true);
  }

  confirmGuess() {
  if (this.gameController.isGameOver() || !this.tempGuess) return;

  // Create a domain Guess entity now that the user confirmed their pick.
  const roundNumber = this.gameController.getCurrentRound();
  const guessEntity = new Guess(this.tempGuess.lat, this.tempGuess.lng, roundNumber);
  const result = this.gameController.confirmGuess(guessEntity);
    const currPhoto = this.gameController.getCurrentPhoto();

    this.gameMapController.setSolutionPosition({ lat: currPhoto.lat, lng: currPhoto.lng });
    this.gameMapController.showLineBetween();

  this.uiView.addRoundScore(this.gameController.getCurrentRound(), result.score, result.distance);

  this.uiView.setConfirmEnabled(false);
  this.uiView.showNextButton(true);
    // Clear the tentative raw guess after confirmation
    this.tempGuess = null;
  }

  nextRound() {
    if (!this.gameController.nextRound()) {
      // Delegate presentation to the view; the view is responsible for how
      // the game-over is shown (alert/modal/overlay).
      this.uiView.showGameOver(this.gameController.getTotalScore());
      this.uiView.setConfirmEnabled(false);
      this.uiView.showNextButton(false);
      this.tempGuess = null;
      return false;
    }
    this.resetRound();
    return true;
  }

  async newGame() {
    this.resetAll();
    // mostra notifica di caricamento foto e attendi il fetch
    this.uiView.setStatus('Recupero foto... potrebbe volerci qualche istante.');
    try {
      // attendi che il controller completi il fetch delle foto
      await this.gameController.startNewGame();
      // foto caricate: mostra prima foto e aggiorna UI
      this.uiView.setStatus('Foto caricate. Inizio partita.');
      this.updateUI();
    } catch (err) {
      console.error('Errore startNewGame:', err);
      this.uiView.setStatus('Errore nel recupero delle foto. Riprova.');
    } finally {
      // rimuovi messaggio dopo breve tempo
      setTimeout(() => this.uiView.clearStatus(), 3000);
    }
  }

  resetRound() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
    this.updateUI();
  }

  resetAll() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiView.reset();
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
  }

  updateUI() {
    if (this.gameController.isGameOver()) return;
    const photo = this.gameController.getCurrentPhoto();
    if (photo) this.uiView.setPhoto(photo.url);
    else this.uiView.setPhoto('');
  }
}
