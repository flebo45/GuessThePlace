'use strict';

/**
 * Represents a game played by a user.
 */
export class Game {
    constructor(id, userId, rounds = [], totalScore = 0, date = new Date()) {
        this.id = id;
        this.userId = userId;
        this.rounds = rounds; // Array of Round instances
        this.totalScore = totalScore;
        this.date = date; // Date when the game was played
    }

    /**
     * Gets the unique identifier of the game.
     * @returns {string} The game ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the user ID of the player who played the game.
     * @returns {string} The user ID.
     */
    getUserId() {
        return this.userId;
    }

    /**
     * Gets the rounds played in the game.
     * @returns {Array} The array of rounds.
     */
    getRounds() {
        return this.rounds;
    }

    /**
     * Gets the total score achieved in the game.
     * @returns {number} The total score.
     */
    getTotalScore() {
        return this.totalScore;
    }

    /**
     * Gets the date when the game was played.
     * @returns {Date} The date of the game.
     */
    getDate() {
        return this.date;
    }

    /**
     * Adds a round to the game.
     * @param {Object} round - The round to add.
     */
    addRound(round) {
        this.rounds.push(round);
        this.totalScore += round.getScore();
    }
}