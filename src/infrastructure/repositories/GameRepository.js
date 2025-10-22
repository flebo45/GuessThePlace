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


    static async getTopGamesByUsersSince(userIds = [], sinceDate, limit = 10) {
        if (!Array.isArray(userIds) || userIds.length === 0) return [];

        const sinceTs = Timestamp.fromDate(sinceDate);

        // split into chunks of <= 10 (Firestore 'in' max)
        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < userIds.length; i += chunkSize) {
            chunks.push(userIds.slice(i, i + chunkSize));
        }

        const results = [];

        for (const chunk of chunks) {
            const q = query(
                this.collectionref,
                where("userId", "in", chunk),
                where("date", ">=", sinceTs),
                orderBy("totalScore", "desc"),
                fbLimit(limit) // get top N per chunk - we'll merge later
            );

            const snapshot = await getDocs(q);
            console.log(snapshot);
            snapshot.docs.forEach(d => results.push({ id: d.id, ...d.data() }));
        }

        // merge & sort by score desc, then take top `limit`
        results.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        console.log(results);
        return results.slice(0, limit);
    }

}
                    