// src/application/controllers/GameController.js
import { AppState } from '../state/AppState.js';
import { calculateDistance } from '../../domain/services/DistanceCalculator.js';
import { calculateScore } from '../../domain/services/ScoringService.js';
import { Photo } from '../../domain/entities/Photo.js';
import { Guess } from '../../domain/entities/Guess.js';
import { Score } from '../../domain/entities/Score.js';


export class GameController {
  constructor() {
    this.state = new AppState();
  }

  startNewGame() {
    const photos = [
       new Photo('https://kinsta.com/wp-content/uploads/2020/08/raster-image-jpg.jpg', 40.73061,
        -73.935242,
      ),
      new Photo('https://kinsta.com/wp-content/uploads/2020/08/vector-image.jpg', 48.8566,
        2.3522,
      ),
      new Photo('https://kinsta.com/wp-content/uploads/2020/08/kinsta-resource-center-png-image.png', 34.0522,
        -118.2437,
      ),
      new Photo('https://kinsta.com/wp-content/uploads/2020/08/tiff-icon.jpg', 35.6895,
        139.6917,
      ),
      new Photo('https://kinsta.com/wp-content/uploads/2020/08/bmp-vs-gif.png', 51.5074,
        -0.1278,
      )
    ];
    this.state.startNewGame(photos);
  }

  getCurrentPhoto() {
    return this.state.getCurrentPhoto();
  }

  isGameOver() {
    return this.state.isGameOver();
  }

  confirmGuess(guessLatLng) {
    const roundNumber = this.state.currentRound;
    const guess = new Guess(guessLatLng.lat, guessLatLng.lng, roundNumber);

    const currentPhoto = this.getCurrentPhoto();
    const distance = calculateDistance(guess, currentPhoto);
    const points = calculateScore(distance);

    const score = new Score(points, distance, roundNumber);

    this.state.recordGuess(guess);
    this.state.recordScore(score);

    return { score: points, distance };
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
