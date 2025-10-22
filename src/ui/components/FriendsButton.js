import { appState } from "../../application/state/AppState.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export function FriendsButton(container) {
    container.innerHTML = `
        <div class="friends-component">
            <button id="friendsBtn" class="btn secondary session-friends">Friends</button>
        </div>
    `;

    const btn = container.querySelector('#friendsBtn');

    async function openFriendsPanel() {
        if (!appState.isAuthenticated || !appState.user) {
            alert('You must be logged in to view your friends.');
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'friends-overlay';

        const panel = document.createElement('div');
        panel.className = 'friends-panel card';

        const header = document.createElement('div');
        header.className = 'friends-header';

        const h = document.createElement('h3');
        h.textContent = 'Users you follow';
        header.appendChild(h);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn secondary';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        });
        header.appendChild(closeBtn);

        panel.appendChild(header);

        const listContainer = document.createElement('div');
        listContainer.id = 'friendsList';
        listContainer.className = 'friends-list-container';
        listContainer.textContent = 'Loading...';

        panel.appendChild(listContainer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        try {
            const following = appState.user.getFollowing ? Array.from(appState.user.getFollowing()) : (appState.user.following || []);
            const listEl = listContainer;

            if (!following || following.length === 0) {
                listEl.innerHTML = '<p>No followed users.</p>';
                return;
            }

            const promises = following.map(id => UserRepository.getUserById(id).catch(() => null));
            const users = (await Promise.all(promises)).filter(Boolean);

            const ul = document.createElement('ul');
            ul.className = 'friends-list';

            if (!users || users.length === 0) {
                following.forEach(id => {
                    const li = document.createElement('li');
                    li.className = 'friends-list-item';

                    const infoDiv = document.createElement('div');
                    infoDiv.innerHTML = `<strong>Unknown</strong><div style="font-size:0.85rem;color:var(--muted)">${id}</div>`;

                    const unfollowBtn = document.createElement('button');
                    unfollowBtn.className = 'btn secondary';
                    unfollowBtn.textContent = 'Unfollow';

                    unfollowBtn.addEventListener('click', async () => {
                        try {
                            const currentUser = appState.user;
                            if (!currentUser) return;
                            unfollowBtn.disabled = true;
                            await UserRepository.unfollowUser(currentUser.getId ? currentUser.getId() : currentUser.id, id);
                            if (currentUser.unfollow) currentUser.unfollow(id);
                            else if (Array.isArray(currentUser.following)) currentUser.following = currentUser.following.filter(i => i !== id);
                            if (li.parentNode) li.parentNode.removeChild(li);
                        } catch (err) {
                            console.error('Failed to unfollow', err);
                            alert('Could not unfollow user.');
                            unfollowBtn.disabled = false;
                        }
                    });

                    li.appendChild(infoDiv);
                    li.appendChild(unfollowBtn);
                    ul.appendChild(li);
                });
            } else {
                users.forEach(u => {
                    const li = document.createElement('li');
                    li.className = 'friends-list-item';

                    const username = u.getUsername ? u.getUsername() : (u.username || 'Unknown');
                    const email = u.getEmail ? u.getEmail() : (u.email || '');
                    const infoDiv = document.createElement('div');
                    infoDiv.innerHTML = `<strong>${username}</strong><div style="font-size:0.85rem;color:var(--muted)">${email}</div>`;

                    const unfollowBtn = document.createElement('button');
                    unfollowBtn.className = 'btn secondary';
                    unfollowBtn.textContent = 'Unfollow';

                    unfollowBtn.addEventListener('click', async () => {
                        try {
                            const currentUser = appState.user;
                            if (!currentUser) return;
                            unfollowBtn.disabled = true;
                            await UserRepository.unfollowUser(currentUser.getId ? currentUser.getId() : currentUser.id, u.getId ? u.getId() : u.id);
                            if (currentUser.unfollow) currentUser.unfollow(u.getId ? u.getId() : u.id);
                            else if (Array.isArray(currentUser.following)) currentUser.following = currentUser.following.filter(id => id !== (u.getId ? u.getId() : u.id));
                            if (li.parentNode) li.parentNode.removeChild(li);
                        } catch (err) {
                            console.error('Failed to unfollow', err);
                            alert('Could not unfollow user.');
                            unfollowBtn.disabled = false;
                        }
                    });

                    li.appendChild(infoDiv);
                    li.appendChild(unfollowBtn);
                    ul.appendChild(li);
                });
            }

            listEl.innerHTML = '';
            listEl.appendChild(ul);
        } catch (err) {
            console.error('Error loading friends', err);
            listContainer.innerHTML = '<p>Error loading friends.</p>';
        }
    }

    btn.addEventListener('click', openFriendsPanel);

    return {
        destroy() {
            btn.removeEventListener('click', openFriendsPanel);
            container.innerHTML = '';
        }
    };
}
