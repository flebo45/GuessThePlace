import { appState } from "../../application/state/AppState.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

export function FriendsButton(container) {
    container.innerHTML = `
        <div class="friends-component">
            <button id="friendsBtn" class="btn secondary">Friends</button>
        </div>
    `;

    const btn = container.querySelector('#friendsBtn');

    async function openFriendsPanel() {
        if (!appState.isAuthenticated || !appState.user) {
            alert('You must be logged in to view your friends.');
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'friends-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '4000';

        const panel = document.createElement('div');
        panel.className = 'friends-panel card';
        panel.style.width = '520px';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.padding = '16px';

        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <h3>Users you follow</h3>
                <button id="closeFriends" class="btn secondary">Close</button>
            </div>
            <div id="friendsList" style="margin-top:12px">Loading...</div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        overlay.querySelector('#closeFriends').addEventListener('click', () => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        });

        // Fetch followed users in parallel
        try {
            const following = appState.user.getFollowing ? Array.from(appState.user.getFollowing()) : (appState.user.following || []);
            const listEl = overlay.querySelector('#friendsList');
            console.debug('Friends panel opening, following IDs:', following);
            if (!following || following.length === 0) {
                listEl.innerHTML = '<p>No followed users.</p>';
                return;
            }

            const promises = following.map(id => UserRepository.getUserById(id).catch(e => null));
            const users = (await Promise.all(promises)).filter(Boolean);
            console.debug('Fetched user profiles for following:', users);

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';

            if (!users || users.length === 0) {
                // fallback: render entries using IDs if profile fetch failed
                following.forEach(id => {
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.justifyContent = 'space-between';
                    li.style.padding = '8px';
                    li.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
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
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.justifyContent = 'space-between';
                    li.style.padding = '8px';
                    li.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
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
                            // update local appState user object if possible
                            if (currentUser.unfollow) {
                                currentUser.unfollow(u.getId ? u.getId() : u.id);
                            } else if (Array.isArray(currentUser.following)) {
                                currentUser.following = currentUser.following.filter(id => id !== (u.getId ? u.getId() : u.id));
                            }
                            // remove the list item from UI
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

            const listContainer = overlay.querySelector('#friendsList');
            listContainer.innerHTML = '';
            listContainer.appendChild(ul);

        } catch (err) {
            console.error('Error loading friends', err);
            const listEl = overlay.querySelector('#friendsList');
            if (listEl) listEl.innerHTML = '<p>Error loading friends.</p>';
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
