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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "";
        const fd = new FormData(form);

        try {
            const user = await LoginUserUseCase({
                email: fd.get("email"),
                password: fd.get("password")
            });
            messageDiv.textContent = "Login successful!";
        } catch (error) {
            console.error("Login error:", error);
            messageDiv.textContent = `Error: ${error.message}`;
        }
    });

    container.appendChild(root);
    return root;
}
