import { RegisterUserUseCase } from "../../application/usecases/RegisterUser.js";
import { appState } from "../../application/state/AppState.js";
import { doc } from "firebase/firestore";

export function Register(container) {
    const root = document.createElement("div");

    root.innerHTML = `
    <h2>Register</h2>
    <form id="register-form">
        <input type="text" id="username" name="username" placeholder="Username" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
    </form>
    <div id="registerMessage"></div>
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