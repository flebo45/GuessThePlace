import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  orderBy,
  startAt,
  endAt
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase-config.js";
import { User } from "../../domain/entities/User.js";

const usersCollection = collection(db, "users");

export const UserRepository = {
    async register({email, password, username}) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: email,
            username: username.toLowerCase(),
            following: [],
            createdAt: new Date(),
        });

        return User.fromFirebaseUser(user);
    },

    async login({email, password}) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = this.getUserById(userCredential.user.uid)
        return user;
    },
    
    async logout() {
        await signOut(auth);
    },

    async getUserById(userId) {
        const userDocRef = doc(db, "users", userId);
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) return null;
        const data = snapshot.data();
        return new User(userId, data.email || null, data.username || null, data.following || []);
    },

    async getUsersByIds(userIds = []) {
        if (!userIds || userIds.length === 0) return [];
        const results = [];
        for (const id of userIds) {
            const dref = doc(db, "users", id);
            const snap = await getDoc(dref);
            if (snap.exists()) {
                const data = snap.data();
                results.push({ id: snap.id, ...data });
            }
        }
        return results;
    },

    async getUserFromUsername(username) {
        if (!username) return null;

        try {
            const q = query(usersCollection, where("username", "==", username), orderBy("username"));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;

            return snapshot.docs.map((docSnap) => User.fromFirebaseUser(docSnap));;
        } catch (error) {
            console.error("Error fetching user by username: ", error);
            throw error;
        }
    },

    async findByUsernamePrefix(prefix, limit = 10) {
        if (!prefix) return [];

        try {
            const prefixLc = prefix.toLowerCase();

            const startValue = prefixLc;
            const endValue = prefixLc + '\uf8ff';

            const q = query(
                usersCollection,
                orderBy("username"),
                startAt(startValue),
                endAt(endValue)
            );

            const snapshot = await getDocs(q);
            const users = snapshot.docs.slice(0, limit).map((docSnap) => User.fromFirebaseDb(docSnap));

            return users;
        } catch (error) {
            console.error("Error searching users by prefix: ", error);
            throw error;
        }
    },

    async followUser(currentUserId, targetUserId) {
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, {
            following: arrayUnion(targetUserId)
        });
    },
    
    async unfollowUser(currentUserId, targetUserId) {
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, {
            following: arrayRemove(targetUserId)
        });
    },

    onAuthStateChanged(callback) {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) return callback(null);

            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                callback(new User(data.id, data.email, data.username, data.following || []));
            } else {
                callback(null);
            }
        });
    }
};