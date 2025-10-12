import { GameController } from './src/application/controllers/GameController.js';
import { GameMapController } from './src/application/controllers/GameMapController.js';
import { UIController } from './src/application/controllers/UIController.js';
import { GameManager } from './src/application/controllers/GameManager.js';

const gameController = new GameController();
const gameMapController = new GameMapController('map');
const uiController = new UIController({
  photoContainerId: 'photo-container',
  confirmBtnId: 'confirm-btn',
  nextBtnId: 'next-round-btn',
  newGameBtnId: 'new-game-btn',
  scoreListId: 'score-list',
  onConfirm: () => gameManager.confirmGuess(),
  onNextRound: () => gameManager.nextRound(),
  onNewGame: () => gameManager.newGame()
});

const gameManager = new GameManager(gameController, gameMapController, uiController);


gameMapController.onMapClick(latlng => {
  gameManager.setTempGuess(latlng);
});
