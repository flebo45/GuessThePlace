'use strict';

/**
 * Represents a user in the system.
 */
export class User {
    constructor(id, email = null, username = null, following = []) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.following = new Set(following); // Array of User IDs
    }

    /**
     * Creates a User instance from a Firebase user object.
     * @param {Object} firebaseUser - The Firebase user object.
     * @param {Object} extraData - Additional data to include.
     * @returns {User|null} The User instance or null if invalid.
     */
    static fromFirebaseUser(firebaseUser, extraData = {}) {
        if (!firebaseUser) return null;
        console.log(firebaseUser)
        return new User(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.displayName,
            extraData.following || []
        );
    }

    /**
     * Creates a User instance from a Firebase Firestore document snapshot.
     * @param {Object} docSnap - The Firestore document snapshot.
     * @returns {User|null} The User instance or null if the document does not exist.
     */
    static fromFirebaseDb(docSnap) {
        if (!docSnap.exists()) return null;
        const data = docSnap.data();
        return new User(
            docSnap.id,
            data.email,
            data.username,
            data.following || []
        );
    }

    /**
     * Gets the unique identifier of the user.
     * @returns {string} The user ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the email of the user.
     * @returns {string|null} The email or null if not available.
     */
    getEmail() {
        return this.email;
    }

    /**
     * Gets the username of the user.
     * @returns {string|null} The username or null if not available.
     */
    getUsername() {
        return this.username;
    }

    /**
     * Gets the list of user IDs that the user is following.
     * @returns {Array<string>} The array of following user IDs.
     */
    getFollowing() {
        return this.following;
    }

    /**
     * Follows another user.
     * @param {string} userId - The ID of the user to follow.
     */
    follow(userId) {
        this.following.add(userId);
    }

    /**
     * Unfollows a user.
     * @param {string} userId - The ID of the user to unfollow.
     */
    unfollow(userId) {
        this.following.delete(userId);
    }

    /**
     * Checks if the user is following another user.
     * @param {string} userId - The ID of the user to check.
     * @returns {boolean} True if following, false otherwise.
     */
    isFollowing(userId) {
        return this.following.has(userId);
    }

    /**
     * Converts the User instance to a plain object for serialization.
     * @returns {Object} The plain object representation of the user.
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            following: Array.from(this.following),
        };
    }
}