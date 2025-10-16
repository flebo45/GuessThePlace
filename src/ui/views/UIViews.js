// src/ui/views/UIView.js

import { PhotoViewer } from '../components/PhotoViewer.js';
import { ControlsView } from '../components/ControlsView.js';
import { ScoreboardView } from '../components/ScoreboardView.js';

export class UIView {
  constructor({ photoContainerId, confirmBtnId, nextBtnId, newGameBtnId, scoreListId, onConfirm, onNextRound, onNewGame }) {
    // Keep PhotoViewer as-is
    this.photoViewer = new PhotoViewer(photoContainerId);

    // Delegate controls and scoreboard responsibilities to smaller components
    this.controls = new ControlsView({ confirmBtnId, nextBtnId, newGameBtnId, onConfirm, onNextRound, onNewGame });
    this.scoreboard = new ScoreboardView({ scoreListId });
    this.statusEl = typeof arguments[0].statusId === 'string' ? document.getElementById(arguments[0].statusId) : null;
  }

  reset() {
    this.photoViewer.setPhoto('');
    this.controls.reset();
    this.scoreboard.clear();
    this.clearStatus();
  }

  setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  clearStatus() {
    if (this.statusEl) this.statusEl.textContent = '';
  }

  setPhoto(url) {
    this.photoViewer.setPhoto(url);
  }

  setConfirmEnabled(enabled) {
    this.controls.setConfirmEnabled(enabled);
  }

  showNextButton(show) {
    this.controls.showNextButton(show);
  }

  addRoundScore(roundNum, score, distance) {
    this.scoreboard.addRoundScore(roundNum, score, distance);
  }

  clearScoreList() {
    this.scoreboard.clear();
  }

  // View-specific method: display end-of-game UI. Keep presentation here.
  showGameOver(totalScore) {
    alert(`Gioco finito! Punteggio totale: ${totalScore}`);
  }
}
