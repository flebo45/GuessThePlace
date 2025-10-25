import { LoginUserUseCase } from "../../application/usecases/LoginUser.js";
import { LogoutUseCase } from "../../application/usecases/LogoutUser.js";
import { appState } from "../../application/state/AppState.js";

/**
 * Renders a login form component inside the given container.
 * Handles user login and displays status messages.
 * 
 * @param {HTMLElement} container - The container element to render the login form into.
 * @returns {HTMLElement} The root element of the login form component.
 */
export function Login(container) {
    const root = document.createElement("div");
    
    root.innerHTML = `
    <form id="login-form" class="auth-form card">
        <div class="form-field">
            <label for="email">Email</label>
            <input class="form-input" type="email" id="email" name="email" placeholder="you@example.com" required />
        </div>
        <div class="form-field">
            <label for="password">Password</label>
            <input class="form-input" type="password" id="password" name="password" placeholder="●●●●●●" required />
        </div>
        <div class="form-actions">
            <button type="submit" class="btn">Login</button>
        </div>
    </form>
    <div id="loginMessage" class="status" aria-live="polite"></div>
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
