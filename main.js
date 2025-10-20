import { GameController } from './src/application/controllers/GameController.js';
import { GameMapController } from './src/application/controllers/GameMapController.js';
import { UIView } from './src/ui/views/UIViews.js';
import { GameManager } from './src/application/controllers/GameManager.js';

import { setupAuthObserver } from './src/application/controllers/AuthController.js';
import { appState } from './src/application/state/AppState.js';
import { logView } from './src/ui/views/LogView.js';
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
    logView(root);
  }
}

init();




