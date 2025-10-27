/**
 * Renders a leaderboard component using Bootstrap list groups.
 */
export function Leaderboard(container, { title = "Leaderboard", entries = [] } = {}) {
    // container ora è lo slot DENTRO il modal body o dove vuoi renderizzarlo
    container.innerHTML = `
      <div class="leaderboard">
        <h3 class="leaderboard-title">${title}</h3>
        <ul class="leaderboard-list list-group list-group-flush"></ul>
      </div>
    `;
    const listEl = container.querySelector(".leaderboard-list");

    function render(currentEntries) {
        listEl.innerHTML = ""; // Pulisci la lista
        if (!currentEntries || currentEntries.length === 0) {
            listEl.innerHTML = "<li class='list-group-item text-muted text-center empty'>No results yet</li>";
            return;
        }

        // Ordina le entry per punteggio (decrescente) se non già ordinate
        // Assicurati che le entry abbiano un metodo getScore()
         currentEntries.sort((a, b) => b.getScore() - a.getScore());

        currentEntries.forEach((entry, index) => {
            const li = document.createElement("li");
            // Aggiungi classi Bootstrap e custom
            li.className = "leaderboard-item list-group-item"; // Usa list-group-item

            // Formatta data (esempio)
            const dateFormatted = entry.getDate()
             ? entry.getDate().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
             : 'N/A';

            // Contenuto dell'elemento della lista
            li.innerHTML = `
              <div class="lb-body">
                  <span class="lb-user" title="${entry.getUsername()}">${entry.getUsername() || 'Unknown'}</span>
                  <span class="lb-score">${entry.getScore()} pts</span>
                  <span class="lb-date">${dateFormatted}</span>
              </div>
            `;
            listEl.appendChild(li);
        });
    }

    render(entries); // Render iniziale

    // Metodo per aggiornare la lista
    return {
        update(newEntries) {
            render(newEntries);
        }
    };
}