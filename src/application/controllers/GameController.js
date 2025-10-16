// src/application/controllers/GameController.js
import { fetchPhotoEntities } from '../../infrastructure/apis/PhotoAPI.js';
import { AppState } from '../state/AppState.js';
import { calculateDistance } from '../../domain/services/DistanceCalculator.js';
import { calculateScore } from '../../domain/services/ScoringService.js';
import { Photo } from '../../domain/entities/Photo.js';
import { Guess } from '../../domain/entities/Guess.js';
//import { Score } from '../../domain/entities/Score.js';



export class GameController {
  constructor() {
    this.state = new AppState();
  }

  async startNewGame() {
    const photos = await fetchPhotoEntities(5);
    this.state.startNewGame(photos);
  }

  getCurrentPhoto() {
    return this.state.getCurrentPhoto();
  }

  isGameOver() {
    return this.state.isGameOver();
  }

  confirmGuess(guess) {
    // Strict domain contract: confirmGuess expects a domain `Guess` entity.
    if (!(guess instanceof Guess)) {
      throw new TypeError('GameController.confirmGuess expects a Guess instance');
    }

    const currentPhoto = this.getCurrentPhoto();
    const distance = calculateDistance(guess, currentPhoto);
    const score = calculateScore(distance);

    this.state.recordGuess(guess);
    // this.state.recordScore(score);
    // store score and distance together in the Round entity
    this.state.recordScore(score, distance);

    return { score, distance };
  }

  nextRound() {
    return this.state.nextRound();
  }

  getTotalScore() {
    return this.state.getTotalScore();
  }

  getCurrentRound() {
    return this.state.currentRound;
  }
}
