import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from "../state/AppState.js";

export async function RegisterUserUseCase({ email, password, username }) {
  // Here you may apply validation rules, e.g. password length
  if (!email || !password) throw new Error("Email and password required");
  if (password.length < 6) throw new Error("Password must be >= 6 chars");
  const user = await UserRepository.register({ email, password, username });
  appState.setUser(user);
  return user;
}