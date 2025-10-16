import { Round } from '../../domain/entities/Round.js';

export class AppState {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.authReady = false;
    this.listeners = [];
    this.resetGame();
  }

  // ---------- USER SESSION MANAGEMENT ----------

  setUser(user) {
    this.user = user;
    this.isAuthenticated = true;
    this.authReady = true;
    this.notify();
  }

  clearUser() {
    this.user = null;
    this.isAuthenticated = false;
    this.authReady = true;
    this.notify();
  }

  setAuthReady() {
    this.authReady = true;
    this.notify();
  }
  
  getUser() {
    return this.user;
  }

  notify() {
    this.listeners.forEach(callback => callback(this));
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  // ---------- GAME MANAGEMENT ----------

  resetGame() {
    // public-compatible properties retained for API stability
    this.currentRound = 0;
    this.totalRounds = 5;

    // Legacy arrays removed from authoritative storage.
    // Keep small, readonly-compatible caches only if strictly needed.
    // New authoritative representation:
    this.rounds = [];
  }

  // photoSet: array of Photo domain entities
  startNewGame(photoSet) {
    this.resetGame();
    // create Round entities from provided photos
    this.rounds = (photoSet || []).map((p, idx) => new Round(idx + 1, p)); //costruzione dell'array di round a partire dall'array di photo, assegnando a ciacun round numero progressivo e la sua foto di riferimento
    // preserve totalRounds semantics (if you want fixed length behavior)
    this.totalRounds = Math.max(this.rounds.length, this.totalRounds); //forse superlfuo, si potrebbe usare sempre 
    this.currentRound = this.rounds.length > 0 ? 1 : 0;
  }

  // Persist the domain Guess entity into the current Round
  recordGuess(guess) {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length) {
      this.rounds[idx].guess = guess;
    } else {
      // out-of-range: ignore to preserve previous non-crashing behaviour
    }
  }

  // Persist score (and optional distance) for current round
  // kept signature backward-compatible: second param 'distanceKm' optional
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

  nextRound() {
    if (this.currentRound < this.totalRounds) {
      this.currentRound++;
      return true;
    } else {
      this.currentRound++;
      return false;
    }
  }

  isGameOver() {
    return this.currentRound > this.totalRounds;
  }

  // Return the Photo (truth) for the current round (keeps existing GameController API)
  getCurrentPhoto() {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length && this.rounds[idx].truth) {
      return this.rounds[idx].truth;
    }
    return null;
  }

  // Access to Round entity if needed
  getCurrentRoundEntity() {
    const idx = this.currentRound - 1;
    if (idx >= 0 && idx < this.rounds.length) return this.rounds[idx];
    return null;
  }

  getRound(roundNumber) {
    const idx = roundNumber - 1;
    if (idx >= 0 && idx < this.rounds.length) return this.rounds[idx];
    return null;
  }

  getRounds() {
    return this.rounds.slice(); // return shallow copy for safety
  }

  // Total score computed from Round.score values
  getTotalScore() {
    return this.rounds.reduce((acc, r) => acc + (r.score || 0), 0);
  }



  // ---------- GLOBAL RESET ----------

  resetAll() {
    this.clearUser();
    this.resetGame();
  }
}

// Singleton instance to be shared across app
export const appState = new AppState();