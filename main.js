import { setupAuthObserver } from './src/application/controllers/AuthController.js';
import { appState } from './src/application/state/AppState.js';
import { logView } from './src/ui/views/LogView.js';
import { gameView } from './src/ui/views/GameView.js';
import Router from './src/ui/router/Router.js';

const root = document.getElementById("app");

// Setup Router
const router = new Router('app');

// Define routes using render functions (no external HTML templates)
router.addRoute('/', {
  render: async (r) => {
    // Decide based on auth state
    if (!appState.authReady) {
      root.innerHTML = '';
      return; // will re-run via subscription
    }
    if (appState.isAuthenticated && appState.user) {
      await gameView(root);
    } else {
      await logView(root, 'login', router);
    }
  }
});

router.addRoute('/login', {
  render: async () => logView(root, 'login', router)
});

router.addRoute('/register', {
  render: async () => logView(root, 'register', router)
});

router.addRoute('/game', {
  render: async () => gameView(root, router, { mode: 'home' })
});
router.addRoute('/game/play', {
  render: async () => gameView(root, router, { mode: 'play' })
});
router.addRoute('/game/scoreboard', {
  render: async () => gameView(root, router, { mode: 'scoreboard' })
});

// Initialize authentication observer and wire state-driven navigation
async function init() {
  await setupAuthObserver();

  // Whenever appState changes, navigate accordingly
  appState.subscribe(async (state) => {
    if (!state.authReady) return;
    const p = window.location.pathname;
    if (state.isAuthenticated && state.user) {
      // If authenticated and on auth pages, go to game
      if (p === '/login' || p === '/register' || p === '/') {
        await router.navigate('/game', { replace: true });
        return;
      }
    } else {
      // Not authenticated: if not on auth pages, go to login
      if (p !== '/login' && p !== '/register') {
        await router.navigate('/login', { replace: true });
        return;
      }
    }
    // Otherwise, just re-render current route
    await router.init();
  });

  await router.init();
}

init();




