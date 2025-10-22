import { GetGlobalLeaderboard } from "../usecases/GetGlobalLeaderboard";
import { GetFriendsLeaderboard } from "../usecases/GetFriendLeaderboard";
import { appState } from "../state/AppState";


export const LeaderboardController = {
  async getGlobal(sinceDate, limit = 10) {
    return await GetGlobalLeaderboard.execute({ sinceDate, limit });
  },

  async getFriends(sinceDate, limit = 10) {
    const user = appState.getUser();
    return await GetFriendsLeaderboard.execute({ currentUser: user, sinceDate, limit });
  }
};