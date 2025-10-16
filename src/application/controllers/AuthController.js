import { User } from "../../domain/entities/User.js";
import { appState } from '../state/AppState.js';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../infrastructure/firebase/firebase-config.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export async function setupAuthObserver() {

    await auth.authStateReady();

    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const profile = await UserRepository.getUserById(firebaseUser.uid);
            const userDomain = profile ?? User.fromFirebaseUser(firebaseUser);
            appState.setUser(userDomain);
        } else {
            appState.clearUser();
        }

        if (!appState.authReady) {
            appState.setAuthReady();
        }
    });
}   