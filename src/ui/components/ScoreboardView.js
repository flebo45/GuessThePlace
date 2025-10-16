// src/ui/components/ScoreboardView.js
export class ScoreboardView {
  constructor({ scoreListId }) {
    this.scoreListEl = typeof scoreListId === 'string' ? document.getElementById(scoreListId) : scoreListId;
  }

  addRoundScore(roundNum, score, distance) {
    const li = document.createElement('li');
    li.textContent = `Round ${roundNum}: ${score} punti (distanza: ${distance.toFixed(2)} km)`;
    this.scoreListEl.appendChild(li);
  }

  clear() {
    this.scoreListEl.innerHTML = '';
  }
}
