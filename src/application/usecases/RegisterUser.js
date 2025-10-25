import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from "../state/AppState.js";

/**
 * Use case for registering a new user with email, password, and username.
 * Updates the application state with the newly registered user's information.
 * 
 * @param {Object} params - The parameters for registration.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 * @param {string} params.username - The user's chosen username.
 * @returns {Promise<Object>} - A promise that resolves to the registered user object.
 * @throws {Error} - Throws an error if email or password is missing or invalid.
 */
export async function RegisterUserUseCase({ email, password, username }) {
  // Here you may apply validation rules, e.g. password length
  if (!email || !password) throw new Error("Email and password required");
  if (password.length < 6) throw new Error("Password must be >= 6 chars");
  const user = await UserRepository.register({ email, password, username });
  appState.setUser(user);
  return user;
}