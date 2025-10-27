import { Login } from "../components/Login.js";
import { Register } from "../components/Register.js";

/**
 * Renders the log view with login and registration options.
 * Allows switching between login and registration forms using Bootstrap classes.
 */
export function logView(container, initialTab = 'login', router) {
    // Ensure only the auth page body class is active
    document.body.className = 'login-register-body'; // Usa la classe specifica per lo sfondo e centraggio

    container.innerHTML = `
    <div class="auth-center-wrapper">
        <div class="mb-4 d-flex justify-content-center">
            <button id="btnShowLogin" class="btn btn-primary me-2">Login</button>
            <button id="btnShowRegister" class="btn btn-secondary">Register</button>
        </div>
        <div id="main"></div>
    </div>
    `;

    const main = container.querySelector("#main");
    const loginBtn = container.querySelector("#btnShowLogin");
    const registerBtn = container.querySelector("#btnShowRegister");

    const showLogin = () => {
        main.innerHTML = "";
        Login(main); // Il componente Login ora usa classi Bootstrap
        loginBtn.classList.add('active'); // Opzionale: evidenzia bottone attivo
        registerBtn.classList.remove('active');
    };

    const showRegister = () => {
        main.innerHTML = "";
        Register(main); // Il componente Register ora usa classi Bootstrap
        registerBtn.classList.add('active'); // Opzionale: evidenzia bottone attivo
        loginBtn.classList.remove('active');
    };

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Previeni comportamento link se fossero <a>
        if (router) {
            router.navigate('/login');
        } else {
            showLogin();
        }
    });

    registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (router) {
            router.navigate('/register');
        } else {
            showRegister();
        }
    });

    // Mostra il tab iniziale
    if (initialTab === 'register') {
        showRegister();
    } else {
        showLogin();
    }
}