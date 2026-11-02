window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.categories = {
  categories: [],
  selectedDifficulty: 'all',
  searchQuery: '',

  render: async function() {
    const content = `
      <div class="user-categories-page">
        <!-- Search and Filter Bar matching mockup -->
        <div style="background:#fff;border-radius:14px;padding:16px 20px;border:1px solid #e2e8f0;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04);flex-wrap:wrap;">
          <div style="position:relative;flex:1;min-width:280px;display:flex;align-items:center;">
            <span style="position:absolute;left:14px;color:#94a3b8;display:flex;align-items:center;pointer-events:none;">
              ${Components.icon('search', 18)}
            </span>
            <input 
              type="text" 
              id="user-category-search" 
              placeholder="Search categories..." 
              style="width:100%;padding:10px 14px 10px 42px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc;color:#0f172a;transition:border-color 0.2s,box-shadow 0.2s;"
              onfocus="this.style.borderColor='#4f46e5';this.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)'"
              onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"
            >
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <label for="user-difficulty-filter" style="font-size:13px;font-weight:500;color:#64748b;margin:0;">Difficulty:</label>
            <select id="user-difficulty-filter" style="padding:9px 14px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;background:#f8fafc;color:#0f172a;cursor:pointer;">
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <span id="user-cat-count" style="font-size:13px;color:#94a3b8;margin-left:4px;"></span>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="categories-grid" id="user-categories-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
          ${Utils.loadingHTML('Fetching available quiz categories...')}
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Quiz Categories', [
        { label: 'Dashboard', hash: '#/dashboard' },
        { label: 'Categories', hash: '#/categories' }
      ]),
      content
    );
  },

  filterAndRender: function() {
    const grid = document.getElementById('user-categories-grid');
    const countEl = document.getElementById('user-cat-count');
    if (!grid) return;

    let filtered = this.categories;

    if (this.selectedDifficulty !== 'all') {
      filtered = filtered.filter(cat => 
        (cat.difficulty || '').toLowerCase() === this.selectedDifficulty.toLowerCase()
      );
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(cat => 
        (cat.name && cat.name.toLowerCase().includes(q)) || 
        (cat.description && cat.description.toLowerCase().includes(q))
      );
    }

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${this.categories.length} categories`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; width: 100%;">
          ${Utils.emptyStateHTML(
            Components.icon('search', 40),
            'No Matching Categories Found',
            'Try refining your search keyword or clearing the difficulty filter.'
          )}
        </div>
      `;
      return;
    }

    const iconMap = { 'technology': '💻', 'science': '🔬', 'mathematics': '📐', 'math': '📐', 'history': '📚', 'physics': '⚡', 'chemistry': '🧪', 'biology': '🧬', 'english': '📝', 'geography': '🌍' };
    const colorMap = { 'technology': 'linear-gradient(135deg,#3b82f6,#1d4ed8)', 'science': 'linear-gradient(135deg,#10b981,#059669)', 'mathematics': 'linear-gradient(135deg,#f59e0b,#d97706)', 'math': 'linear-gradient(135deg,#f59e0b,#d97706)', 'history': 'linear-gradient(135deg,#ef4444,#dc2626)', 'physics': 'linear-gradient(135deg,#8b5cf6,#7c3aed)', 'chemistry': 'linear-gradient(135deg,#06b6d4,#0891b2)', 'biology': 'linear-gradient(135deg,#84cc16,#65a30d)' };

    grid.innerHTML = filtered.map(cat => {
      const catId = cat._id || cat.id;
      const count = cat.questionCount !== undefined ? cat.questionCount : (cat.questions?.length || 10);
      const key = (cat.name || '').toLowerCase();
      const icon = iconMap[key] || '🎯';
      const gradient = colorMap[key] || 'linear-gradient(135deg,#4f46e5,#3730a3)';
      const diffColor = (cat.difficulty||'').toLowerCase() === 'easy' ? '#10b981' : (cat.difficulty||'').toLowerCase() === 'hard' ? '#ef4444' : '#f59e0b';
      const diffBg = (cat.difficulty||'').toLowerCase() === 'easy' ? '#ecfdf5' : (cat.difficulty||'').toLowerCase() === 'hard' ? '#fef2f2' : '#fffbeb';

      return `
        <div style="background:#fff;border-radius:16px;padding:24px;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;flex-direction:column;gap:16px;transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'">
          <div style="width:52px;height:52px;background:${gradient};border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;">${icon}</div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:4px;">${cat.name}</h3>
            <p style="font-size:13px;color:#64748b;">${count} Questions</p>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:12px;font-weight:600;color:${diffColor};background:${diffBg};padding:3px 10px;border-radius:9999px;">${cat.difficulty||'Medium'}</span>
            <a href="#/quiz/instructions/${catId}" style="background:#4f46e5;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;">Start Quiz +</a>
          </div>
        </div>
      `;
    }).join('');
  },

  afterRender: async function() {
    const searchInput = document.getElementById('user-category-search');
    const difficultySelect = document.getElementById('user-difficulty-filter');
    const grid = document.getElementById('user-categories-grid');

    this.selectedDifficulty = 'all';
    this.searchQuery = '';

    try {
      const res = await API.get('/categories');
      this.categories = res.data?.categories || (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      this.filterAndRender();
    } catch (err) {
      if (grid) {
        grid.innerHTML = `
          <div class="error-inline text-center" style="grid-column: 1 / -1; padding: 2.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load quiz categories: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.categories.afterRender()">Retry</button>
          </div>
        `;
      }
      return;
    }

    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.filterAndRender();
      }, 250));
    }

    if (difficultySelect) {
      difficultySelect.addEventListener('change', (e) => {
        this.selectedDifficulty = e.target.value;
        this.filterAndRender();
      });
    }
  }
};
