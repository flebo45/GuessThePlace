import { Leaderboard } from "../components/Leaderboard";
import { LeaderboardController } from "../../application/controllers/LeaderboardController";

export async function LeaderboardView(root) {
  root.innerHTML = `
    <div class="leaderboard-page">
      <h2>Leaderboards</h2>
      <div class="leaderboards-grid">
        <div id="globalLeaderboard" class="leaderboard-slot"></div>
        <div id="friendsLeaderboard" class="leaderboard-slot"></div>
      </div>
      <div class="leaderboard-footer" style="display:flex;justify-content:flex-end;margin-top:12px"></div>
    </div>
  `;

  const globalSlot = root.querySelector("#globalLeaderboard");
  const friendsSlot = root.querySelector("#friendsLeaderboard");

  // initial placeholders
  const globalComp = Leaderboard(globalSlot, { title: "Global - top 10 (last 7 days)", entries: [] });
  const friendsComp = Leaderboard(friendsSlot, { title: "Friends - top game per friend (last 7 days)", entries: [] });

  // compute since date = now - 7 days
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 7);

  // fetch and populate
  try {
    const [globalEntries, friendsEntries] = await Promise.all([
      LeaderboardController.getGlobal(sinceDate, 10),
      LeaderboardController.getFriends(sinceDate, 10)
    ]);

    globalComp.update(globalEntries);
    friendsComp.update(friendsEntries);
  } catch (err) {
    console.error("Error loading leaderboards:", err);
    globalSlot.innerHTML = "<div class='error'>Unable to load global leaderboard</div>";
    friendsSlot.innerHTML = "<div class='error'>Unable to load friends leaderboard</div>";
  }

  // Add a "Refresh" button in the footer
  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "Refresh";
  refreshBtn.className = 'leaderboard-refresh';
  const footer = root.querySelector('.leaderboard-footer');
  if (footer) footer.appendChild(refreshBtn);
  refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    try {
      const [g, f] = await Promise.all([
        LeaderboardController.getGlobal(sinceDate, 10),
        LeaderboardController.getFriends(sinceDate, 10)
      ]);
      globalComp.update(g);
      friendsComp.update(f);
    } catch (e) {
      console.error(e);
    } finally {
      refreshBtn.disabled = false;
    }
  });

  // ensure the view is visible
  root.classList.remove("hidden");
}