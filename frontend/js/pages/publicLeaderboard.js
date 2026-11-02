window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.publicLeaderboard = {
  render: async function() {
    return `
      <div class="public-leaderboard-page">
        ${Components.publicNavbar()}

        <header class="page-hero-header">
          <div class="section-container text-center">
            <span class="section-badge">Rankings</span>
            <h1 class="page-header-title">Global Hall of Fame</h1>
            <p class="page-header-subtitle">Celebrating top scholars and high performers across all Quizora assessments</p>
          </div>
        </header>

        <main class="section-container" style="padding-bottom: 5rem;">
          <!-- Top 3 Podium Container -->
          <div class="podium-container" id="leaderboard-podium" style="margin-bottom: 3rem;">
            <!-- Dynamically populated -->
          </div>

          <!-- Leaderboard Table Card -->
          <div class="card leaderboard-table-card">
            <div class="card-header flex-between">
              <div>
                <h3 class="card-title">Top Performers</h3>
                <p class="card-subtitle">Ranked by average score percentage and quizzes completed</p>
              </div>
              <div class="table-actions">
                <span class="badge badge-primary" id="total-participants-badge">Scholars</span>
              </div>
            </div>

            <div class="table-responsive" id="leaderboard-table-container">
              ${Utils.loadingHTML('Loading leaderboard data...')}
            </div>
          </div>
        </main>
      </div>
    `;
  },

  afterRender: async function() {
    const tableContainer = document.getElementById('leaderboard-table-container');
    const podiumContainer = document.getElementById('leaderboard-podium');
    const participantsBadge = document.getElementById('total-participants-badge');

    try {
      const res = await API.get('/leaderboard');
      const leaderboard = res.data?.leaderboard || (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));

      if (!leaderboard || leaderboard.length === 0) {
        if (podiumContainer) podiumContainer.innerHTML = '';
        if (tableContainer) {
          tableContainer.innerHTML = Utils.emptyStateHTML(
            Components.icon('trophy', 48),
            'No Rankings Yet',
            'Be the first to complete a quiz and claim the top spot on the leaderboard!',
            '<a href="#/explore" class="btn btn-primary" style="margin-top: 1rem;">Take a Quiz</a>'
          );
        }
        return;
      }

      if (participantsBadge) {
        participantsBadge.textContent = `${leaderboard.length} Scholars`;
      }

      // Render Top 3 Podium if at least 1 entry
      if (podiumContainer) {
        const top3 = leaderboard.slice(0, 3);
        const rankColors = ['gold', 'silver', 'bronze'];
        const rankLabels = ['1st Place', '2nd Place', '3rd Place'];
        const medalIcons = ['🥇', '🥈', '🥉'];

        podiumContainer.innerHTML = `
          <div class="podium-grid">
            ${top3.map((entry, index) => {
              const userName = entry.name || entry.user?.name || entry.userName || 'Anonymous';
              const avgScore = Math.round(Number(entry.averageScore || entry.avgScore || entry.score || 0));
              const count = entry.quizzesCompleted || entry.completedCount || entry.quizzesTaken || 1;
              const initial = userName.charAt(0).toUpperCase();

              return `
                <div class="podium-card podium-rank-${index + 1}">
                  <div class="podium-medal">${medalIcons[index]}</div>
                  <div class="avatar avatar-lg podium-avatar avatar-${rankColors[index]}">${initial}</div>
                  <h4 class="podium-name">${Utils.escapeHtml(userName)}</h4>
                  <div class="podium-rank-tag">${rankLabels[index]}</div>
                  <div class="podium-stat">
                    <span class="stat-highlight">${avgScore}%</span> Avg Score
                  </div>
                  <div class="podium-meta">${count} ${count === 1 ? 'Quiz' : 'Quizzes'} Completed</div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      // Render full table
      if (tableContainer) {
        tableContainer.innerHTML = `
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 80px;">Rank</th>
                <th>Scholar</th>
                <th class="text-center">Quizzes Completed</th>
                <th class="text-center">Average Score</th>
                <th class="text-right">Performance</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                const userName = entry.name || entry.user?.name || entry.userName || 'Anonymous';
                const avgScore = Math.round(Number(entry.averageScore || entry.avgScore || entry.score || 0));
                const count = entry.quizzesCompleted || entry.completedCount || entry.quizzesTaken || 1;
                const initial = userName.charAt(0).toUpperCase();

                let rankBadge = `<span class="rank-number">${rank}</span>`;
                if (rank === 1) rankBadge = `<span class="rank-badge rank-1">🥇 1</span>`;
                else if (rank === 2) rankBadge = `<span class="rank-badge rank-2">🥈 2</span>`;
                else if (rank === 3) rankBadge = `<span class="rank-badge rank-3">🥉 3</span>`;

                return `
                  <tr>
                    <td>${rankBadge}</td>
                    <td>
                      <div class="table-user-cell">
                        <div class="avatar avatar-sm">${initial}</div>
                        <span class="user-cell-name font-medium">${Utils.escapeHtml(userName)}</span>
                      </div>
                    </td>
                    <td class="text-center font-medium">${count}</td>
                    <td class="text-center">
                      <span class="score-highlight font-bold ${avgScore >= 80 ? 'text-success' : (avgScore >= 50 ? 'text-warning' : 'text-danger')}">
                        ${avgScore}%
                      </span>
                    </td>
                    <td class="text-right">
                      ${Utils.scoreBadge(avgScore)}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      }
    } catch (err) {
      if (tableContainer) {
        tableContainer.innerHTML = `
          <div class="error-inline text-center" style="padding: 2.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load leaderboard data: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.publicLeaderboard.afterRender()">Try Again</button>
          </div>
        `;
      }
    }
  }
};
