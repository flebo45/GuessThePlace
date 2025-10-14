'use strict';

export class User {
    constructor(id, email = null, username = null, following = []) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.following = new Set(following); // Array of User IDs
    }

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

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getUsername() {
        return this.username;
    }


    getFollowing() {
        return this.following;
    }

    follow(userId) {
        this.following.add(userId);
    }

    unfollow(userId) {
        this.following.delete(userId);
    }

    isFollowing(userId) {
        return this.following.has(userId);
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            following: Array.from(this.following),
        };
    }
}