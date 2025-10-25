/**
 * Renders a leaderboard component inside the given container.
 * @param {HTMLElement} container - The container element to render the leaderboard into.
 * @param {Object} options - Configuration options for the leaderboard.
 * @param {string} options.title - The title of the leaderboard.
 * @param {Array} options.entries - An array of leaderboard entry objects.
 * @returns {Object} An object with an update method to refresh the leaderboard entries.
 */
export function Leaderboard(container, { title = "Leaderboard", entries = [] } = {}) {
  container.innerHTML = `
    <div class="leaderboard">
      <h3 class="leaderboard-title">${title}</h3>
      <ol class="leaderboard-list"></ol>
    </div>
  `;
  const listEl = container.querySelector(".leaderboard-list");

  function render(entries) {
    listEl.innerHTML = "";
    if (!entries || entries.length === 0) {
      listEl.innerHTML = "<li class='empty'>No results</li>";
      return;
    }
    entries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "leaderboard-item";
      li.innerHTML = `
        <div class="lb-rank">${/* rank replaced by list order */ ""}</div>
        <div class="lb-body">
          <div class="lb-user">${entry.getUsername()}</div>
          <div class="lb-score">${entry.getScore()}</div>
          <div class="lb-date">${entry.getDate().toLocaleString()}</div>
        </div>
      `;
      listEl.appendChild(li);
    });
  }

  render(entries);

  return { update(newEntries) { render(newEntries); } };
}