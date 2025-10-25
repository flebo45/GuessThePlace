import { User } from "../../domain/entities/User";
import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

/**
 * Use case for searching and retrieving user information and related data.
 */
export const SearchUser = {

    /**
     * Searches for a user by their username.
     * @param {string} username - The username to search for.
     * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
     */
    async byUsernameExtract(username) {
        if (!username || typeof username !== "string") return [];

        return await UserRepository.getUserByUsername(username.toLowerCase());
    },

    /**
     * Searches for users by a username prefix.
     * @param {string} prefix - The username prefix to search for.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
     */
    async byUsernamePrefix(prefix, limit = 10) {
        if (!prefix || typeof prefix !== "string") return [];

        return await UserRepository.findByUsernamePrefix(prefix.toLowerCase(), limit);
    },

    /**
     * Searches for a user by their ID.
     * @param {string} userId - The ID of the user to search for.
     * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
     */
    async byUserId(userId) {
        return await UserRepository.getUserById(userId);
    },

    /**
     * Retrieves the game history for a user.
     * @param {string} userId - The ID of the user to retrieve game history for.
     * @returns {Promise<Array>} - A promise that resolves to an array of game objects.
     */
    async gamesHistory(userId) {
        return await GameRepository.getGamesByUserId(userId);
    },

    /**
     * Toggles the follow status between the current user and the target user.
     * @param {Object} currentUser - The current user object.
     * @param {string} targetId - The ID of the user to follow/unfollow.
     * @returns {Promise<Object>} - A promise that resolves to the follow status.
     */
    async toggleFollow(currentUser, targetId) {
        const isFollowing = currentUser.isFollowing(targetId);
        if (isFollowing) {
            await UserRepository.unfollowUser(currentUser.id, targetId);
            return { status: "unfollowed"};
        } else {
            await UserRepository.followUser(currentUser.id, targetId);
            return { status: "followed" };
        }
    },

    /**
     * Checks if the current user is following the target user.
     * @param {Object} currentUser - The current user object.
     * @param {string} targetId - The ID of the target user.
     * @returns {Promise<boolean>} - A promise that resolves to true if following, false otherwise.
     */
    async isFollowing(currentUser, targetId) {
        return currentUser.isFollowing(targetId);
    }
};