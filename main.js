//import { GameController } from './src/application/controllers/GameController.js';
//import { GameMapController } from './src/application/controllers/GameMapController.js';
//import { UIController } from './src/application/controllers/UIController.js';
//import { GameManager } from './src/application/controllers/GameManager.js';
import { setupAuthObserver } from './src/application/controllers/AuthController.js';
import { appState } from './src/application/state/AppState.js';
import { LogView } from './src/ui/views/LogView.js';
import { AutoLoginUserUseCase } from './src/application/usecases/AutoLoginUser.js';

const root = document.getElementById("app");
root.innerHTML = "<p>Loading...</p>";

AutoLoginUserUseCase();

// Initialize authentication observer
setupAuthObserver();

LogView(root);


/*
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
*/