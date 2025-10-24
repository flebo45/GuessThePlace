import { Login } from "../components/Login.js";
import { Register } from "../components/Register.js";

export function logView(container) {
    document.body.classList.add("login-register-body");

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
        main.innerHTML = "";
        Login(main);
    });

    container.querySelector("#btnShowRegister").addEventListener("click", () => {
        main.innerHTML = "";
        Register(main);
    });

    main.innerHTML = "";
    Login(main);
}