// src/application/state/AppState.js

export class AppState {
  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.currentRound = 0;
    this.totalRounds = 5;
    this.scores = [];
    this.guesses = [];
    this.photos = []; 
  }

 startNewGame(photoSet) {
  this.resetGame();
  this.photos = photoSet;// || [];
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
    }else {this.currentRound++;
    return false;}
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
}




