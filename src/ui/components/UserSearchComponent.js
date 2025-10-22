import { UserController } from "../../application/controllers/UserController";

export function UserSearchComponent(container, { onSelect} = {}) {
    container.innerHTML = `
        <div class="user-search">
        <input id="userSearchInput" type="search" placeholder="Search users by name..." autocomplete="off" />
        <div id="userSearchResults" class="results"></div>
        </div>
    `;

    const input = container.querySelector("#userSearchInput");
    const resultsContainer = container.querySelector("#userSearchResults");
    
    let timeoutId = null;

    input.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        clearTimeout(timeoutId);

        if (!value) {
            resultsContainer.innerHTML = "";
            return;
        }

        timeoutId = setTimeout(async () => {
            try {
                const users = await UserController.searchPrefix(value, 5);
                renderResults(users);
            } catch (error) {
                console.error("Error searching users: ", error);
                resultsContainer.innerHTML = "<div class='error'>Error searching users.</div>";
            }
        }, 250);
    });

    function renderResults(users) {
        if (!users || users.length === 0) {
            resultsContainer.innerHTML = "<div class='no-results'>No users found.</div>";
            return;
        }
        resultsContainer.innerHTML = "";
        
        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "user-result";
            const nameBox = document.createElement('div');
            nameBox.className = 'user-name-box';
            nameBox.textContent = user.getUsername();
            userDiv.appendChild(nameBox);
            userDiv.addEventListener("click", () => {
                if (onSelect) onSelect(user);
            });
            resultsContainer.appendChild(userDiv);
        });

    }

    return {
        destroy() {
            input.removeEventListener("input", null);
            container.innerHTML = "";
        }
    };
}