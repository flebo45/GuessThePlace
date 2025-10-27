import { Leaderboard } from "../components/Leaderboard";
import { LeaderboardController } from "../../application/controllers/LeaderboardController";

/**
 * Renders the Leaderboard content within a Bootstrap modal body.
 * Fetches data and populates using the Leaderboard component.
 *
 * @param {HTMLElement} modalBody - The modal body element to render into.
 * @param {HTMLElement} modalFooter - The modal footer element to add refresh button.
 */
export async function LeaderboardView(modalBody, modalFooter) {
  // Pulisci il body del modal prima di aggiungere nuovo contenuto
  modalBody.innerHTML = `
    <div class="leaderboard-page">
      <div class="row gy-3"> 
        <div class="col-md-6">
          <div id="globalLeaderboard" class="leaderboard-slot"></div>
        </div>
        <div class="col-md-6">
          <div id="friendsLeaderboard" class="leaderboard-slot"></div>
        </div>
      </div>
    </div>
  `;

  const globalSlot = modalBody.querySelector("#globalLeaderboard");
  const friendsSlot = modalBody.querySelector("#friendsLeaderboard");

  // Inizializza componenti Leaderboard (ora usano list-group)
  const globalComp = Leaderboard(globalSlot, { title: "Global Top 10 (Last 7 Days)" });
  const friendsComp = Leaderboard(friendsSlot, { title: "Friends' Best (Last 7 Days)" });

  // Funzione per caricare/aggiornare i dati
  async function loadData() {
    // Mostra uno stato di caricamento semplice
    globalComp.update([]); // Pulisci
    friendsComp.update([]);
     globalSlot.querySelector('.leaderboard-list').innerHTML = '<li class="list-group-item text-muted text-center">Loading...</li>';
     friendsSlot.querySelector('.leaderboard-list').innerHTML = '<li class="list-group-item text-muted text-center">Loading...</li>';


    // Calcola data
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);

    try {
      const [globalEntries, friendsEntries] = await Promise.all([
        LeaderboardController.getGlobal(sinceDate, 10),
        LeaderboardController.getFriends(sinceDate, 10) // Assumi che gestisca utente non loggato restituendo []
      ]);

      globalComp.update(globalEntries);
      friendsComp.update(friendsEntries);

    } catch (err) {
      console.error("Error loading leaderboards:", err);
       globalSlot.querySelector('.leaderboard-list').innerHTML = "<li class='list-group-item text-danger text-center'>Error loading global data</li>";
       friendsSlot.querySelector('.leaderboard-list').innerHTML = "<li class='list-group-item text-danger text-center'>Error loading friends data</li>";
    }
  }

  // Aggiungi bottone Refresh al footer del modal (se non esiste già)
   let refreshBtn = modalFooter.querySelector('#leaderboardRefreshBtn');
   if (!refreshBtn) {
       refreshBtn = document.createElement("button");
       refreshBtn.id = 'leaderboardRefreshBtn';
       refreshBtn.textContent = "Refresh";
       refreshBtn.className = 'btn btn-primary'; // Stile bottone primario
       refreshBtn.addEventListener("click", async () => {
           refreshBtn.disabled = true;
           refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Refreshing...';
           await loadData(); // Ricarica i dati
           refreshBtn.disabled = false;
           refreshBtn.textContent = "Refresh";
       });
       // Inserisci prima del bottone "Close" se esiste
       const closeButton = modalFooter.querySelector('[data-bs-dismiss="modal"]');
       if (closeButton) {
           modalFooter.insertBefore(refreshBtn, closeButton);
       } else {
            modalFooter.appendChild(refreshBtn);
       }
   }


  // Carica i dati iniziali
  await loadData();
}