import { UserSearchComponent } from "../components/UserSearchComponent";
import { UserView } from "./UserView";
import { UserController } from "../../application/controllers/UserController";

/**
 * Renders the User Search view, allowing users to search for other users
 * and view their profiles.
 * 
 * @param {HTMLElement} root - The root container to render the user search view into.
 */
export function UserSearchView(root) {
    const userController = new UserController();

    const container = document.createElement("div");
    root.appendChild(container);

    const profileContainer = document.createElement("div");
    profileContainer.className = "user-profile-section";

    container.appendChild(profileContainer);

    UserSearchComponent(container, {
        async onSelect(user) {
            console.log("Selected user: ", user);

            const userView = new UserView(profileContainer, userController);
            await userView.render(user.id);
        },
    });
}