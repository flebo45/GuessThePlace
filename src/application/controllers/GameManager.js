import { SaveGame } from '../usecases/SaveGame.js';
import { appState } from '../state/AppState.js';
import { latLng } from 'leaflet';

export class GameManager {
  constructor( { gameController, gameMapController , uiView }) {
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

  async startNewGame() {
    this._resetAllUI();
    // Show loadig notify
    this.uiView.setStatus('Recupero foto... potrebbe volerci qualche istante.');
    try {
      // wait for photos fetch
      await this.gameController.startNewGame();
  
      this._updatePhotoUI();
      this.uiView.setStatus('Foto caricate. Inizio partita.');

      // // Check for resize from leafleat
      // setTimeout(() => {
      //   this.gameMapController.invalidateSize();
      //   console.log("Map size invalidated."); // Log 
      // }, 100); // 100ms è un ritardo di sicurezza
    } catch (err) {
      console.error('Errore startNewGame:', err);
      this.uiView.setStatus('Errore nel recupero delle foto. Riprova.');
    } finally {
      // Remove message
      setTimeout(() => this.uiView.clearStatus(), 2000);
    }
  }

  handleMapClick(latlng) {
    if (this.gameController.isGameOver()) return;
    this.tempGuess = { lat: latLng.lat, lng: latLng.lng};
    this.uiView.setConfirmEnabled(true); 
  } 

  confirmGuess() {
    if (!this.tempGuess || this.gameController.isGameOver()) return;

    const result = this.gameController.confirmGuess(this.tempGuess);
    const currentPhoto = this.gameController.getCurrentPhoto();

    this.gameMapController.showSolution(currentPhoto);
    this.gameMapController.showLineBetween();

    this.uiView.addRoundScore(
      this.gameController.getCurrentRound(),
      result.score,
      result.distance
    );

    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(true);

    this.tempGuess = null;
  }

  async nextRound() {
    const hasNext = this.gameController.nextRound();
    if (!hasNext) return await this._endGame();

    this._resetRoundUI();
    this._updatePhotoUI();
  }

  async _endGame() {
    const totalScore = this.gameController.getTotalScore();
    const user = appState.user;

    if (user) {
      try {
        await SaveGame.execute(user.id, totalScore);
      }catch (err) {
        console.log("Errore salvataggio partita:", err);
      }
    }

    this.uiView.showGameOver(totalScore);
    this._resetAllUI();
  }

  _updatePhotoUI() {
    const photo = this.gameController.getCurrentPhoto();
    if (photo) this.uiView.setPhoto(photo.url);
  }

  _resetRoundUI() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
  }

  _resetAllUI() {
    this.tempGuess = null;
    this.gameMapController.reset();
    this.uiView.reset();
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
  }
}
