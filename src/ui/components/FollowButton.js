export class FollowButton {
    constructor(container, userController, targetId) {
        this.container = container;
        this.userController = userController;
        this.targetId = targetId;

        this.button = null;
        this.isFollowing = false;
        this.loading = false;
    }

    async render() {
        this.container.innerHTML = "";
        this.button = document.createElement("button");
        this.button.className = "follow-btn";

        this.isFollowing = await this.userController.isFollowing(this.targetId);
        this.button.textContent = this.isFollowing ? "Unfollow" : "Follow";

        this.button.addEventListener("click", async () => {
            this._onClick()
        });

        this.container.appendChild(this.button);
    }

    async _onClick() {
        if (this.loading) return;
        this.loading = true;
        this.button.disabled = true;
        const prevText = this.button.textContent;
        this.button.textContent = "…";

        try {
            const result = await this.userController.toggleFollow(this.targetId);
            this.isFollowing = result.status === "followed";
            this.button.textContent = this.isFollowing ? "Unfollow" : "Follow";
        } catch (err) {
            console.error("Error toggling follow:", err);
            this.button.textContent = prevText; // revert
        } finally {
            this.button.disabled = false;
            this.loading = false;
        }
    }
}