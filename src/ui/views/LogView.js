import { Login } from "../components/Login.js";
import { Register } from "../components/Register.js";

// initialTab: 'login' | 'register'
// router (optional): if provided, switches URL to /login or /register on tab buttons
export function logView(container, initialTab = 'login', router) {  //aggiunto inizialTab e router come parametro opzionale
    // Ensure only the auth page body class is active
    document.body.classList.remove("body");
    document.body.classList.add("login-register-body");  // per lo stile

    container.innerHTML = `
    <div class="auth-center-wrapper">
        <div class="auth-choices">
            <button id="btnShowLogin" class="btn">Login</button>
            <button id="btnShowRegister" class="btn">Register</button>
        </div>
        <div id="main"></div>
    </div>    
    `;

    
    const main = container.querySelector("#main");
    container.querySelector("#btnShowLogin").addEventListener("click", () => {
        if (router) {
            router.navigate('/login');  // aggiunto l'if
            return;
        }
        main.innerHTML = "";
        Login(main);
    });

    container.querySelector("#btnShowRegister").addEventListener("click", () => {
        if (router) {
            router.navigate('/register');  // aggiunto l'if
            return;
        }
        main.innerHTML = "";
        Register(main);
    });

    main.innerHTML = "";
    if (initialTab === 'register') { //aggiuntio l'if-else
        Register(main);
    } else {
        Login(main);
    }
}