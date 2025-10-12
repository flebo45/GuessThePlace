// src/application/controllers/UIController.js

import { PhotoViewer } from '../../ui/components/PhotoViewer.js';

export class UIController {
  constructor({ photoContainerId, confirmBtnId, nextBtnId, newGameBtnId, scoreListId, onConfirm, onNextRound, onNewGame }) {
    this.photoViewer = new PhotoViewer(photoContainerId);
    this.confirmBtn = document.getElementById(confirmBtnId);
    this.nextBtn = document.getElementById(nextBtnId);
    this.newGameBtn = document.getElementById(newGameBtnId);
    this.scoreListEl = document.getElementById(scoreListId);

    this.confirmBtn.disabled = true;
    this.nextBtn.style.display = 'none';

    this.confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
    });
    this.nextBtn.addEventListener('click', () => {
      if (onNextRound) onNextRound();
    });
    this.newGameBtn.addEventListener('click', () => {
      if (onNewGame) onNewGame();
    });
  }

  reset() {
    this.photoViewer.setPhoto('');
    this.setConfirmEnabled(false);
    this.showNextButton(false);
    this.clearScoreList();
  }

  setPhoto(url) {
    this.photoViewer.setPhoto(url);
  }

  setConfirmEnabled(enabled) {
    this.confirmBtn.disabled = !enabled;
  }

  showNextButton(show) {
    this.nextBtn.style.display = show ? '' : 'none';
  }

  addRoundScore(roundNum, score, distance) {
    const li = document.createElement('li');
    li.textContent = `Round ${roundNum}: ${score} punti (distanza: ${distance.toFixed(2)} km)`;
    this.scoreListEl.appendChild(li);
  }

  clearScoreList() {
    this.scoreListEl.innerHTML = '';
  }
}
