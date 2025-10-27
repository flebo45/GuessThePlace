import { RegisterUserUseCase } from "../../application/usecases/RegisterUser.js";

/**
 * Renders a registration form component using Bootstrap classes.
 */
export function Register(container) {
    const root = document.createElement("div");

    // Card Bootstrap con padding e stili inline per colori custom
    root.innerHTML = `
    <div class="card p-4 shadow-sm" style="background-color: var(--card); color: var(--text); border: none;">
        <form id="register-form">
             <h2 class="text-center mb-4" style="
                background: linear-gradient(180deg, #00b3a6, #feb47b);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            ">Register</h2>
            <div class="mb-3">
                <label for="username" class="form-label" style="color: var(--muted);">Username</label>
                <input class="form-control" type="text" id="username" name="username" placeholder="yourname" required
                       style="background-color: var(--bg); color: var(--text); border-color: rgba(255,255,255,0.12);" />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label" style="color: var(--muted);">Email</label>
                <input class="form-control" type="email" id="email" name="email" placeholder="you@example.com" required
                       style="background-color: var(--bg); color: var(--text); border-color: rgba(255,255,255,0.12);" />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label" style="color: var(--muted);">Password</label>
                <input class="form-control" type="password" id="password" name="password" placeholder="●●●●●● (min 6 chars)" required
                       style="background-color: var(--bg); color: var(--text); border-color: rgba(255,255,255,0.12);" />
            </div>
            <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg">Register</button>
            </div>
        </form>
        <div id="registerMessage" class="mt-3 text-center" style="color: var(--muted);" aria-live="polite"></div>
    </div>
    `;

    const form = root.querySelector("#register-form");
    const messageDiv = root.querySelector("#registerMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "Registering..."; // Feedback immediato
        const fd = new FormData(form);
        const registerButton = form.querySelector('button[type="submit"]');
        registerButton.disabled = true; // Disabilita bottone

        try {
            await RegisterUserUseCase({ // Non serve salvare 'user'
                email: fd.get("email"),
                password: fd.get("password"),
                username: fd.get("username")
            });
            // Non mostrare messaggio, il router gestirà il redirect
            // messageDiv.textContent = "Registration successful!";
        } catch (error) {
            console.error("Registration error:", error);
            let friendlyMessage = "Registration failed. Please try again.";
            if (error.message.includes("Password")) { // Errore specifico password
                 friendlyMessage = error.message;
            } else if (error.code === 'auth/email-already-in-use') {
                 friendlyMessage = "This email is already registered. Please login or use a different email.";
            } else if (error.code === 'auth/invalid-email') {
                 friendlyMessage = "Please enter a valid email address.";
            } else if (error.code === 'auth/operation-not-allowed') {
                 friendlyMessage = "Email/password accounts are not enabled.";
            } else if (error.code === 'auth/network-request-failed') {
                 friendlyMessage = "Network error. Please check your connection.";
            }
             messageDiv.textContent = `Error: ${friendlyMessage}`;
             registerButton.disabled = false; // Riabilita in caso di errore
        }
    });

    container.appendChild(root.firstElementChild); // Aggiungi solo la card
    return root.firstElementChild;
}