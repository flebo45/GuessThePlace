// src/ui/components/ControlsView.js
export class ControlsView {
  constructor({ confirmBtnId, nextBtnId, newGameBtnId, onConfirm, onNextRound, onNewGame }) {
    this.confirmBtn = typeof confirmBtnId === 'string' ? document.getElementById(confirmBtnId) : confirmBtnId;
    this.nextBtn = typeof nextBtnId === 'string' ? document.getElementById(nextBtnId) : nextBtnId;
    this.newGameBtn = typeof newGameBtnId === 'string' ? document.getElementById(newGameBtnId) : newGameBtnId;

    this.confirmBtn.disabled = true;
    this.nextBtn.style.display = 'none';

    if (onConfirm) this.confirmBtn.addEventListener('click', onConfirm);
    if (onNextRound) this.nextBtn.addEventListener('click', onNextRound);
    if (onNewGame) this.newGameBtn.addEventListener('click', onNewGame);
  }

  setConfirmEnabled(enabled) {
    this.confirmBtn.disabled = !enabled;
  }

  showNextButton(show) {
    this.nextBtn.style.display = show ? '' : 'none';
  }

  reset() {
    this.setConfirmEnabled(false);
    this.showNextButton(false);
  }
}
