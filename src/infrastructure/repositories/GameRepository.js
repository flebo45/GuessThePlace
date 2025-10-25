import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  Timestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase-config.js";
import { Game } from "../../domain/entities/Game.js";

/**
 * Repository class for managing game data in Firestore.
 */
export class GameRepository {
    static collectionref = collection(db, "games");

    /**
     * Saves a game to Firestore.
     * @param {Game} game - The game instance to save.
     * @returns {Promise<string>} The ID of the saved game document.
     */
    static async saveGame(game) {
        const now = Timestamp.now();
        try {
            const docRef = await addDoc(this.collectionref, {
                userId: game.getUserId(),
                totalScore: game.getTotalScore(),
                date: now,
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving game: ", error);
            throw error;
        }
    }

    /**
     * Retrieves all games for a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array<Game>>} The list of games for the user.
     */
    static async getGamesByUserId(userId) {
        try{
            const q = query(
                this.collectionref,
                where("userId", "==", userId),
                orderBy("date", "desc")
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map((docSnap) =>{
                const data = docSnap.data();
                return new Game(
                    docSnap.id,
                    data.userId,
                    [], // Rounds can be fetched separately if needed
                    data.totalScore,
                    (data.date && data.date.toDate) ? data.date.toDate() : new Date(data.date)
                );
            });
        } catch (error) {
            console.error("Error fetching games: ", error);
            throw error;
        }
    }

    /**
     * Retrieves the top games since a specific date.
     * @param {Date} sinceDate - The date to filter games.
     * @param {number} limit - The maximum number of games to retrieve.
     * @returns {Promise<Array<Object>>} The list of top games.
     */
    static async getTopGamesSince(sinceDate, limit = 10) {
        const sinceTs = Timestamp.fromDate(sinceDate);

        const q = query(
            this.collectionref,
            where("date", ">=", sinceTs),
            orderBy("totalScore", "desc"),
            fbLimit(limit)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    }

    /**
     * Retrieves the top games by specific users since a specific date.
     * @param {Array<string>} userIds - The list of user IDs.
     * @param {Date} sinceDate - The date to filter games.
     * @returns {Promise<Array<Object>>} The list of top games by the specified users.
     */
    static async getTopGamesByUsersSince(userIds = [], sinceDate) {
        if (!Array.isArray(userIds) || userIds.length === 0) return [];

        const sinceTs = Timestamp.fromDate(sinceDate);

        const results = [];

        for (const userId of userIds) {
            const q = query(
                this.collectionref,
                where("userId", "==", userId),
                where("date", ">=", sinceTs),
                orderBy("totalScore", "desc"),
                fbLimit(1) // get top N per chunk - we'll merge later
            );

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                results.push({ id: doc.id, ...doc.data() });
            }
        }

        results.sort((a, b) => b.totalScore - a.totalScore);

        return results;
    }

}
                    