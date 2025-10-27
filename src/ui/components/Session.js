import { LogoutUseCase } from "../../application/usecases/LogoutUser";
import { appState } from "../../application/state/AppState.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

/**
 * Session component using Bootstrap classes. Displays user info, logout, and friends modal button.
 */
export function Session(container) {
    const root = document.createElement("div");
    root.id = "sessionComponent";

    // Funzione per aprire il modal degli amici e caricarne il contenuto
    async function openFriendsModal() {
        if (!appState.isAuthenticated || !appState.user) {
            alert('You must be logged in to view your friends.');
            return;
        }

        const modalElement = document.getElementById('friendsModal');
        const modalBody = modalElement.querySelector('#friendsModalBody');
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

        modalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>'; // Bootstrap spinner
        modal.show(); // Mostra il modal

        try {
            const currentUser = appState.user;
            const following = currentUser.getFollowing ? Array.from(currentUser.getFollowing()) : (currentUser.following || []);

            if (!following || following.length === 0) {
                modalBody.innerHTML = '<p class="text-muted text-center">You are not following anyone yet.</p>';
                return;
            }

            // Fetch user details for followed IDs
            const promises = following.map(id => UserRepository.getUserById(id).catch(() => ({ id, username: 'Unknown User (error)' }))); // Gestisci errori per singolo utente
            const users = (await Promise.all(promises)); // Non filtrare null, mostra anche gli errori

            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush'; // Usa list group Bootstrap

            users.forEach(u => {
                 if (!u) return; // Salta se l'utente non è stato trovato (o errore gestito sopra)

                 const li = document.createElement('li');
                 li.className = 'list-group-item d-flex justify-content-between align-items-center';

                 const username = u.getUsername ? u.getUsername() : (u.username || 'Unknown');
                 const emailOrId = u.getEmail ? u.getEmail() : (u.email || u.id || ''); // Mostra email o ID se username non c'è

                 const infoDiv = document.createElement('div');
                 infoDiv.innerHTML = `<strong>${username}</strong><div class="text-muted" style="font-size: 0.85rem;">${emailOrId}</div>`;

                 const unfollowBtn = document.createElement('button');
                 unfollowBtn.className = 'btn btn-outline-danger btn-sm'; // Bottone piccolo e rosso
                 unfollowBtn.innerHTML = '<i class="bi bi-person-dash-fill"></i> Unfollow'; // Icona Bootstrap
                 unfollowBtn.dataset.userId = u.getId ? u.getId() : u.id;

                 unfollowBtn.addEventListener('click', async (e) => {
                     const targetId = e.currentTarget.dataset.userId;
                     if (!targetId) return;

                     try {
                        const currentUser = appState.user; // Ricontrolla stato
                         if (!currentUser) return;
                         unfollowBtn.disabled = true;
                         unfollowBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'; // Spinner

                         await UserRepository.unfollowUser(currentUser.getId ? currentUser.getId() : currentUser.id, targetId);

                         // Aggiorna stato locale (potrebbe essere già aggiornato dall'observer, ma per sicurezza)
                         if (currentUser.unfollow) currentUser.unfollow(targetId);
                         else if (Array.isArray(currentUser.following)) currentUser.following = currentUser.following.filter(id => id !== targetId);

                         // Rimuovi l'elemento dalla lista UI
                         li.remove();

                         // Se la lista diventa vuota, mostra messaggio
                         if (ul.children.length === 0) {
                             modalBody.innerHTML = '<p class="text-muted text-center">You are not following anyone anymore.</p>';
                         }

                     } catch (err) {
                         console.error('Failed to unfollow', err);
                         alert('Could not unfollow user.');
                         // Ripristina bottone in caso di errore
                         unfollowBtn.disabled = false;
                         unfollowBtn.innerHTML = '<i class="bi bi-person-dash-fill"></i> Unfollow';
                     }
                 });

                 li.appendChild(infoDiv);
                 li.appendChild(unfollowBtn);
                 ul.appendChild(li);
            });

            modalBody.innerHTML = ''; // Pulisci lo spinner/messaggio
            modalBody.appendChild(ul);

        } catch (err) {
            console.error('Error loading friends', err);
            modalBody.innerHTML = '<div class="alert alert-danger">Error loading friends list.</div>';
        }
    }


    const render = () => {
        root.innerHTML = ""; // Pulisci il contenuto precedente

        if (appState.isAuthenticated && appState.user) {
            const user = appState.user;
            const username = user.username || user.email || 'User';

            // Wrapper con classi Bootstrap Flexbox
            const wrapper = document.createElement('div');
            wrapper.className = 'd-flex align-items-center p-1 rounded'; // Riduci padding

            // Avatar
            const avatar = document.createElement('div');
            avatar.className = 'rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0'; // Aggiunto flex-shrink-0
            avatar.style.width = '38px';
            avatar.style.height = '38px';
            avatar.style.background = 'linear-gradient(135deg,var(--accent),var(--accent-2))';
            avatar.style.color = '#021012';
            avatar.style.fontWeight = 'bold';
            avatar.style.fontSize = '1rem';
            avatar.textContent = username.charAt(0).toUpperCase();

            // Info Utente
            const info = document.createElement('div');
            info.className = 'session-info me-auto'; // me-auto per spingere i bottoni a destra
            const label = document.createElement('div');
            label.className = 'session-label d-none d-md-block'; // Nascondi etichetta su schermi piccoli
            label.textContent = 'Logged in as:';
            const name = document.createElement('div');
            name.className = 'session-name text-truncate'; // Tronca nome se troppo lungo
            name.textContent = username;
            name.title = username; // Tooltip con nome completo

            info.appendChild(label);
            info.appendChild(name);

            // Bottone Amici (apre il modal)
            const friendsBtn = document.createElement('button');
            friendsBtn.className = 'btn btn-outline-light btn-sm me-2'; // me-2 per spazio
            friendsBtn.innerHTML = '<i class="bi bi-people-fill"></i><span class="d-none d-md-inline ms-1">Friends</span>'; // Icona + Testo (testo nascosto su mobile)
            friendsBtn.title = "Show followed users"; // Tooltip
            friendsBtn.setAttribute('data-bs-toggle', 'modal'); // Attributo Bootstrap
            friendsBtn.setAttribute('data-bs-target', '#friendsModal'); // ID del modal
            friendsBtn.addEventListener('click', openFriendsModal); // Carica contenuto quando si clicca

            // Bottone Logout
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-outline-light btn-sm';
            logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i><span class="d-none d-md-inline ms-1">Logout</span>';
            logoutBtn.title = "Logout";
            logoutBtn.addEventListener('click', async () => {
                logoutBtn.disabled = true; // Disabilita durante il logout
                logoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                try {
                    await LogoutUseCase();
                    // Non serve alert, l'observer gestirà il cambio UI
                } catch (error) {
                    console.error('Logout error:', error);
                    alert(`Error during logout: ${error.message}`);
                    logoutBtn.disabled = false; // Riabilita in caso di errore
                    logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i><span class="d-none d-md-inline ms-1">Logout</span>';
                }
            });

            // Assembla
            wrapper.appendChild(avatar);
            wrapper.appendChild(info);
            wrapper.appendChild(friendsBtn);
            wrapper.appendChild(logoutBtn);
            root.appendChild(wrapper);

        } else {
            // Se non loggato, mostra un placeholder o nulla
            // root.innerHTML = '<span class="navbar-text text-muted">Not logged in</span>';
        }
    };

    appState.subscribe(render); // Aggiorna quando lo stato cambia
    render(); // Renderizza lo stato iniziale
    container.appendChild(root); // Aggiungi al contenitore fornito
    return root;
}