import { GameRepository } from "../../infrastructure/repositories/GameRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry";

export const GetGlobalLeaderboard = {
  /**
   * sinceDate: Date
   * limit: number
   * returns array of LeaderboardEntry
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