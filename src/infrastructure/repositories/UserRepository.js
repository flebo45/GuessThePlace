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

/**
 * Repository class for managing user data in Firestore and Firebase Authentication.
 */
export const UserRepository = {

    /**
     * Registers a new user.
     * @param {Object} param - The user registration details.
     * @param {string} param.email - The user's email address.
     * @param {string} param.password - The user's password.
     * @param {string} param.username - The user's chosen username.
     * @returns {Promise<User>} The registered user.
     */
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

        return new User(user.uid, email, username, []);
    },

    /**
     * Logs in a user.
     * @param {Object} param - The login details.
     * @param {string} param.email - The user's email address.
     * @param {string} param.password - The user's password.
     * @returns {Promise<User>} The logged-in user.
     */
    async login({email, password}) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = this.getUserById(userCredential.user.uid)
        return user;
    },

    /**
     * Logs out the current user.
     * @returns {Promise<void>}
     */
    async logout() {
        await signOut(auth);
    },

    /**
     * Retrieves a user by their ID.
     * @param {string} userId - The ID of the user to retrieve.
     * @returns {Promise<User|null>} The user object or null if not found.
     */
    async getUserById(userId) {
        const userDocRef = doc(db, "users", userId);
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) return null;
        const data = snapshot.data();
        return new User(userId, data.email || null, data.username || null, data.following || []);
    },

    /**
     * Retrieves multiple users by their IDs.
     * @param {Array<string>} userIds - The list of user IDs to retrieve.
     * @returns {Promise<Array<User|null>>} The list of user objects or null for not found.
     */
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

    /**
     * Retrieves a user by their username.
     * @param {string} username - The username of the user to retrieve.
     * @returns {Promise<User|null>} The user object or null if not found.
     */
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

    /**
     * Searches for users by a username prefix.
     * @param {string} prefix - The username prefix to search for.
     * @param {number} limit - The maximum number of results to return.
     * @returns {Promise<Array<User>>} The list of matching users.
     */
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

    /**
     * Follows a user.
     * @param {string} currentUserId - The ID of the current user.
     * @param {string} targetUserId - The ID of the user to follow.
     * @returns {Promise<void>}
     */
    async followUser(currentUserId, targetUserId) {
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, {
            following: arrayUnion(targetUserId)
        });
    },
    
    /**
     * Unfollows a user.
     * @param {string} currentUserId - The ID of the current user.
     * @param {string} targetUserId - The ID of the user to unfollow.
     * @returns {Promise<void>}
     */
    async unfollowUser(currentUserId, targetUserId) {
        const userDocRef = doc(db, "users", currentUserId);
        await updateDoc(userDocRef, {
            following: arrayRemove(targetUserId)
        });
    },

    /**
     * Listens for authentication state changes.
     * @param {function} callback - The callback function to execute on auth state change.
     */
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