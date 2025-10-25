/**
 * GameHistory component displays the history of games played by the user.
 * It shows a list of past games with their scores and dates.
 */
export class GameHistory {
    constructor(container, games) {
        this.container = container;
        this.games = games;
    }

    /**
     * Renders the game history.
     */
    render() {
        const historyDiv = document.createElement("div");
        historyDiv.className = "game-history";

        const title = document.createElement("h3");
        title.textContent = "Game History"
        historyDiv.appendChild(title);

        if (this.games.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No games yet.";
            historyDiv.appendChild(empty);
        } else {
            const list = document.createElement("ul");
            this.games.forEach((game) => {
                const li = document.createElement("li");
                li.textContent = `Score: ${game.totalScore} | Date: ${game.date}`;
                list.appendChild(li)
            });
            historyDiv.appendChild(list);
        }
        this.container.appendChild(historyDiv);
    }
}