import { LogoutUseCase } from "../../application/usecases/LogoutUser";
import { appState } from "../../application/state/AppState.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

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

            const friendsBtn = document.createElement('button');
            friendsBtn.className = 'btn secondary session-friends';
            friendsBtn.textContent = 'Friends';
            friendsBtn.style.marginLeft = '8px';
            friendsBtn.addEventListener('click', async () => {
                if (!appState.isAuthenticated || !appState.user) {
                    alert('You must be logged in to view your friends.');
                    return;
                }

                const overlay = document.createElement('div');
                overlay.className = 'friends-overlay';
                Object.assign(overlay.style, {
                    position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000
                });

                const panel = document.createElement('div');
                panel.className = 'friends-panel card';
                Object.assign(panel.style, {
                    width: '520px', maxHeight: '80vh', overflowY: 'auto', padding: '16px', boxSizing: 'border-box'
                });

                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.justifyContent = 'space-between';

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
                listContainer.style.marginTop = '12px';
                panel.appendChild(listContainer);

                overlay.appendChild(panel);
                document.body.appendChild(overlay);

                listContainer.textContent = 'Loading...';

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
                    ul.style.listStyle = 'none';
                    ul.style.padding = '0';

                    if (!users || users.length === 0) {
                        // fallback: render entries using IDs
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
                                    if (currentUser.unfollow) {
                                        currentUser.unfollow(u.getId ? u.getId() : u.id);
                                    } else if (Array.isArray(currentUser.following)) {
                                        currentUser.following = currentUser.following.filter(id => id !== (u.getId ? u.getId() : u.id));
                                    }
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
                    listContainer.textContent = 'Error loading friends.';
                    console.error(err);
                }
            });

            // append controls (friends + logout) aligned to the right
            const rightControls = document.createElement('div');
            rightControls.style.marginLeft = 'auto';
            rightControls.style.display = 'flex';
            rightControls.style.alignItems = 'center';
            rightControls.appendChild(friendsBtn);
            rightControls.appendChild(logoutBtn);

            wrapper.appendChild(avatar);
            wrapper.appendChild(info);
            wrapper.appendChild(rightControls);

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