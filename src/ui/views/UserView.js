import { UserHeader } from "../components/UserHeader";
import { GameHistory } from "../components/GameHistory";

export class UserView {
    constructor(container, userController) {
        this.container = container;
        this.userController = userController;
    }

    async render(userId) {
        this.container.innerHTML = "";

        const user = await this.userController.getUserById(userId);
        const games = await this.userController.getUserGamesHistory(userId);

        const userHeader = new UserHeader(
            this.container,
            user,
            this.userController
        );

        await userHeader.render();

        const historyContainer = document.createElement("div");
        historyContainer.className = "game-history-container";
        this.container.appendChild(historyContainer);

        const historyComponent = new GameHistory(
            historyContainer, 
            games
        );
        historyComponent.render()
    }
}