import { SaveGame } from '../usecases/SaveGame.js';
import { appState } from '../state/AppState.js';
import { latLng } from 'leaflet';

/**
 * Manager class that orchestrates game flow between the GameController, GameMapController, and UIView.
 */
export class GameManager {
  constructor( { gameController, gameMapController , uiView }) {
    this.gameController = gameController;
    this.gameMapController = gameMapController;
    this.uiView = uiView;

    this.tempGuess = null;
  }

  /**
   * Sets a temporary guess based on the user's click on the map.
   * @param {Object} latlng - The latitude and longitude of the click event.
   */
  setTempGuess(latlng) {
    if (this.gameController.isGameOver()) return;
    this.tempGuess = { lat: latlng.lat, lng: latlng.lng };
    this.uiView.setConfirmEnabled(true);
  }

  /**
   * Starts a new game session.
   */
  async startNewGame() {
    this._resetAllUI();
    // Show loadig notify
    this.uiView.setStatus('Recupero foto... potrebbe volerci qualche istante.');
    try {
      // wait for photos fetch
      await this.gameController.startNewGame();
  
      this._updatePhotoUI();
      this.uiView.setStatus('Foto caricate. Inizio partita.');

    } catch (err) {
      console.error('Errore startNewGame:', err);
      this.uiView.setStatus('Errore nel recupero delle foto. Riprova.');
    } finally {
      // Remove message
      setTimeout(() => this.uiView.clearStatus(), 2000);
    }
  }

  /**
   * Handles a click event on the map by setting a temporary guess.
   * @param {Object} latlng - The latitude and longitude of the click event.
   */
  handleMapClick(latlng) {
    if (this.gameController.isGameOver()) return;
    this.tempGuess = { lat: latLng.lat, lng: latLng.lng};
    this.uiView.setConfirmEnabled(true); 
  } 

  /**
   * Confirms the user's guess and updates the game state.
   */
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

    if (this.gameMapController && typeof this.gameMapController.disableInteraction === 'function') {
      this.gameMapController.disableInteraction();
    }

    this.tempGuess = null;
  }

  /**
   * Proceeds to the next round or ends the game if it was the last round.
   */
  async nextRound() {
    const hasNext = this.gameController.nextRound();
    if (!hasNext) return await this._endGame();

    this._resetRoundUI();
    this._updatePhotoUI();
  }

  /**
   * Ends the current game session and saves the score.
   * @private
   */
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
    try {
      const hero = document.querySelector('.hero-actions');
      if (hero) { hero.classList.remove('hidden'); hero.classList.add('fade-in'); }
      const searchBar = document.querySelector('.search-bar');
      if (searchBar) { searchBar.classList.remove('hidden'); searchBar.classList.add('fade-in'); }
    } catch (e) {
      // ignore if DOM not available
    }
  }

  /**
   * Updates the photo UI with the current photo.
   * @private
   */
  _updatePhotoUI() {
    const photo = this.gameController.getCurrentPhoto();
    if (photo) this.uiView.setPhoto(photo.url);
  }


  /**
   * Resets the UI elements for a new round.
   * @private
   */
  _resetRoundUI() {
    this.tempGuess = null;
    this.gameMapController.reset();
    if (this.gameMapController && typeof this.gameMapController.enableInteraction === 'function') {
      this.gameMapController.enableInteraction();
    }
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
  }

  /**
   * Resets all UI elements for a new game.
   * @private
   */
  _resetAllUI() {
    this.tempGuess = null;
    this.gameMapController.reset();
    if (this.gameMapController && typeof this.gameMapController.enableInteraction === 'function') {
      this.gameMapController.enableInteraction();
    }
    this.uiView.reset();
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false);
  }
}
