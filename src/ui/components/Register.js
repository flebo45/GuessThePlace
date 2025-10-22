import { RegisterUserUseCase } from "../../application/usecases/RegisterUser.js";
import { appState } from "../../application/state/AppState.js";
import { doc } from "firebase/firestore";

export function Register(container) {
    const root = document.createElement("div");

    root.innerHTML = `
    <h2>Register</h2>
    <form id="register-form" class="auth-form card">
        <div class="form-field">
            <label for="username">Username</label>
            <input class="form-input" type="text" id="username" name="username" placeholder="yourname" required />
        </div>
        <div class="form-field">
            <label for="email">Email</label>
            <input class="form-input" type="email" id="email" name="email" placeholder="you@example.com" required />
        </div>
        <div class="form-field">
            <label for="password">Password</label>
            <input class="form-input" type="password" id="password" name="password" placeholder="●●●●●●" required />
        </div>
        <div class="form-actions">
            <button type="submit" class="btn">Register</button>
        </div>
    </form>
    <div id="registerMessage" class="status" aria-live="polite"></div>
    `;

    const form = root.querySelector("#register-form");
    const messageDiv = root.querySelector("#registerMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "";
        const fd = new FormData(form);

        try {
            const user = await RegisterUserUseCase({
                email: fd.get("email"),
                password: fd.get("password"),
                username: fd.get("username")
            });
            messageDiv.textContent = "Registration successful!";
        } catch (error) {
            console.error("Registration error:", error);
            messageDiv.textContent = `Error: ${error.message}`;
        }
    });

    container.appendChild(root);
    return root;
}