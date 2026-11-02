window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.dashboard = {
  chartInstance: null,

  render: async function() {
    const user = Auth.getUser();
    const userName = user ? Utils.escapeHtml(user.name) : 'Scholar';

    const content = `
  <div class="dashboard-page">
    <!-- Welcome Banner matching mockup -->
    <div style="background:linear-gradient(135deg,#3730a3 0%,#4f46e5 100%);border-radius:16px;padding:32px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative;">
      <div style="position:absolute;right:-5%;bottom:-40%;width:280px;height:280px;background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%);border-radius:50%;"></div>
      <div style="position:relative;z-index:1;">
        <h2 style="font-size:1.5rem;font-weight:800;color:#ffffff;margin-bottom:6px;">Hello, ${userName} 🔥</h2>
        <p style="font-size:14px;color:rgba(255,255,255,0.8);">Keep learning and achieving more!</p>
      </div>
      <div style="display:flex;gap:12px;position:relative;z-index:1;">
        <a href="#/categories" class="btn btn-secondary btn-sm">Browse Categories</a>
        <a href="#/history" class="btn" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);font-size:13px;padding:6px 14px;border-radius:6px;">View History</a>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stat-cards-grid" id="dashboard-stats-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:28px;">
      <div class="card" style="padding:24px;">
        <div style="font-size:13px;color:#64748b;font-weight:500;margin-bottom:8px;">Quizzes</div>
        <div style="font-size:2rem;font-weight:800;color:#4f46e5;" id="stat-quizzes">0</div>
      </div>
      <div class="card" style="padding:24px;">
        <div style="font-size:13px;color:#64748b;font-weight:500;margin-bottom:8px;">Avg Score</div>
        <div style="font-size:2rem;font-weight:800;color:#10b981;" id="stat-avg">0%</div>
      </div>
      <div class="card" style="padding:24px;">
        <div style="font-size:13px;color:#64748b;font-weight:500;margin-bottom:8px;">Best Score</div>
        <div style="font-size:2rem;font-weight:800;color:#f59e0b;" id="stat-best">0%</div>
      </div>
    </div>

    <!-- Two Column Grid -->
    <div style="display:grid;grid-template-columns:1fr 380px;gap:24px;">
      <!-- Performance Chart -->
      <div class="card">
        <div class="card-header flex-between">
          <div>
            <h3 class="card-title">Your Performance</h3>
            <p class="card-subtitle">Score trend over recent quizzes</p>
          </div>
        </div>
        <div class="card-body" style="position:relative;height:250px;">
          <canvas id="performance-chart"></canvas>
          <div id="chart-empty-state" style="display:none;height:100%;align-items:center;justify-content:center;">
            <p style="color:#94a3b8;">Complete quizzes to see your performance trend!</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header flex-between">
          <div>
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <a href="#/history" class="btn btn-ghost btn-sm">View All →</a>
        </div>
        <div class="card-body" id="recent-activity-container">
          ${Utils.loadingHTML('Loading...')}
        </div>
      </div>
    </div>
  </div>
`;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Dashboard', [{ label: 'Dashboard', hash: '#/dashboard' }]),
      content
    );
  },

  afterRender: async function() {
    const recentContainer = document.getElementById('recent-activity-container');
    const chartCanvas = document.getElementById('performance-chart');
    const chartEmpty = document.getElementById('chart-empty-state');

    try {
      // Fetch stats from dashboard endpoint with fallback to my results
      let stats = null;
      let recent = [];

      try {
        const statsRes = await API.get('/stats/dashboard');
        stats = statsRes.data || statsRes;
        recent = stats.recentAttempts || stats.recentResults || [];
      } catch (statsErr) {
        // Fallback: fetch from /results/my
        const resultsRes = await API.get('/results/my?limit=5');
        const results = resultsRes.data?.results || (Array.isArray(resultsRes.data) ? resultsRes.data : []);
        recent = results.slice(0, 5);

        const totalQuizzes = results.length;
        const totalScore = results.reduce((acc, r) => acc + (r.percentage || ((r.score / (r.totalQuestions || 10)) * 100)), 0);
        const avg = totalQuizzes ? Math.round(totalScore / totalQuizzes) : 0;
        const best = results.reduce((acc, r) => {
          const p = r.percentage || ((r.score / (r.totalQuestions || 10)) * 100);
          return p > acc ? p : acc;
        }, 0);
        const totalQ = results.reduce((acc, r) => acc + (r.totalQuestions || 10), 0);

        stats = {
          totalQuizzes,
          averageScore: avg,
          bestScore: Math.round(best),
          totalQuestions: totalQ
        };
      }

      // Update Stat Cards
      if (stats) {
        const totalQuizzes = stats.totalQuizzes || stats.quizzesTaken || 0;
        const avgScore = Math.round(stats.averageScore || stats.avgScore || 0);
        const bestScore = Math.round(stats.bestScore || stats.highestScore || 0);

        const elQuizzes = document.getElementById('stat-quizzes');
        const elAvg = document.getElementById('stat-avg');
        const elBest = document.getElementById('stat-best');

        if (elQuizzes) elQuizzes.textContent = totalQuizzes;
        if (elAvg) elAvg.textContent = `${avgScore}%`;
        if (elBest) elBest.textContent = `${bestScore}%`;
      }

      // Render Recent Activity List
      if (recentContainer) {
        if (!recent || recent.length === 0) {
          recentContainer.innerHTML = Utils.emptyStateHTML(
            Components.icon('clock', 36),
            'No Quizzes Yet',
            'You haven\'t taken any quizzes yet. Explore topics and take your first assessment!',
            '<a href="#/categories" class="btn btn-primary btn-sm" style="margin-top: 0.75rem;">Explore Topics</a>'
          );
        } else {
          recentContainer.innerHTML = `
            <div class="recent-list">
              ${recent.map(item => {
                const catName = item.categoryId?.name || item.category?.name || item.categoryName || 'General Quiz';
                const score = item.score !== undefined ? item.score : 0;
                const total = item.totalQuestions || 10;
                const percentage = item.percentage !== undefined ? Math.round(item.percentage) : Math.round((score / total) * 100);
                const date = item.submittedAt || item.createdAt || item.date || new Date().toISOString();
                const resultId = item._id || item.id;

                return `
                  <div class="recent-item">
                    <div class="recent-item-info">
                      <h4 class="recent-item-title">${Utils.escapeHtml(catName)}</h4>
                      <span class="recent-item-date">${Utils.timeAgo(date)} • ${Utils.formatDate(date)}</span>
                    </div>
                    <div class="recent-item-meta">
                      <div class="recent-score-pill">
                        <span class="score-value ${percentage >= 80 ? 'text-success' : (percentage >= 50 ? 'text-warning' : 'text-danger')}">
                          ${score}/${total} (${percentage}%)
                        </span>
                      </div>
                      <a href="#/quiz/results/${resultId}" class="btn btn-ghost btn-sm" title="Review quiz">
                        ${Components.icon('eye', 16)}
                      </a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }
      }

      // Render Chart.js
      if (chartCanvas && window.Chart) {
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }

        if (!recent || recent.length === 0) {
          chartCanvas.style.display = 'none';
          if (chartEmpty) chartEmpty.style.display = 'flex';
        } else {
          chartCanvas.style.display = 'block';
          if (chartEmpty) chartEmpty.style.display = 'none';

          // Chronological order for trend chart
          const trendItems = [...recent].reverse();
          const labels = trendItems.map((r, i) => {
            const name = r.category?.name || r.categoryName || `Quiz ${i + 1}`;
            return name.length > 12 ? name.substring(0, 10) + '...' : name;
          });
          const scores = trendItems.map(r => {
            return r.percentage !== undefined ? Math.round(r.percentage) : Math.round(((r.score || 0) / (r.totalQuestions || 10)) * 100);
          });

          this.chartInstance = new window.Chart(chartCanvas.getContext('2d'), {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Score %',
                data: scores,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#4f46e5',
                pointRadius: 4,
                tension: 0.35,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => ` Score: ${context.parsed.y}%`
                  }
                }
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 20,
                    callback: (val) => `${val}%`
                  },
                  grid: { color: 'rgba(226, 232, 240, 0.6)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }
          });
        }
      }
    } catch (err) {
      if (recentContainer) {
        recentContainer.innerHTML = `
          <div class="error-inline text-center" style="padding: 1.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 0.75rem;">Failed to load activity.</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.dashboard.afterRender()">Retry</button>
          </div>
        `;
      }
    }
  }
};
