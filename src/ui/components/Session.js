import { LogoutUseCase } from "../../application/usecases/LogoutUser";
import { appState } from "../../application/state/AppState.js";

export function Session(container) {
    const root = document.createElement("div");

    root.id = "sessionComponent";

    const render = () => {
        root.innerHTML = "";

        if (appState.isAuthenticated && appState.user) {
            const user = appState.user;
            const username = user.username;

            const p = document.createElement("p");
            p.textContent = `Logged in as: ${username || user.email || 'User'}`;
            root.appendChild(p);

            const logoutBtn = document.createElement("button");
            logoutBtn.textContent = "Logout";

            logoutBtn.addEventListener("click", async () => {
                try {
                    await LogoutUseCase();
                    alert("You have been logged out.");
                } catch (error) {
                    console.error("Logout error:", error);
                    alert(`Error during logout: ${error.message}`);
                }
            });

            root.appendChild(logoutBtn);
        } else {
            const p = document.createElement("p");
            p.textContent = "Not logged in.";
            root.appendChild(p);
        }
    };
    appState.subscribe(render);
    render();
    
    container.appendChild(root);
    return root;
}