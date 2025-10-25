import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState, AppState } from '../state/AppState.js';

/**
 * Use case for logging in a user with email and password.
 * Updates the application state with the authenticated user's information.
 * 
 * @param {Object} params - The parameters for login.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to the logged-in user object.
 * @throws {Error} - Throws an error if email or password is missing.
 */
export async function LoginUserUseCase({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const user = await UserRepository.login({ email, password });
  appState.setUser(user);
  //Add session persistance
  
  return user;
}