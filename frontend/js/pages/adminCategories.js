window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.adminCategories = {
  categories: [],
  searchQuery: '',
  currentPage: 1,
  limit: 10,

  render: async function() {
    const content = `
      <div class="admin-categories-page">
        <!-- Header Row -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">Manage Categories</h2>
            <p style="font-size:13px;color:#64748b;margin:4px 0 0 0;">Create and organize quiz test topics</p>
          </div>
          <button type="button" id="admin-add-cat-btn" class="btn btn-primary" style="background:#4f46e5;color:#fff;padding:9px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;gap:6px;border:none;cursor:pointer;font-size:13px;">
            ${Components.icon('plus', 16)}
            <span>+ Add Category</span>
          </button>
        </div>

        <!-- Search Input -->
        <div class="card" style="margin-bottom:20px;padding:14px 18px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="position:relative;flex:1;max-width:360px;">
              <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;display:flex;">
                ${Components.icon('search', 16)}
              </span>
              <input 
                type="text" 
                id="admin-cat-search" 
                class="form-input" 
                placeholder="Search categories..."
                style="padding-left:36px;width:100%;height:38px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;"
              >
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="card">
          <div class="table-responsive" id="admin-cat-table-container">
            ${Utils.loadingHTML('Loading categories...')}
          </div>
          <div class="card-footer flex-center" id="admin-cat-pagination" style="padding:16px;border-top:1px solid #f1f5f9;display:flex;justify-content:center;"></div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.adminSidebar(),
      Components.topbar('Manage Categories', [
        { label: 'Admin', hash: '#/admin' },
        { label: 'Categories', hash: '#/admin/categories' }
      ]),
      content
    );
  },

  renderDifficultyBadge: function(difficulty) {
    const d = (difficulty || 'Medium').toString().toLowerCase();
    if (d === 'easy') {
      return `<span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;display:inline-block;">Easy</span>`;
    } else if (d === 'hard') {
      return `<span style="background:#fee2e2;color:#b91c1c;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;display:inline-block;">Hard</span>`;
    } else {
      return `<span style="background:#fef3c7;color:#b45309;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;display:inline-block;">Medium</span>`;
    }
  },

  renderTable: function() {
    const container = document.getElementById('admin-cat-table-container');
    const pagination = document.getElementById('admin-cat-pagination');
    if (!container) return;

    let filtered = this.categories;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.description && c.description.toLowerCase().includes(q)));
    }

    if (filtered.length === 0) {
      container.innerHTML = Utils.emptyStateHTML(
        Components.icon('grid', 40),
        'No Categories Found',
        'Add a new category or adjust your search query.',
        '<button class="btn btn-primary btn-sm" onclick="window.QuizoraPages.adminCategories.openModal()" style="margin-top: 1rem; background:#4f46e5; color:#fff;">+ Add Category</button>'
      );
      if (pagination) pagination.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(filtered.length / this.limit) || 1;
    if (this.currentPage > totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.limit;
    const pageItems = filtered.slice(start, start + this.limit);

    container.innerHTML = `
      <table class="data-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Name</th>
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Description</th>
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Difficulty</th>
            <th style="text-align:right;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(cat => {
            const catId = cat._id || cat.id;
            const qCount = cat.questionCount !== undefined ? cat.questionCount : (cat.questions?.length || 0);

            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 16px; vertical-align: middle;">
                  <span style="font-weight: 700; color: #1e293b; font-size: 14px;">${Utils.escapeHtml(cat.name)}</span>
                </td>
                <td style="padding: 14px 16px; vertical-align: middle; max-width: 340px;">
                  <span style="color: #64748b; font-size: 13px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;" title="${Utils.escapeHtml(cat.description || '')}">
                    ${Utils.escapeHtml(cat.description || 'No description')}
                  </span>
                </td>
                <td style="padding: 14px 16px; vertical-align: middle;">
                  ${this.renderDifficultyBadge(cat.difficulty)}
                </td>
                <td style="text-align: right; padding: 14px 16px; vertical-align: middle;">
                  <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
                    <button 
                      class="btn btn-icon btn-sm edit-cat-btn" 
                      data-id="${catId}" 
                      title="Edit Category"
                      aria-label="Edit"
                      style="border:none;background:transparent;cursor:pointer;color:#64748b;padding:6px;border-radius:4px;display:flex;align-items:center;justify-content:center;"
                    >
                      ${Components.icon('edit', 16)}
                    </button>
                    <button 
                      class="btn btn-icon btn-sm delete-cat-btn" 
                      data-id="${catId}" 
                      data-name="${Utils.escapeHtml(cat.name)}"
                      data-qcount="${qCount}"
                      title="Delete Category"
                      aria-label="Delete"
                      style="border:none;background:transparent;cursor:pointer;color:#ef4444;padding:6px;border-radius:4px;display:flex;align-items:center;justify-content:center;"
                    >
                      ${Components.icon('trash', 16)}
                    </button>
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
        'window.QuizoraPages.adminCategories.setPage'
      );
    }

    // Attach table action listeners
    container.querySelectorAll('.edit-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cat = this.categories.find(c => (c._id || c.id) === id);
        if (cat) this.openModal(cat);
      });
    });

    container.querySelectorAll('.delete-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const qCount = parseInt(btn.getAttribute('data-qcount'), 10);
        this.confirmDelete(id, name, qCount);
      });
    });
  },

  setPage: function(p) {
    this.currentPage = p;
    this.renderTable();
  },

  openModal: function(cat = null) {
    const isEdit = !!cat;
    const catId = cat ? (cat._id || cat.id) : '';
    const name = cat ? cat.name : '';
    const description = cat ? (cat.description || '') : '';
    const difficulty = cat ? (cat.difficulty || 'Medium') : 'Medium';
    const status = cat ? (cat.status || (cat.isActive === false ? 'Inactive' : 'Active')) : 'Active';

    const modalHtml = `
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? 'Edit Category' : 'Create New Category'}</h3>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <form id="category-modal-form" novalidate>
        <div class="modal-body">
          <div id="cat-modal-error" class="alert alert-danger" style="display: none; margin-bottom: 1rem;"></div>

          <div class="form-group">
            <label for="cat-name-input" class="form-label">Category Name *</label>
            <input 
              type="text" 
              id="cat-name-input" 
              class="form-input" 
              placeholder="e.g. Mathematics" 
              value="${Utils.escapeHtml(name)}" 
              required
            >
          </div>

          <div class="form-group">
            <label for="cat-desc-input" class="form-label">Description</label>
            <textarea 
              id="cat-desc-input" 
              class="form-textarea" 
              rows="3" 
              placeholder="Brief description of the test topic..."
            >${Utils.escapeHtml(description)}</textarea>
          </div>

          <div class="form-row-two" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="cat-diff-input" class="form-label">Difficulty Level</label>
              <select id="cat-diff-input" class="form-select">
                <option value="Easy" ${difficulty.toLowerCase() === 'easy' ? 'selected' : ''}>Easy</option>
                <option value="Medium" ${difficulty.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="Hard" ${difficulty.toLowerCase() === 'hard' ? 'selected' : ''}>Hard</option>
              </select>
            </div>

            <div class="form-group">
              <label for="cat-status-input" class="form-label">Publish Status</label>
              <select id="cat-status-input" class="form-select">
                <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Cancel</button>
          <button type="submit" id="save-cat-btn" class="btn btn-primary" style="background:#4f46e5;color:#fff;">
            ${isEdit ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    `;

    Utils.showModal(modalHtml);

    const form = document.getElementById('category-modal-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = document.getElementById('cat-modal-error');
        const nameInp = document.getElementById('cat-name-input');
        const descInp = document.getElementById('cat-desc-input');
        const diffInp = document.getElementById('cat-diff-input');
        const statusInp = document.getElementById('cat-status-input');
        const saveBtn = document.getElementById('save-cat-btn');

        const catName = nameInp.value.trim();
        const catDesc = descInp.value.trim();
        const catDiff = diffInp.value;
        const catStatus = statusInp.value;

        if (!catName) {
          if (errBox) {
            errBox.textContent = 'Category name is required.';
            errBox.style.display = 'block';
          }
          nameInp.classList.add('input-invalid');
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const payload = {
          name: catName,
          description: catDesc,
          difficulty: catDiff,
          status: catStatus,
          isActive: catStatus === 'Active'
        };

        try {
          if (isEdit) {
            await API.put(`/categories/${catId}`, payload);
            Utils.showToast('Category updated successfully!', 'success');
          } else {
            await API.post('/categories', payload);
            Utils.showToast('Category created successfully!', 'success');
          }
          Utils.closeModal();
          await this.loadCategories();
        } catch (err) {
          if (errBox) {
            errBox.textContent = err.message || 'Failed to save category.';
            errBox.style.display = 'block';
          }
          saveBtn.disabled = false;
          saveBtn.textContent = isEdit ? 'Save Changes' : 'Create Category';
        }
      });
    }
  },

  confirmDelete: function(id, name, qCount) {
    if (qCount > 0) {
      Utils.showToast(`Cannot delete "${name}" because it still contains ${qCount} questions. Please remove questions first.`, 'warning', 4500);
      return;
    }

    Utils.showConfirm(
      'Delete Category',
      `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      async () => {
        try {
          await API.delete(`/categories/${id}`);
          Utils.showToast('Category deleted successfully.', 'success');
          await this.loadCategories();
        } catch (err) {
          Utils.showToast(err.message || 'Failed to delete category.', 'error');
        }
      },
      'Delete',
      'btn-danger'
    );
  },

  loadCategories: async function() {
    const container = document.getElementById('admin-cat-table-container');
    try {
      const res = await API.get('/categories');
      this.categories = res.data?.categories || (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      this.renderTable();
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div style="padding: 32px 20px; text-align: center;">
            <p style="color: #ef4444; margin-bottom: 12px; font-size: 14px;">Failed to load categories: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.adminCategories.loadCategories()">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.currentPage = 1;
    this.searchQuery = '';

    const searchInput = document.getElementById('admin-cat-search');
    const addBtn = document.getElementById('admin-add-cat-btn');

    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.currentPage = 1;
        this.renderTable();
      }, 250));
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => this.openModal());
    }

    await this.loadCategories();
  }
};
