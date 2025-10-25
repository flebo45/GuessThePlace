import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { Game } from "../../domain/entities/Game.js";

/**
 * Use case for saving a completed game to the repository.
 */
export class SaveGame {

    /**
     * Saves a completed game to the repository.
     * @param {string} userId - The ID of the user who played the game.
     * @param {number} totalScore - The total score achieved in the game.
     * @returns {Promise<string>} - A promise that resolves to the ID of the saved game.
     * @throws {Error} - Throws an error if userId or totalScore is missing.
     */
    static async execute(userId, totalScore) {
        if (!userId) throw new Error("User ID is required to save a game.");

        const game = new Game(
            null, // ID will be assigned by Firestore
            userId,
            [], // Rounds can be added later
            totalScore,
            new Date()
        );

        try{
            const gameId = await GameRepository.saveGame(game);
            return gameId;
        } catch (error) {
            console.error("Failed to save game:", error);
            throw error;
        }
    }
}