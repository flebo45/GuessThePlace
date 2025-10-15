import { Session } from "../components/Session";

export function gameView(root) {
    root.innerHTML = `
    <div>
        <h2>Game View</h2>
        <div id="sessionContainer"></div>
        <p>Welcome to the game! Here you can start playing.</p>
        <!-- Game content goes here -->
    </div>
    `;

    const sessionContainer = root.querySelector("#sessionContainer");
    Session(sessionContainer);
}
