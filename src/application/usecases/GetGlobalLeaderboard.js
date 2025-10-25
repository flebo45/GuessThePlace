import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry";

/**
 * Use case for retrieving the global leaderboard.
 */
export const GetGlobalLeaderboard = {

  /**
   * Retrieves the global leaderboard.
   * @param {Object} params - The parameters for the request.
   * @param {Date} params.sinceDate - The date to filter games since.
   * @param {number} [params.limit=10] - The maximum number of entries to return.
   * @returns {Promise<Array>} - A promise that resolves to an array of leaderboard entries.
   */
  async execute({ sinceDate, limit = 10 }) {
    const topGames = await GameRepository.getTopGamesSince(sinceDate, limit);
    if (!topGames || topGames.length === 0) return [];

    // collect userIds to resolve usernames
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