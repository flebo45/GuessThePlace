/**
 * ScoreboardView component to display round scores.
 * @class
 */
export class ScoreboardView {
  constructor(scoreList) {
    this.scoreListEl = scoreList;
  }

  /**
   * Adds a round score to the scoreboard.
   * @param {number} roundNum - The round number.
   * @param {number} score - The score achieved in the round.
   * @param {number} distance - The distance guessed in the round.
   */
  addRoundScore(roundNum, score, distance) {
    const li = document.createElement('li');
    li.textContent = `Round ${roundNum}: ${score} punti (distanza: ${distance.toFixed(2)} km)`;
    this.scoreListEl.appendChild(li);
  }

  /**
   * Clears all scores from the scoreboard.
   */
  clear() {
    this.scoreListEl.innerHTML = '';
  }
}
