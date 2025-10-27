import { LoginUserUseCase } from "../../application/usecases/LoginUser.js";

/**
 * Renders a login form component using Bootstrap classes.
 */
export function Login(container) {
    const root = document.createElement("div");
    // Card Bootstrap con padding e stili inline per colori custom
    root.innerHTML = `
    <div class="card p-4 shadow-sm" style="background-color: var(--card); color: var(--text); border: none;">
        <form id="login-form">
            <h2 class="text-center mb-4" style="
                background: linear-gradient(180deg, #00b3a6, #feb47b);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            ">Login</h2>
            <div class="mb-3">
                <label for="email" class="form-label" style="color: var(--muted);">Email</label>
                <input class="form-control" type="email" id="email" name="email" placeholder="you@example.com" required
                       style="background-color: var(--bg); color: var(--text); border-color: rgba(255,255,255,0.12);" />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label" style="color: var(--muted);">Password</label>
                <input class="form-control" type="password" id="password" name="password" placeholder="●●●●●●" required
                       style="background-color: var(--bg); color: var(--text); border-color: rgba(255,255,255,0.12);" />
            </div>
            <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg">Login</button>
            </div>
        </form>
        <div id="loginMessage" class="mt-3 text-center" style="color: var(--muted);" aria-live="polite"></div>
    </div>
    `;

    const form = root.querySelector("#login-form");
    const messageDiv = root.querySelector("#loginMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "Logging in..."; // Feedback immediato
        const fd = new FormData(form);
        const loginButton = form.querySelector('button[type="submit"]');
        loginButton.disabled = true; // Disabilita bottone durante il tentativo

        try {
            await LoginUserUseCase({ // Non serve salvare 'user' qui
                email: fd.get("email"),
                password: fd.get("password")
            });
            // Non mostrare messaggio qui, il router/stato si occuperà del redirect
            // messageDiv.textContent = "Login successful!";
            // La navigazione avverrà tramite l'observer in main.js
        } catch (error) {
            console.error("Login error:", error);
            // Mostra un messaggio di errore più user-friendly
            let friendlyMessage = "Login failed. Please check your credentials.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                 friendlyMessage = "Invalid email or password.";
            } else if (error.code === 'auth/too-many-requests') {
                 friendlyMessage = "Access temporarily disabled due to too many failed login attempts. Please reset your password or try again later.";
            } else if (error.code === 'auth/network-request-failed') {
                 friendlyMessage = "Network error. Please check your connection and try again.";
            }
             messageDiv.textContent = `Error: ${friendlyMessage}`;
            loginButton.disabled = false; // Riabilita bottone in caso di errore
        }
        // Non riabilitare il bottone in caso di successo, avverrà il redirect
    });

    container.appendChild(root.firstElementChild); // Aggiungi solo la card
    return root.firstElementChild;
}