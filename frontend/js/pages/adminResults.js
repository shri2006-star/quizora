window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.adminResults = {
  results: [],
  categories: [],
  searchQuery: '',
  selectedCategory: 'all',
  selectedScoreFilter: 'all', // all, passed (>=80), average (50-79), failed (<50)
  currentPage: 1,
  limit: 10,

  render: async function() {
    const content = `
      <div class="admin-results-page">
        <!-- Filter and Search Toolbar -->
        <div class="card" style="padding: 1.25rem; margin-bottom: 2rem;">
          <div class="toolbar-grid flex-between" style="flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; flex: 1;">
              <!-- User Search -->
              <div class="search-input-wrapper" style="flex: 1; min-width: 220px; max-width: 320px;">
                <span class="search-icon">${Components.icon('search', 18)}</span>
                <input 
                  type="text" 
                  id="admin-res-search" 
                  class="form-input search-input" 
                  placeholder="Search user or email..."
                >
              </div>

              <!-- Category Filter -->
              <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem;">
                <label for="admin-res-cat-filter" class="form-label" style="margin: 0; white-space: nowrap;">Topic:</label>
                <select id="admin-res-cat-filter" class="form-select" style="min-width: 150px;">
                  <option value="all">All Topics</option>
                </select>
              </div>

              <!-- Performance Filter -->
              <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem;">
                <label for="admin-res-score-filter" class="form-label" style="margin: 0; white-space: nowrap;">Performance:</label>
                <select id="admin-res-score-filter" class="form-select" style="min-width: 130px;">
                  <option value="all">All Grades</option>
                  <option value="passed">Passed (≥80%)</option>
                  <option value="average">Average (50-79%)</option>
                  <option value="failed">Failed (&lt;50%)</option>
                </select>
              </div>
            </div>

            <!-- Export to CSV -->
            <button type="button" id="admin-export-csv-btn" class="btn btn-outline-secondary">
              ${Components.icon('download', 16)}
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- Assessment Results Table Card -->
        <div class="card">
          <div class="card-header flex-between">
            <div>
              <h3 class="card-title">Assessment Results Log</h3>
              <p class="card-subtitle">Complete chronological record of all quizzes taken across the platform</p>
            </div>
            <span id="admin-res-count-badge" class="badge badge-secondary">0 Attempts</span>
          </div>

          <div class="table-responsive" id="admin-res-table-container">
            ${Utils.loadingHTML('Loading assessment submissions...')}
          </div>

          <div class="card-footer flex-center" id="admin-res-pagination"></div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.adminSidebar(),
      Components.topbar('Assessment Results', [
        { label: 'Admin', hash: '#/admin' },
        { label: 'Results', hash: '#/admin/results' }
      ]),
      content
    );
  },

  renderTable: function() {
    const container = document.getElementById('admin-res-table-container');
    const pagination = document.getElementById('admin-res-pagination');
    const countBadge = document.getElementById('admin-res-count-badge');
    if (!container) return;

    let filtered = this.results;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(r => {
        const cId = r.category?._id || r.category?.id || r.category || r.categoryId;
        return String(cId) === String(this.selectedCategory);
      });
    }

    if (this.selectedScoreFilter !== 'all') {
      filtered = filtered.filter(r => {
        const score = r.score !== undefined ? r.score : 0;
        const total = r.totalQuestions || 10;
        const pct = r.percentage !== undefined ? r.percentage : (score / total) * 100;
        if (this.selectedScoreFilter === 'passed') return pct >= 80;
        if (this.selectedScoreFilter === 'average') return pct >= 50 && pct < 80;
        if (this.selectedScoreFilter === 'failed') return pct < 50;
        return true;
      });
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const uName = r.user?.name || r.userName || '';
        const uEmail = r.user?.email || r.userEmail || '';
        return uName.toLowerCase().includes(q) || uEmail.toLowerCase().includes(q);
      });
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Record' : 'Records'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = Utils.emptyStateHTML(
        Components.icon('bar-chart', 40),
        'No Results Found',
        'No quiz submissions match your active filter settings.'
      );
      if (pagination) pagination.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(filtered.length / this.limit) || 1;
    if (this.currentPage > totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.limit;
    const pageItems = filtered.slice(start, start + this.limit);

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Scholar</th>
            <th>Category</th>
            <th class="text-center">Score</th>
            <th class="text-center">Percentage</th>
            <th class="text-center">Time Taken</th>
            <th>Date</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(r => {
            const rId = r._id || r.id;
            const uName = r.user?.name || r.userName || 'Anonymous Scholar';
            const uEmail = r.user?.email || r.userEmail || '';
            const catName = r.category?.name || r.categoryName || 'General Topic';
            const score = r.score !== undefined ? r.score : 0;
            const total = r.totalQuestions || 10;
            const pct = r.percentage !== undefined ? Math.round(r.percentage) : Math.round((score / total) * 100);
            const timeSec = r.timeTaken || 0;
            const date = r.createdAt || r.date || new Date();

            return `
              <tr>
                <td>
                  <div class="user-table-cell">
                    <span class="font-bold text-dark">${Utils.escapeHtml(uName)}</span>
                    ${uEmail ? `<span class="text-muted" style="font-size: 0.8rem; display: block;">${Utils.escapeHtml(uEmail)}</span>` : ''}
                  </div>
                </td>
                <td>
                  <span class="font-medium">${Utils.escapeHtml(catName)}</span>
                </td>
                <td class="text-center font-bold">
                  ${score} / ${total}
                </td>
                <td class="text-center">
                  <span class="font-bold ${pct >= 80 ? 'text-success' : (pct >= 50 ? 'text-warning' : 'text-danger')}">
                    ${pct}%
                  </span>
                </td>
                <td class="text-center font-mono">
                  ${Utils.formatTime(timeSec)}
                </td>
                <td>
                  <span>${Utils.formatDate(date)}</span>
                  <span class="text-muted" style="font-size: 0.8rem; display: block;">${Utils.timeAgo(date)}</span>
                </td>
                <td class="text-right">
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <a href="#/quiz/results/${rId}" class="btn btn-outline-primary btn-sm" title="View Full Question Solutions">
                      ${Components.icon('eye', 14)}
                      <span>Inspect</span>
                    </a>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    if (pagination) {
      pagination.innerHTML = Utils.paginationHTML(
        this.currentPage,
        totalPages,
        'window.QuizoraPages.adminResults.setPage'
      );
    }
  },

  setPage: function(p) {
    this.currentPage = p;
    this.renderTable();
  },

  exportCSV: function() {
    if (!this.results || this.results.length === 0) {
      Utils.showToast('No records available to export.', 'warning');
      return;
    }

    const headers = ['User Name', 'Email', 'Category', 'Score', 'Total Questions', 'Percentage', 'Time Taken (sec)', 'Date'];
    const rows = this.results.map(r => {
      const uName = `"${(r.user?.name || r.userName || 'Anonymous').replace(/"/g, '""')}"`;
      const email = `"${(r.user?.email || r.userEmail || '').replace(/"/g, '""')}"`;
      const cat = `"${(r.category?.name || r.categoryName || 'General').replace(/"/g, '""')}"`;
      const score = r.score !== undefined ? r.score : 0;
      const total = r.totalQuestions || 10;
      const pct = r.percentage !== undefined ? Math.round(r.percentage) : Math.round((score / total) * 100);
      const timeSec = r.timeTaken || 0;
      const date = `"${Utils.formatDate(r.createdAt || new Date())}"`;

      return [uName, email, cat, score, total, `${pct}%`, timeSec, date].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `quizora_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Utils.showToast('Results exported to CSV successfully.', 'success');
  },

  loadResults: async function() {
    const container = document.getElementById('admin-res-table-container');
    try {
      const res = await API.get('/results');
      const data = res.data || res;
      this.results = data.results || (Array.isArray(data) ? data : []);
      this.renderTable();
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div class="error-inline text-center" style="padding: 2.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load assessment results: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.adminResults.loadResults()">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.currentPage = 1;
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedScoreFilter = 'all';

    const searchInput = document.getElementById('admin-res-search');
    const catSelect = document.getElementById('admin-res-cat-filter');
    const scoreSelect = document.getElementById('admin-res-score-filter');
    const exportBtn = document.getElementById('admin-export-csv-btn');

    // Fetch categories for dropdown
    try {
      const catRes = await API.get('/categories');
      this.categories = catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
      if (catSelect && this.categories.length > 0) {
        catSelect.innerHTML = '<option value="all">All Topics</option>' + this.categories.map(c => `
          <option value="${c._id || c.id}">${Utils.escapeHtml(c.name)}</option>
        `).join('');
      }
    } catch (e) {
      // Ignore
    }

    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.currentPage = 1;
        this.renderTable();
      }, 250));
    }

    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.currentPage = 1;
        this.renderTable();
      });
    }

    if (scoreSelect) {
      scoreSelect.addEventListener('change', (e) => {
        this.selectedScoreFilter = e.target.value;
        this.currentPage = 1;
        this.renderTable();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCSV());
    }

    await this.loadResults();
  }
};
