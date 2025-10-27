/**
 * FollowButton component using Bootstrap button classes.
 */
export class FollowButton {
    constructor(container, userController, targetId) {
        this.container = container;
        this.userController = userController;
        this.targetId = targetId;

        this.button = null;
        this.isFollowing = false;
        this.loading = false;
    }

    /**
     * Renders the follow button and sets up event listeners.
     */
    async render() {
        this.container.innerHTML = ""; // Clear container
        this.button = document.createElement("button");
        // Usa classi Bootstrap: btn, btn-sm, e cambia tra btn-outline-primary e btn-primary
        this.button.className = "follow-btn btn btn-sm"; // Classe base

        try {
            this.isFollowing = await this.userController.isFollowing(this.targetId);
            this.updateButtonState(); // Imposta stile iniziale
        } catch (error) {
             console.error("Error checking follow status:", error);
             this.button.textContent = "Error";
             this.button.disabled = true;
             this.button.classList.add('btn-outline-secondary'); // Stile errore/disabilitato
        }


        this.button.addEventListener("click", () => this._onClick()); // Non serve async qui

        this.container.appendChild(this.button);
    }

     /** Aggiorna testo e classi del bottone in base allo stato */
     updateButtonState() {
        if (!this.button) return;
        if (this.isFollowing) {
            this.button.textContent = "Unfollow";
            this.button.classList.remove('btn-outline-primary');
            this.button.classList.add('btn-primary'); // Bottone pieno quando segui
        } else {
            this.button.textContent = "Follow";
            this.button.classList.remove('btn-primary');
            this.button.classList.add('btn-outline-primary'); // Bottone outline quando non segui
        }
    }


    /**
     * Handles the click event on the follow button.
     */
    async _onClick() {
        if (this.loading || !this.button || this.button.disabled) return; // Controllo extra

        this.loading = true;
        this.button.disabled = true;
        const originalText = this.button.textContent; // Salva testo originale
        // Mostra uno spinner Bootstrap
        this.button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        try {
            const result = await this.userController.toggleFollow(this.targetId);
            this.isFollowing = result.status === "followed";
            this.updateButtonState(); // Aggiorna stile e testo
        } catch (err) {
            console.error("Error toggling follow:", err);
            // Ripristina stato precedente in caso di errore
             this.button.textContent = originalText;
             // Potresti voler mostrare un messaggio di errore all'utente qui
        } finally {
            this.button.disabled = false;
            this.loading = false;
             // Assicurati che il testo sia corretto dopo l'operazione o l'errore
             if (!this.button.textContent.includes('Follow')) { // Se c'è ancora lo spinner
                this.updateButtonState();
             }
        }
    }
}