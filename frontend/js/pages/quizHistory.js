window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.quizHistory = {
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  selectedCategory: 'all',
  selectedSort: 'newest',
  categories: [],

  render: async function() {
    const content = `
      <div class="quiz-history-page">
        <!-- Title & Filter Row -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:800;color:#0f172a;margin:0 0 4px 0;">Quiz History</h2>
            <p style="font-size:14px;color:#64748b;margin:0;">Review previous attempts, verify score growth, and inspect individual responses</p>
          </div>

          <!-- Filter row: All Categories dropdown + Sort by: Latest dropdown -->
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <select id="history-category-filter" class="form-select" style="min-width:160px;padding:8px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;background:#fff;color:#0f172a;">
              <option value="all">All Categories</option>
            </select>

            <select id="history-sort-filter" class="form-select" style="min-width:160px;padding:8px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;background:#fff;color:#0f172a;">
              <option value="newest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="highest">Sort by: Highest Score</option>
              <option value="lowest">Sort by: Lowest Score</option>
            </select>
          </div>
        </div>

        <!-- History Records Table Card -->
        <div class="card history-table-card" style="padding:0;overflow:hidden;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div class="table-responsive" id="history-table-container">
            ${Utils.loadingHTML('Loading quiz history...')}
          </div>

          <div class="card-footer flex-center" id="history-pagination-container" style="padding:16px;">
            <!-- Pagination Controls -->
          </div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Quiz History', [
        { label: 'Dashboard', hash: '#/dashboard' },
        { label: 'Quiz History', hash: '#/history' }
      ]),
      content
    );
  },

  loadHistory: async function(page = 1) {
    this.currentPage = page;
    const tableContainer = document.getElementById('history-table-container');
    const paginationContainer = document.getElementById('history-pagination-container');

    if (tableContainer) {
      tableContainer.innerHTML = Utils.loadingHTML('Fetching records...');
    }

    try {
      let query = `?page=${this.currentPage}&limit=${this.limit}`;
      if (this.selectedCategory !== 'all') {
        query += `&category=${encodeURIComponent(this.selectedCategory)}`;
      }
      if (this.selectedSort) {
        query += `&sort=${this.selectedSort}`;
      }

      const res = await API.get(`/results/my${query}`);
      const data = res.data || res;
      let results = data.results || (Array.isArray(data) ? data : []);
      const total = data.total !== undefined ? data.total : results.length;
      this.totalPages = data.totalPages || Math.ceil(total / this.limit) || 1;

      // In-memory sort fallback if backend returns un-sorted array
      if (this.selectedSort === 'newest') {
        results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } else if (this.selectedSort === 'oldest') {
        results.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      } else if (this.selectedSort === 'highest') {
        results.sort((a, b) => (b.percentage || b.score) - (a.percentage || a.score));
      } else if (this.selectedSort === 'lowest') {
        results.sort((a, b) => (a.percentage || a.score) - (b.percentage || b.score));
      }

      if (results.length === 0) {
        if (tableContainer) {
          tableContainer.innerHTML = Utils.emptyStateHTML(
            Components.icon('clock', 44),
            'No Assessment History Found',
            'You haven\'t completed any quizzes under this filter yet.',
            '<a href="#/categories" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Take a Quiz</a>'
          );
        }
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
      }

      if (tableContainer) {
        tableContainer.innerHTML = `
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:2px solid #e2e8f0;background:#f8fafc;">
                <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Date</th>
                <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Category</th>
                <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Score</th>
                <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Status</th>
                <th style="text-align:right;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Action</th>
              </tr>
            </thead>
            <tbody id="history-table-body">
              ${results.map(r => {
                const resultId = r._id || r.id;
                const catName = r.category?.name || r.categoryName || 'General';
                const score = r.score !== undefined ? r.score : 0;
                const totalQ = r.totalQuestions || r.total || 10;
                const pct = r.percentage !== undefined ? Math.round(r.percentage) : Math.round((score / totalQ) * 100);
                const isPassed = pct >= 60;
                const date = r.createdAt || r.date || new Date().toISOString();

                return `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:14px 16px;font-size:14px;color:#334155;">
                      <div style="font-weight:600;color:#0f172a;">${Utils.formatDate(date)}</div>
                      <div style="font-size:12px;color:#94a3b8;margin-top:2px;">${Utils.timeAgo(date)}</div>
                    </td>
                    <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;">
                      ${Utils.escapeHtml(catName)}
                    </td>
                    <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#0f172a;">
                      ${pct}%
                    </td>
                    <td style="padding:14px 16px;font-size:14px;">
                      <span style="background:${isPassed ? '#dcfce7' : '#fee2e2'};color:${isPassed ? '#15803d' : '#b91c1c'};padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;display:inline-block;">
                        ${isPassed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td style="padding:14px 16px;font-size:14px;text-align:right;">
                      <a href="#/quiz/results/${resultId}" style="color:#4f46e5;font-weight:600;text-decoration:none;font-size:13px;display:inline-flex;align-items:center;gap:4px;">
                        <span>View</span>
                        ${Components.icon('chevron-right', 14)}
                      </a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      }

      if (paginationContainer) {
        paginationContainer.innerHTML = Utils.paginationHTML(
          this.currentPage,
          this.totalPages,
          'window.QuizoraPages.quizHistory.loadHistory'
        );
      }
    } catch (err) {
      if (tableContainer) {
        tableContainer.innerHTML = `
          <div class="error-inline text-center" style="padding: 2.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load quiz history: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.quizHistory.loadHistory(1)">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.currentPage = 1;
    this.selectedCategory = 'all';
    this.selectedSort = 'newest';

    const categorySelect = document.getElementById('history-category-filter');
    const sortSelect = document.getElementById('history-sort-filter');

    // Fetch categories for filter dropdown
    try {
      const catRes = await API.get('/categories');
      const cats = catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
      if (categorySelect && cats.length > 0) {
        categorySelect.innerHTML = '<option value="all">All Categories</option>' + cats.map(c => `
          <option value="${c._id || c.id}">${Utils.escapeHtml(c.name)}</option>
        `).join('');
      }
    } catch (e) {
      // Continue even if category list fetch fails
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.loadHistory(1);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.selectedSort = e.target.value;
        this.loadHistory(1);
      });
    }

    await this.loadHistory(1);
  }
};
