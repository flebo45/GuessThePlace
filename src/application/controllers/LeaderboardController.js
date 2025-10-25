import { GetGlobalLeaderboard } from "../usecases/GetGlobalLeaderboard";
import { GetFriendsLeaderboard } from "../usecases/GetFriendLeaderboard";
import { appState } from "../state/AppState";

/**
 * Controller for managing leaderboard-related operations.
 */
export const LeaderboardController = {

  /**
   * Fetches the global leaderboard.
   * @param {Date} sinceDate - The date from which to fetch leaderboard data.
   * @param {number} limit - The maximum number of results to return.
   * @returns {Promise<Array>} - A promise that resolves to the global leaderboard data.
   */
  async getGlobal(sinceDate, limit = 10) {
    return await GetGlobalLeaderboard.execute({ sinceDate, limit });
  },

  /**
   * Fetches the friends leaderboard.
   * @param {Date} sinceDate - The date from which to fetch leaderboard data.
   * @param {number} limit - The maximum number of results to return.
   * @returns {Promise<Array>} - A promise that resolves to the friends leaderboard data.
   */
  async getFriends(sinceDate, limit = 10) {
    const user = appState.getUser();
    return await GetFriendsLeaderboard.execute({ currentUser: user, sinceDate, limit });
  }
};