import { FollowButton } from "./FollowButton";

export class UserHeader {
    constructor(container, user, userController) {
        this.container = container;
        this.user = user;
        this.userController = userController;

        this.headerDiv = null;
        this.followButtonComponent = null;
    }

    async render() {
        this.headerDiv = document.createElement("div");
        this.headerDiv.className = "user-header";

        const nameEl = document.createElement("h2");
        nameEl.textContent = this.user.username;

        const followBtnContainer = document.createElement("div");
        followBtnContainer.className = "follow-btn-container";

        this.followButtonComponent = new FollowButton(
            followBtnContainer,
            this.userController,
            this.user.id
        );

        await this.followButtonComponent.render();


        this.headerDiv.appendChild(nameEl);
        this.headerDiv.appendChild(followBtnContainer);
        this.container.appendChild(this.headerDiv);
    }
}