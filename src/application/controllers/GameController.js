import { fetchPhotoEntities } from '../../infrastructure/apis/PhotoAPI.js';
import { calculateDistance } from '../../domain/services/DistanceCalculator.js';
import { calculateScore } from '../../domain/services/ScoringService.js';
import { Guess } from '../../domain/entities/Guess.js';
import { appState } from '../state/AppState.js';

export class GameController {
  constructor() {
    this.state = appState;
  }

  async startNewGame(count = 5) {
    const photos = await fetchPhotoEntities(count);
    this.state.startNewGame(photos);
  }

  getCurrentPhoto() {
    return this.state.getCurrentPhoto() ? this.state.getCurrentPhoto() : null ;
  }

  isGameOver() {
    return this.state.isGameOver();
  }

  confirmGuess({lat, lng}) {
    const guess = new Guess(lat, lng, this.state.getCurrentRoundNumber())

    const currentPhoto = this.state.getCurrentPhoto();
    const distance = calculateDistance(guess, currentPhoto);
    const score = calculateScore(distance);

    this.state.recordGuess(guess);
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
