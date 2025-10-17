import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { Game } from "../../domain/entities/Game.js";

export class SaveGame {

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