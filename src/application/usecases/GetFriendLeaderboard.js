import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry";

export const GetFriendsLeaderboard = {
  /**
   * currentUser: domain User instance (should expose following collection)
   * sinceDate: Date
   * limit: number
   */
  async execute({ currentUser, sinceDate, limit = 10 }) {
    if (!currentUser) return [];

    // currentUser.getFollowing() expected to be iterable of userIds
    const following = Array.from(currentUser.getFollowing ? currentUser.getFollowing() : (currentUser.following || []));
    if (!following || following.length === 0) return [];

    const topGames = await GameRepository.getTopGamesByUsersSince(following, sinceDate, limit);
    if (!topGames || topGames.length === 0) return [];

    // resolve usernames
    const userIds = [...new Set(topGames.map(g => g.userId))];
    const users = await UserRepository.getUsersByIds(userIds);
    const userMap = new Map(users.map(u => [u.id, u.username || u.displayName || u.email || ""]));

    const entries = topGames.map(g => new LeaderboardEntry({
      userId: g.userId,
      username: userMap.get(g.userId) || "Unknown",
      score: g.totalScore || g.score || 0,
      date: (g.date && g.date.toDate) ? g.date.toDate() : new Date(g.date)
    }));

    return entries;
  }
};