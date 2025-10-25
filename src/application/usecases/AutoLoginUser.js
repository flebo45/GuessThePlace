import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from '../state/AppState.js';

/**
 * Use case for automatically logging in a user based on existing authentication state.
 * Listens for authentication state changes and updates the application state accordingly.
 */
export function AutoLoginUserUseCase() {
    UserRepository.onAuthStateChanged(async (user) => {
        if (user) {
            appState.setUser(user);
        } else {
            appState.clearUser();
        }
    });
}   