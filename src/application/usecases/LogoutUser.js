import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";
import { appState } from "../state/AppState.js";

export async function LogoutUseCase() {
  await UserRepository.logout();
  appStateclearUser();
}