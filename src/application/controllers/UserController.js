import { SearchUser } from "../usecases/SearchUser";
import { appState } from "../state/AppState";

/**
 * Controller for managing user-related operations.
 */
export const UserController = {

    /**
     * Searches for users by their username (exact match).
     * @param {string} username - The username to search for.
     * @returns {Promise<Array>} - A promise that resolves to the list of matching users.
     */
    async searchExtract(username) {
        return await SearchUser.byUsernameExtract(username);
    },

    /**
     * Searches for users by a username prefix.
     * @param {string} prefix - The username prefix to search for.
     * @param {number} limit - The maximum number of results to return.
     * @returns {Promise<Array>} - A promise that resolves to the list of matching users.
     */
    async searchPrefix(prefix, limit) {
        return await SearchUser.byUsernamePrefix(prefix, limit);
    },

    /**
     * Retrieves a user by their unique identifier.
     * @param {string} id - The unique identifier of the user.
     * @returns {Promise<Object>} - A promise that resolves to the user object.
     */
    async getUserById(id) {
        return await SearchUser.byUserId(id);
    },

    /**
     * Retrieves the game history of a user by their unique identifier.
     * @param {string} id - The unique identifier of the user.
     * @returns {Promise<Array>} - A promise that resolves to the user's game history.
     */
    async getUserGamesHistory(id) {
        return await SearchUser.gamesHistory(id);
    },

    /**
     * Toggles the follow status of a user.
     * @param {string} targetId - The unique identifier of the user to follow/unfollow.
     * @returns {Promise<Object>} - A promise that resolves to the result of the follow/unfollow operation.
     */
    async toggleFollow(targetId) {
        const result = await  SearchUser.toggleFollow(appState.getUser(), targetId);
        if (result.status === "followed") {
            appState.getUser().follow(targetId);
        } else if (result.status === "unfollowed"){
            appState.getUser().unfollow(targetId);
        }
        return result;
    },

    /**
     * Checks if the current user is following another user.
     * @param {string} targetId - The unique identifier of the target user.
     * @returns {Promise<boolean>} - A promise that resolves to true if following, false otherwise.
     */
    async isFollowing(targetId) {
        return await SearchUser.isFollowing(appState.getUser(), targetId);
    }
};