import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase/firebase-config.js";
import { Game } from "../../domain/entities/Game.js";


export class GameRepository {
    static collectionref = collection(db, "games");

    static async saveGame(game) {
        try {
            const docRef = await addDoc(this.collectionref, {
                userId: game.getUserId(),
                totalScore: game.getTotalScore(),
                date: game.getDate().toISOString(),
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

}
                    