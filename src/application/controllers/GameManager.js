import { SaveGame } from '../usecases/SaveGame.js';
import { appState } from '../state/AppState.js';
import { latLng } from 'leaflet'; // Assicurati che 'leaflet' sia importato correttamente se usato (anche se latLng qui sembra non usato)

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
    // Show loading notify
    this.uiView.setStatus('Recupero foto... potrebbe volerci qualche istante.');
    this.uiView.showLoader(); // Mostra lo spinner
    try {
      // wait for photos fetch
      await this.gameController.startNewGame();

      this._updatePhotoUI();
      this.uiView.setStatus('Foto caricate. Inizio partita.');

    } catch (err) {
      console.error('Errore startNewGame:', err);
      this.uiView.setStatus('Errore nel recupero delle foto. Riprova.');
    } finally {
      this.uiView.hideLoader(); // Nascondi lo spinner
      // Remove message
      setTimeout(() => this.uiView.clearStatus(), 2000);
    }
  }

  /**
   * Handles a click event on the map by setting a temporary guess.
   * @param {Object} latlng - The latitude and longitude of the click event.
   */
  handleMapClick(latlng) {
    // Questa funzione sembra duplicata/non usata, setTempGuess è già collegato
    // if (this.gameController.isGameOver()) return;
    // this.tempGuess = { lat: latlng.lat, lng: latlng.lng}; // latLng qui è 'leaflet', non le coordinate
    // this.uiView.setConfirmEnabled(true);
     console.warn("handleMapClick called, might be redundant if map click is directly linked to setTempGuess");
  }

  /**
   * Confirms the user's guess and updates the game state.
   */
  confirmGuess() {
    if (!this.tempGuess || this.gameController.isGameOver()) return;

    const result = this.gameController.confirmGuess(this.tempGuess);
    const currentPhoto = this.gameController.getCurrentPhoto();

    // Mostra soluzione sulla mappa
    if (currentPhoto) { // Aggiungi controllo null
        this.gameMapController.showSolution({ lat: currentPhoto.lat, lng: currentPhoto.lng });
        this.gameMapController.showLineBetween();
    }


    this.uiView.addRoundScore(
      this.gameController.getCurrentRound(),
      result.score,
      result.distance
    );

    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(true); // Abilita il bottone Next

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
    if (!hasNext) {
        await this._endGame();
        return; // Esce dalla funzione dopo aver terminato il gioco
    }

    this._resetRoundUI();
    this._updatePhotoUI();
  }

  /**
   * Ends the current game session, saves the score, and updates the UI.
   * @private
   */
  async _endGame() {
    console.log("Game Ended. Showing final score and hero buttons."); // Debug
    const totalScore = this.gameController.getTotalScore();
    const user = appState.user;

    // Salva il gioco (se l'utente è loggato)
    if (user && user.id) { // Controlla anche user.id per sicurezza
      try {
        await SaveGame.execute(user.id, totalScore);
        console.log("Game saved successfully for user:", user.id); // Debug
      } catch (err) {
        console.error("Errore salvataggio partita:", err); // Usa console.error
      }
    } else {
        console.log("User not logged in, game score not saved."); // Debug
    }

    // Mostra il punteggio finale nella UI
    this.uiView.showGameOver(totalScore);

    // Disabilita i bottoni di gioco rimasti attivi
    this.uiView.showNextButton(false); // Assicura che Next sia disabilitato
    this.uiView.setConfirmEnabled(false); // Assicura che Confirm sia disabilitato
    if (this.gameMapController && typeof this.gameMapController.disableInteraction === 'function') {
      this.gameMapController.disableInteraction(); // Assicura mappa non interattiva
    }


    // *** CORREZIONE: Riattiva la sezione Hero ***
    try {
        // Cerca l'elemento .hero-viewport nel DOM globale, non dentro this.uiView.root
        const hero = document.querySelector('.hero-viewport');
        if (hero) {
            console.log("Making hero viewport visible"); // Debug
            hero.classList.remove('d-none'); // Rimuovi la classe che lo nasconde
            hero.classList.add('fade-in'); // Aggiungi animazione (opzionale)
        } else {
            console.warn("Hero viewport element not found."); // Debug
        }

        // Se vuoi mostrare di nuovo anche la barra di ricerca (era nel codice originale)
        // const searchBar = document.querySelector('.search-wrapper'); // Cerca nel DOM globale
        // if (searchBar) {
        //     searchBar.classList.remove('d-none');
        //     searchBar.classList.add('fade-in');
        // }
    } catch (e) {
      console.error("Error trying to show hero actions:", e); // Debug
    }
  }

  /**
   * Updates the photo UI with the current photo.
   * @private
   */
  _updatePhotoUI() {
    const photo = this.gameController.getCurrentPhoto();
    if (photo && photo.url) { // Aggiungi controllo su url
        this.uiView.setPhoto(photo.url);
    } else {
        console.warn("Could not get current photo or photo URL is missing."); // Debug
        this.uiView.setPhoto(null); // Pulisci la foto se non valida
    }
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
    this.uiView.showNextButton(false); // showNextButton(false) significa disabilitato
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
    this.uiView.reset(); // reset ora pulisce scoreList e nasconde gameMessage
    this.uiView.setConfirmEnabled(false);
    this.uiView.showNextButton(false); // Assicura che sia disabilitato all'inizio
     // Nascondi .hero-viewport se startNewGame viene chiamato di nuovo
     const hero = document.querySelector('.hero-viewport');
     if (hero) {
         hero.classList.add('d-none');
     }
  }
}