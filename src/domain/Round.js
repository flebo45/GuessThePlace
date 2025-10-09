'use strict';

export class Round {
    constructor(photo, guess = null, score = null, distanceKm = null) {
        this.photo = photo; // Instance of Photo
        this.guess = guess; // Instance of Guess
        this.score = score; // Integer score for the round
        this.distanceKm = distanceKm; // Distance in kilometers between guess and actual location
    }
    getPhoto() {
        return this.photo;
    }

    getGuess() {
        return this.guess;
    }

    getScore() {
        return this.score;
    }

    getDistanceKm() {
        return this.distanceKm;
    }
    setGuess(guess) {
        this.guess = guess;
    }

    setScore(score) {
        this.score = score;
    }

    setDistanceKm(distanceKm) {
        this.distanceKm = distanceKm;
    }
}   