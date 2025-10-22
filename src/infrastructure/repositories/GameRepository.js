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


export class GameRepository {
    static collectionref = collection(db, "games");

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
                    new Date(data.date)
                );
            });
        } catch (error) {
            console.error("Error fetching games: ", error);
            throw error;
        }
    }

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
                    