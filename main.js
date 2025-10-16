//import { GameController } from './src/application/controllers/GameController.js';
//import { GameMapController } from './src/application/controllers/GameMapController.js';
//import { UIController } from './src/application/controllers/UIController.js';
//import { GameManager } from './src/application/controllers/GameManager.js';
import { setupAuthObserver } from './src/application/controllers/AuthController.js';
import { appState } from './src/application/state/AppState.js';
import { LogView } from './src/ui/views/LogView.js';
import { gameView } from './src/ui/views/GameView.js';

const root = document.getElementById("app");

// Initialize authentication observer
async function init() {
  // Show loading immediately
  //root.innerHTML = '<p>Loading...</p>';

  // start auth observer (it will set appState appropriately)
  await setupAuthObserver(); // optional await: safe because setup handles waiting internally

  // subscribe to state changes and render
  appState.subscribe(render);
  render(appState);
}

function render(state) {
  root.innerHTML = ""; // clear DOM

  if (!state.authReady) {
    //root.innerHTML = '<p>Loading...</p>';
    return;
  }

  if (state.isAuthenticated && state.user) {
    gameView(root);
  } else {
    LogView(root);
  }
}

init();

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