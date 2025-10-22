import { LogoutUseCase } from "../../application/usecases/LogoutUser";
import { appState } from "../../application/state/AppState.js";

export function Session(container) {
    const root = document.createElement("div");

    root.id = "sessionComponent";
    const render = () => {
        root.innerHTML = "";

        if (appState.isAuthenticated && appState.user) {
            const user = appState.user;
            const username = user.username || user.email || 'User';

            const wrapper = document.createElement('div');
            wrapper.className = 'session-wrapper card';

            const avatar = document.createElement('div');
            avatar.className = 'session-avatar';
            avatar.textContent = username.charAt(0).toUpperCase();

            const info = document.createElement('div');
            info.className = 'session-info';
            const label = document.createElement('div');
            label.className = 'session-label';
            label.textContent = 'Logged in as:';
            const name = document.createElement('div');
            name.className = 'session-name';
            name.textContent = username;

            info.appendChild(label);
            info.appendChild(name);

            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn secondary session-logout';
            logoutBtn.textContent = 'Logout';
            logoutBtn.addEventListener('click', async () => {
                try {
                    await LogoutUseCase();
                    alert('You have been logged out.');
                } catch (error) {
                    console.error('Logout error:', error);
                    alert(`Error during logout: ${error.message}`);
                }
            });

            wrapper.appendChild(avatar);
            wrapper.appendChild(info);
            wrapper.appendChild(logoutBtn);

            root.appendChild(wrapper);
        } else {
            const p = document.createElement('p');
            p.textContent = 'Not logged in.';
            root.appendChild(p);
        }
    };
    appState.subscribe(render);
    render();
    
    container.appendChild(root);
    return root;
}