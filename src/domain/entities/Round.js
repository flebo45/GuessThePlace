'use strict';

export class Round {
  constructor(roundNumber, truthPhoto = null) {
    this.roundNumber = roundNumber;
    // truth: instance of Photo
    this.truth = truthPhoto;

    // guess: instance of Guess (or null until confirmed)
    this.guess = null;

    // derived values after confirmation
    this.distanceKm = null;
    this.score = null;
  }
}