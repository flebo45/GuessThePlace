'use strict';

export class User {
    constructor(id, username, friends = []) {
        this.id = id;
        this.username = username;
        this.friends = friends; // Array of User IDs
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }

    getFriends() {
        return this.friends;
    }

    addFriend(friendId) {
        if (!this.friends.includes(friendId)) {
            this.friends.push(friendId);
        }
    }

    removeFriend(friendId) {
        this.friends = this.friends.filter(id => id !== friendId);
    }
}