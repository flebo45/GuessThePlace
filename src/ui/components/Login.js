import { LoginUserUseCase } from "../../application/usecases/LoginUser.js";
import { LogoutUseCase } from "../../application/usecases/LogoutUser.js";
import { appState } from "../../application/state/AppState.js";

export function Login(container) {
    const root = document.createElement("div");
    
    root.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
        <input type="email" id="email" name="email" placeholder="Email" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>
    <div id="loginMessage"></div>
    <div id="sessionInfo"></div>
    `;

    const form = root.querySelector("#login-form");
    const messageDiv = root.querySelector("#loginMessage");
    const sessionDiv = root.querySelector("#sessionInfo");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "";
        const fd = new FormData(form);

        try {
            const user = await LoginUserUseCase({
                email: fd.get("email"),
                password: fd.get("password")
            });
            appState.setUser(user);
            messageDiv.textContent = "Login successful!";
            updateSessionInfo();
        } catch (error) {
            console.error("Login error:", error);
            messageDiv.textContent = `Error: ${error.message}`;
        }
    });

    const updateSessionInfo = () => {
        if (appState.user) {
            sessionDiv.innerHTML = `
                <p>Logged in as: ${appState.user.email}</p>
                <button id="logoutButton">Logout</button>
            `;
            const logoutButton = sessionDiv.querySelector("#logoutButton");
            logoutButton.addEventListener("click", async () => {
                await LogoutUseCase();
                appState.clearUser();
                sessionDiv.innerHTML = "";
                messageDiv.textContent = "Logged out successfully.";
            });
        } else {
            sessionDiv.innerHTML = "<p>No user logged in.</p>";
        }
    };
    updateSessionInfo();

    container.appendChild(root);
    return root;
}
