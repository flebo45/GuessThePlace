import { appState } from "../../application/state/AppState.js";
import { Login } from "../components/Login.js";
import { Register } from "../components/Register.js";

export function LogView(container) {
    container.innerHTML = `
    <div>
        <button id="btnShowLogin">Login</button>
        <button id="btnShowRegister">Register</button>
    </div>
    <div id="main"></div>
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