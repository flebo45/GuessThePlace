import { UserSearchComponent } from "../components/UserSearchComponent";

export function UserSearchView(root) {
    const container = document.createElement("div");
    root.appendChild(container);

    UserSearchComponent(container, {
        onSelect(user) {
            console.log("Selected user: ", user);
        }
    });
}