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
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase-config.js";
import { User } from "../../domain/entities/User.js";

export const UserRepository = {
    async register({email, password, username}) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (username) await updateProfile(user, { displayName: username });

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: email,
            username: username,
            following: [],
            createdAt: new Date(),
        });

        return User.fromFirebaseUser(user);
    },

    async login({email, password}) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //TODO add extra user data fromm firebase database
        return User.fromFirebaseUser(userCredential.user);
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