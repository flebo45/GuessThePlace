'use strict';

/**
 * Represents a guess made by a user in a round.
 */
export class Guess {
  constructor(lat, lng, roundNumber) {
    this.lat = lat;
    this.lng = lng;
    this.roundNumber = roundNumber;
  }
}
