'use strict';

export class Guess {
    constructor(guessedLatitude, guessedLongitude, roundNumber) {
        this.guessedLatitude = guessedLatitude;
        this.guessedLongitude = guessedLongitude;
        this.roundNumber = roundNumber;
    }

    getGuessedLatitude() {
        return this.guessedLatitude;
    }

    getGuessedLongitude() {
        return this.guessedLongitude;
    }

    getRoundNumber() {
        return this.roundNumber;
    }
}