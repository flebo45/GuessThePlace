import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState, AppState } from '../state/AppState.js';

export async function LoginUserUseCase({ email, password }) {
  if (!email || !password) throw new Error("Email and password required");
  const user = await UserRepository.login({ email, password });
  appState.setUser(user);
  return user;
}