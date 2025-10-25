import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from "../state/AppState.js";

/**
 * Use case for logging out the current user.
 * Clears the user information from the application state.
 */
export async function LogoutUseCase() {
  await UserRepository.logout();
  appState.clearUser();
}