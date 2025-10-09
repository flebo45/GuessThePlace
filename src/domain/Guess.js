'use strict';

export class Guess {
    constructor(guessedLatitude, guessedLongitude) {
        this.guessedLatitude = guessedLatitude;
        this.guessedLongitude = guessedLongitude;
    }

    getGuessedLatitude() {
        return this.guessedLatitude;
    }

    getGuessedLongitude() {
        return this.guessedLongitude;
    }
}