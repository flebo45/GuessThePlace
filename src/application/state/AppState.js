import { Round } from '../../domain/entities/Round.js';

/**
 * Application state management class.
 */
export class AppState {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.authReady = false;
    this.listeners = [];
    this.resetGame();
  }

  // ---------- USER SESSION MANAGEMENT ----------

  /**
   * Sets the current user.
   * @param {Object} user - The user object to set.
   */
  setUser(user) {
    this.user = user;
    this.isAuthenticated = true;
    this.authReady = true;
    this.notify();
  }

  /**
   * Clears the current user.
   */
  clearUser() {
    this.user = null;
    this.isAuthenticated = false;
    this.authReady = true;
    this.notify();
  }

  /**
   * Marks authentication as ready.
   */
  setAuthReady() {
    this.authReady = true;
    this.notify();
  }
  
  /**
   * Retrieves the current user.
   * @returns {Object} The current user object.
   */
  getUser() {
    return this.user;
  }

  /**
   * Notifies all subscribed listeners of state changes.
   */
  notify() {
    this.listeners.forEach(callback => callback(this));
  }

  /**
   * Subscribes a listener to state changes.
   * @param {Function} callback - The callback function to invoke on state changes.
   */
  subscribe(callback) {
    this.listeners.push(callback);
  }

  // ---------- GAME MANAGEMENT ----------

  /**
   * Resets the game state to initial values.
   */
  resetGame() {
    // public-compatible properties retained for API stability
    this.currentRound = 0;
    this.totalRounds = 5;

    // Legacy arrays removed from authoritative storage.
    // Keep small, readonly-compatible caches only if strictly needed.
    // New authoritative representation:
    this.rounds = [];
  }

  /**
   * Starts a new game with the provided set of photos.
   * @param {Array} photoSet - The set of photos for the new game.
   */
  startNewGame(photoSet) {
    this.resetGame();
    // create Round entities from provided photos
    this.rounds = (photoSet || []).map((p, idx) => new Round(idx + 1, p)); //costruzione dell'array di round a partire dall'array di photo, assegnando a ciacun round numero progressivo e la sua foto di riferimento
    // preserve totalRounds semantics (if you want fixed length behavior)
    this.totalRounds = Math.max(this.rounds.length, this.totalRounds); //forse superlfuo, si potrebbe usare sempre 
    this.currentRound = this.rounds.length > 0 ? 1 : 0;
  }

  /**
   * Records the user's guess for the current round.
   * @param {*} guess - The user's guess.
   */
  recordGuess(guess) {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length) {
      this.rounds[idx].guess = guess;
    } else {
      // out-of-range: ignore to preserve previous non-crashing behaviour
    }
  }

  /**
   * Records the score for the current round.
   * @param {number} score - The score to record.
   * @param {number|null} distanceKm - The distance in kilometers (optional).
   */
  recordScore(score, distanceKm = null) {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length) {
      this.rounds[idx].score = score;
      // store distance if provided (or keep existing)
      if (distanceKm !== null) this.rounds[idx].distanceKm = distanceKm;
    } else {
      // ignore out-of-range writes
    }
  }

  /**
   * Advances to the next round.
   * @returns {boolean} - True if the next round was started, false if the game is over.
   */
  nextRound() {
    if (this.currentRound < this.totalRounds) {
      this.currentRound++;
      return true;
    } else {
      this.currentRound++;
      return false;
    }
  }

  /**
   * Checks if the game is over.
   * @returns {boolean} - True if the game is over, false otherwise.
   */
  isGameOver() {
    return this.currentRound > this.totalRounds;
  }

  /**
   * Retrieves the current photo for the active round.
   * @returns {Object|null} - The current photo object or null if not available.
   */
  getCurrentPhoto() {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length && this.rounds[idx].truth) {
      return this.rounds[idx].truth;
    }
    return null;
  }

  /**
   * Retrieves the current round number.
   * @returns {number} - The current round number.
   */
  getCurrentRoundNumber() {
    return this.currentRound;
  }

  /**
   * Retrieves the current round entity.
   * @returns {Object|null} - The current round entity or null if not available.
   */
  getCurrentRoundEntity() {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length) return this.rounds[idx];
    return null;
  }

  /**
   * Retrieves a specific round by its number.
   * @param {number} roundNumber - The round number to retrieve.
   * @returns {Object|null} - The round entity or null if not available.
   */
  getRound(roundNumber) {
    const idx = roundNumber - 1;
    if (idx >= 0 && idx < this.rounds.length) return this.rounds[idx];
    return null;
  }

  /**
   * Retrieves all rounds.
   * @returns {Array} - An array of all round entities.
   */
  getRounds() {
    return this.rounds.slice(); // return shallow copy for safety
  }

  /**
   * Calculates the total score across all rounds.
   * @returns {number} - The total score.
   */
  getTotalScore() {
    return this.rounds.reduce((acc, r) => acc + (r.score || 0), 0);
  }



  // ---------- GLOBAL RESET ----------

  /**
   * Resets the entire application state, including user and game data.
   */
  resetAll() {
    this.clearUser();
    this.resetGame();
  }
}

// Singleton instance to be shared across app
export const appState = new AppState();