window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.publicCategories = {
  categories: [],
  selectedDifficulty: 'all',
  searchQuery: '',

  render: async function() {
    return `
      <div class="public-categories-page">
        ${Components.publicNavbar()}

        <header class="page-hero-header">
          <div class="section-container text-center">
            <span class="section-badge">Catalog</span>
            <h1 class="page-header-title">Explore Quiz Categories</h1>
            <p class="page-header-subtitle">Browse all available topics and test your knowledge against the clock</p>
          </div>
        </header>

        <main class="section-container" style="padding-bottom: 4rem;">
          <!-- Controls bar -->
          <div class="catalog-controls-bar">
            <div class="search-input-wrapper">
              <span class="search-icon">${Components.icon('search', 18)}</span>
              <input 
                type="text" 
                id="public-category-search" 
                class="form-input search-input" 
                placeholder="Search categories by name or topic..."
              >
            </div>
            
            <div class="filter-pills" id="public-difficulty-filters">
              <button class="pill-btn active" data-difficulty="all">All Difficulties</button>
              <button class="pill-btn" data-difficulty="Easy">Easy</button>
              <button class="pill-btn" data-difficulty="Medium">Medium</button>
              <button class="pill-btn" data-difficulty="Hard">Hard</button>
            </div>
          </div>

          <!-- Category Count / State -->
          <div class="catalog-meta" style="margin-bottom: 1.5rem; color: var(--color-text-muted, #64748b);">
            <span id="categories-count-text">Loading topics...</span>
          </div>

          <!-- Categories Grid -->
          <div class="categories-grid" id="public-categories-grid">
            ${Utils.loadingHTML('Loading categories...')}
          </div>
        </main>

        <!-- CTA footer for public visitors -->
        <section class="cta-banner" style="background: var(--color-surface, #f8fafc); border-top: 1px solid var(--color-border, #e2e8f0); padding: 3rem 1rem; text-align: center;">
          <div class="section-container">
            <h3>Want to save your scores and track improvement?</h3>
            <p style="color: var(--color-text-muted, #64748b); margin: 0.5rem 0 1.5rem;">Create a free Quizora account to unlock custom analytics and global rankings.</p>
            <a href="#/register" class="btn btn-primary">Create Free Account</a>
          </div>
        </section>
      </div>
    `;
  },

  filterAndRender: function() {
    const grid = document.getElementById('public-categories-grid');
    const countText = document.getElementById('categories-count-text');
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

    if (countText) {
      countText.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'category' : 'categories'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = Utils.emptyStateHTML(
        Components.icon('search', 40),
        'No Categories Found',
        'Try adjusting your search query or difficulty filters to see more results.'
      );
      return;
    }

    grid.innerHTML = filtered.map(cat => {
      const catId = cat._id || cat.id;
      const qCount = cat.questionCount !== undefined ? cat.questionCount : (cat.questions?.length || 10);
      return `
        <div class="category-card">
          <div class="category-card-header">
            <h3 class="category-title">${Utils.escapeHtml(cat.name)}</h3>
            ${Utils.difficultyBadge(cat.difficulty || 'Medium')}
          </div>
          <p class="category-description">${Utils.escapeHtml(cat.description || 'Test your proficiency with challenging questions.')}</p>
          <div class="category-card-footer">
            <span class="category-count">
              ${Components.icon('book', 16)}
              ${qCount} Questions
            </span>
            <a href="#/quiz/instructions/${catId}" class="btn btn-primary btn-sm">
              <span>Start Quiz</span>
              ${Components.icon('play', 14)}
            </a>
          </div>
        </div>
      `;
    }).join('');
  },

  afterRender: async function() {
    const searchInput = document.getElementById('public-category-search');
    const filterContainer = document.getElementById('public-difficulty-filters');
    const grid = document.getElementById('public-categories-grid');

    this.selectedDifficulty = 'all';
    this.searchQuery = '';

    try {
      const res = await API.get('/categories');
      this.categories = res.data?.categories || (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      this.filterAndRender();
    } catch (err) {
      if (grid) {
        grid.innerHTML = `
          <div class="error-inline text-center" style="grid-column: 1 / -1; padding: 2rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load categories: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.publicCategories.afterRender()">Retry</button>
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

    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        filterContainer.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDifficulty = btn.getAttribute('data-difficulty');
        this.filterAndRender();
      });
    }
  }
};
