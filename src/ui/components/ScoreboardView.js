// src/ui/components/ScoreboardView.js
export class ScoreboardView {
  constructor(scoreList) {
    this.scoreListEl = scoreList;
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
