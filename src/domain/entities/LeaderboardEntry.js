/**
 * Represents an entry in the leaderboard.
 */
export class LeaderboardEntry {
  constructor({ userId, username = null, score, date }) {
    this.userId = userId;
    this.username = username;
    this.score = score;
    this.date = date instanceof Date ? date : new Date(date);
  }

  /**
   * Gets the user ID of the leaderboard entry.
   * @returns {string} The user ID.
   */
  getUserId() { return this.userId; }

  /**
   * Gets the username of the leaderboard entry.
   * @returns {string|null} The username or null if not available.
   */
  getUsername() { return this.username; }

  /**
   * Gets the score of the leaderboard entry.
   * @returns {number} The score.
   */
  getScore() { return this.score; }

  /**
   * Gets the date of the leaderboard entry.
   * @returns {Date} The date.
   */
  getDate() { return this.date; }
}