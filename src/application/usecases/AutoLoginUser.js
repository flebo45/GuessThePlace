import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from '../state/AppState.js';

export function AutoLoginUserUseCase() {
    UserRepository.onAuthStateChanged(async (user) => {
        if (user) {
            appState.setUser(user);
        } else {
            appState.clearUser();
        }
    });
}   