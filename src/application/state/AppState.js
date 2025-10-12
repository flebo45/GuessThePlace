export class AppState {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.resetGame();
  }

  // ---------- USER SESSION MANAGEMENT ----------

  setUser(user) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  clearUser() {
    this.user = null;
    this.isAuthenticated = false;
  }

  getUser() {
    return this.user;
  }

  // ---------- GAME MANAGEMENT ----------

  resetGame() {
    this.currentRound = 0;
    this.totalRounds = 5;
    this.scores = [];
    this.guesses = [];
    this.photos = [];
  }

  startNewGame(photoSet) {
    this.resetGame();
    this.photos = photoSet;
    this.currentRound = this.photos.length > 0 ? 1 : 0;
  }

  recordGuess(guess) {
    this.guesses[this.currentRound - 1] = guess;
  }

  recordScore(score) {
    this.scores[this.currentRound - 1] = score;
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

  getCurrentPhoto() {
    if (this.photos.length >= this.currentRound && this.currentRound > 0) {
      return this.photos[this.currentRound - 1];
    }
    return null;
  }

  getTotalScore() {
    return this.scores.reduce((acc, s) => acc + s.points, 0);
  }

  // ---------- GLOBAL RESET ----------

  resetAll() {
    this.clearUser();
    this.resetGame();
  }
}

// Singleton instance to be shared across app
export const appState = new AppState();