'use strict';

export class Game {
    constructor(id, userId, rounds = [], totalScore = 0, date = new Date()) {
        this.id = id;
        this.userId = userId;
        this.rounds = rounds; // Array of Round instances
        this.totalScore = totalScore;
        this.date = date; // Date when the game was played
    }

    getId() {
        return this.id;
    }

    getUserId() {
        return this.userId;
    }

    getRounds() {
        return this.rounds;
    }

    getTotalScore() {
        return this.totalScore;
    }

    getDate() {
        return this.date;
    }

    addRound(round) {
        this.rounds.push(round);
        this.totalScore += round.getScore();
    }
}