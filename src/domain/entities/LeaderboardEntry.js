export class LeaderboardEntry {
  constructor({ userId, username = null, score, date }) {
    this.userId = userId;
    this.username = username;
    this.score = score;
    this.date = date instanceof Date ? date : new Date(date);
  }

  getUserId() { return this.userId; }
  getUsername() { return this.username; }
  getScore() { return this.score; }
  getDate() { return this.date; }
}