window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.leaderboard = {
  selectedCategory: 'all',
  categories: [],

  render: async function() {
    const content = `
      <div class="leaderboard-page">
        <!-- Tabs -->
        <div style="display:flex;gap:4px;background:#f1f5f9;border-radius:10px;padding:4px;margin-bottom:24px;width:fit-content;">
          <button class="leaderboard-tab active-tab" data-tab="overall" style="padding:8px 20px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:#4f46e5;color:#fff;">Overall</button>
          <button class="leaderboard-tab" data-tab="mathematics" style="padding:8px 20px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748b;">Mathematics</button>
          <button class="leaderboard-tab" data-tab="science" style="padding:8px 20px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748b;">Science</button>
          <button class="leaderboard-tab" data-tab="technology" style="padding:8px 20px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:#64748b;">Technology</button>
        </div>
        
        <div class="card">
          <div class="card-header" style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;">
            <h3 class="card-title" style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b;">Top Performers</h3>
          </div>
          <div id="leaderboard-table-container">${Utils.loadingHTML('Loading leaderboard...')}</div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Leaderboard', [
        { label: 'Dashboard', hash: '#/dashboard' },
        { label: 'Leaderboard', hash: '#/leaderboard' }
      ]),
      content
    );
  },

  loadLeaderboard: async function() {
    const tableContainer = document.getElementById('leaderboard-table-container');
    const currentUser = Auth.getUser();

    if (tableContainer) {
      tableContainer.innerHTML = Utils.loadingHTML('Loading leaderboard...');
    }

    try {
      let endpoint = '/leaderboard';
      if (this.selectedCategory && this.selectedCategory !== 'all') {
        endpoint += `?category=${encodeURIComponent(this.selectedCategory)}`;
      }

      const res = await API.get(endpoint);
      const data = res.data || res;
      const leaderboard = Array.isArray(data) ? data : (data.leaderboard || data.results || []);

      if (!leaderboard || leaderboard.length === 0) {
        if (tableContainer) {
          tableContainer.innerHTML = `
            <div style="padding: 48px 20px; text-align: center; color: #64748b;">
              <div style="font-size: 2.5rem; margin-bottom: 12px;">🏆</div>
              <h4 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 6px;">No Rankings Yet</h4>
              <p style="font-size: 0.875rem; margin: 0;">Be the first to complete a quiz in this category and secure the top spot!</p>
            </div>
          `;
        }
        return;
      }

      if (tableContainer) {
        tableContainer.innerHTML = `
          <table class="data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                <th style="text-align: left; padding: 12px 20px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; width: 80px;">#</th>
                <th style="text-align: left; padding: 12px 20px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">User</th>
                <th style="text-align: left; padding: 12px 20px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Score</th>
                <th style="text-align: left; padding: 12px 20px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Quizzes</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                const userName = entry.name || entry.user?.name || entry.userName || 'Anonymous';
                const avgScore = Math.round(Number(entry.averageScore || entry.avgScore || entry.score || 0));
                const count = entry.quizzesCompleted || entry.completedCount || entry.quizzesTaken || 1;
                const initial = userName.charAt(0).toUpperCase();

                const userId = entry.user?._id || entry.user?.id || entry.userId || entry._id;
                const currentUserId = currentUser?._id || currentUser?.id;
                const isCurrent = (userId && currentUserId && String(userId) === String(currentUserId)) || (userName === currentUser?.name);

                let rankBadge = `<span style="font-size: 14px; font-weight: 600; color: #64748b; margin-left: 4px;">${rank}</span>`;
                if (rank === 1) rankBadge = `<span style="font-size: 18px;" title="1st Place">🥇</span>`;
                else if (rank === 2) rankBadge = `<span style="font-size: 18px;" title="2nd Place">🥈</span>`;
                else if (rank === 3) rankBadge = `<span style="font-size: 18px;" title="3rd Place">🥉</span>`;

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9; ${isCurrent ? 'background: #eff6ff;' : ''}">
                    <td style="padding: 14px 20px; vertical-align: middle;">
                      ${rankBadge}
                    </td>
                    <td style="padding: 14px 20px; vertical-align: middle;">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="avatar avatar-sm ${isCurrent ? 'avatar-primary' : ''}" style="width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; background: ${isCurrent ? '#4f46e5' : '#e2e8f0'}; color: ${isCurrent ? '#fff' : '#475569'}; flex-shrink: 0;">${initial}</div>
                        <div>
                          <div style="font-size: 14px; font-weight: ${isCurrent ? '700' : '600'}; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                            <span>${Utils.escapeHtml(userName)}</span>
                            ${isCurrent ? '<span style="font-size: 10px; font-weight: 700; background: #4f46e5; color: #fff; padding: 2px 6px; border-radius: 4px;">YOU</span>' : ''}
                          </div>
                          ${entry.email ? `<div style="font-size: 12px; color: #94a3b8;">${Utils.escapeHtml(entry.email)}</div>` : ''}
                        </div>
                      </div>
                    </td>
                    <td style="padding: 14px 20px; vertical-align: middle;">
                      <span style="font-size: 14px; font-weight: 700; color: ${avgScore >= 80 ? '#10b981' : (avgScore >= 50 ? '#f59e0b' : '#ef4444')};">
                        ${avgScore}%
                      </span>
                    </td>
                    <td style="padding: 14px 20px; vertical-align: middle; font-size: 14px; font-weight: 500; color: #334155;">
                      ${count}
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
          <div style="padding: 32px 20px; text-align: center;">
            <p style="color: #ef4444; margin-bottom: 12px; font-size: 14px;">Failed to load leaderboard: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.leaderboard.loadLeaderboard()">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.selectedCategory = 'all';

    try {
      const catRes = await API.get('/categories');
      this.categories = catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
    } catch (e) {
      this.categories = [];
    }

    const tabs = document.querySelectorAll('.leaderboard-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.style.background = 'transparent';
          t.style.color = '#64748b';
          t.classList.remove('active-tab');
        });
        tab.style.background = '#4f46e5';
        tab.style.color = '#fff';
        tab.classList.add('active-tab');

        const tabKey = tab.getAttribute('data-tab');
        if (tabKey === 'overall') {
          this.selectedCategory = 'all';
        } else {
          const matchedCat = (this.categories || []).find(c => 
            c.name && c.name.toLowerCase().includes(tabKey.toLowerCase())
          );
          this.selectedCategory = matchedCat ? (matchedCat._id || matchedCat.id) : tabKey;
        }
        this.loadLeaderboard();
      });
    });

    await this.loadLeaderboard();
  }
};
