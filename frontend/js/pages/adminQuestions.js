window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.adminQuestions = {
  questions: [],
  categories: [],
  selectedCategory: 'all',
  selectedDifficulty: 'all',
  searchQuery: '',
  currentPage: 1,
  limit: 10,

  render: async function() {
    const content = `
      <div class="admin-questions-page">
        <!-- Header Row -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">Manage Questions</h2>
            <p style="font-size:13px;color:#64748b;margin:4px 0 0 0;">Create, organize, and manage assessment questions</p>
          </div>
          <button type="button" id="admin-add-q-btn" class="btn btn-primary" style="background:#4f46e5;color:#fff;padding:9px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;gap:6px;border:none;cursor:pointer;font-size:13px;">
            ${Components.icon('plus', 16)}
            <span>+ Add Question</span>
          </button>
        </div>

        <!-- Filter Row: Category dropdown + Difficulty dropdown -->
        <div class="card" style="margin-bottom:20px;padding:14px 18px;">
          <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              <label for="admin-q-cat-filter" style="font-size:13px;font-weight:600;color:#475569;margin:0;white-space:nowrap;">Category:</label>
              <select id="admin-q-cat-filter" class="form-select" style="min-width:180px;height:38px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;padding:0 10px;">
                <option value="all">All Categories</option>
              </select>
            </div>

            <div style="display:flex;align-items:center;gap:8px;">
              <label for="admin-q-diff-filter" style="font-size:13px;font-weight:600;color:#475569;margin:0;white-space:nowrap;">Difficulty:</label>
              <select id="admin-q-diff-filter" class="form-select" style="min-width:140px;height:38px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;padding:0 10px;">
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div style="position:relative;flex:1;min-width:200px;max-width:320px;margin-left:auto;">
              <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;display:flex;">
                ${Components.icon('search', 16)}
              </span>
              <input 
                type="text" 
                id="admin-q-search" 
                class="form-input" 
                placeholder="Search questions..."
                style="padding-left:34px;width:100%;height:38px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;"
              >
            </div>
          </div>
        </div>

        <!-- Questions Table Card -->
        <div class="card">
          <div class="table-responsive" id="admin-q-table-container">
            ${Utils.loadingHTML('Loading questions...')}
          </div>
          <div class="card-footer flex-center" id="admin-q-pagination" style="padding:16px;border-top:1px solid #f1f5f9;display:flex;justify-content:center;"></div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.adminSidebar(),
      Components.topbar('Manage Questions', [
        { label: 'Admin', hash: '#/admin' },
        { label: 'Questions', hash: '#/admin/questions' }
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
    const container = document.getElementById('admin-q-table-container');
    const pagination = document.getElementById('admin-q-pagination');
    if (!container) return;

    let filtered = this.questions;

    // Filter by Category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(q => {
        const cId = q.category?._id || q.category?.id || q.category || q.categoryId;
        return String(cId) === String(this.selectedCategory);
      });
    }

    // Filter by Difficulty
    if (this.selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => {
        const diff = (q.difficulty || 'Medium').toString().toLowerCase();
        return diff === this.selectedDifficulty.toLowerCase();
      });
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const s = this.searchQuery.toLowerCase();
      filtered = filtered.filter(q => {
        const text = q.question || q.questionText || '';
        return text.toLowerCase().includes(s);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = Utils.emptyStateHTML(
        Components.icon('book', 40),
        'No Questions Found',
        'No questions match the selected filters. Add a new question or adjust your criteria.',
        '<button class="btn btn-primary btn-sm" onclick="window.QuizoraPages.adminQuestions.openModal()" style="margin-top: 1rem; background:#4f46e5; color:#fff;">+ Add Question</button>'
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
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;width:50%;">Question</th>
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Category</th>
            <th style="text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Difficulty</th>
            <th style="text-align:right;padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(q => {
            const qId = q._id || q.id;
            const qText = q.question || q.questionText || 'Untitled Question';
            const truncatedText = qText.length > 60 ? qText.substring(0, 60) + '...' : qText;
            const catObj = this.categories.find(c => String(c._id || c.id) === String(q.category?._id || q.category || q.categoryId));
            const catName = q.category?.name || catObj?.name || 'General';
            const diff = q.difficulty || catObj?.difficulty || 'Medium';

            return `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 16px; vertical-align: middle;">
                  <span style="font-weight: 600; color: #1e293b; font-size: 14px; line-height: 1.4;" title="${Utils.escapeHtml(qText)}">
                    ${Utils.escapeHtml(truncatedText)}
                  </span>
                </td>
                <td style="padding: 14px 16px; vertical-align: middle;">
                  <span style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    ${Utils.escapeHtml(catName)}
                  </span>
                </td>
                <td style="padding: 14px 16px; vertical-align: middle;">
                  ${this.renderDifficultyBadge(diff)}
                </td>
                <td style="text-align: right; padding: 14px 16px; vertical-align: middle;">
                  <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
                    <button 
                      class="btn btn-icon btn-sm edit-q-btn" 
                      data-id="${qId}" 
                      title="Edit Question"
                      aria-label="Edit"
                      style="border:none;background:transparent;cursor:pointer;color:#64748b;padding:6px;border-radius:4px;display:flex;align-items:center;justify-content:center;"
                    >
                      ${Components.icon('edit', 16)}
                    </button>
                    <button 
                      class="btn btn-icon btn-sm delete-q-btn" 
                      data-id="${qId}" 
                      title="Delete Question"
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
        'window.QuizoraPages.adminQuestions.setPage'
      );
    }

    container.querySelectorAll('.edit-q-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const q = this.questions.find(item => (item._id || item.id) === id);
        if (q) this.openModal(q);
      });
    });

    container.querySelectorAll('.delete-q-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.confirmDelete(id);
      });
    });
  },

  setPage: function(p) {
    this.currentPage = p;
    this.renderTable();
  },

  openModal: function(q = null) {
    const isEdit = !!q;
    const qId = q ? (q._id || q.id) : '';
    const qCatId = q ? (q.category?._id || q.category || q.categoryId || '') : '';
    const qText = q ? (q.question || q.questionText || '') : '';
    const qDiff = q ? (q.difficulty || 'Medium') : 'Medium';
    const qExpl = q ? (q.explanation || '') : '';

    let options = ['', '', '', ''];
    if (q && q.options) {
      options = q.options.map(opt => typeof opt === 'object' ? (opt.text || opt.option || '') : opt);
      while (options.length < 4) options.push('');
    }

    const currentCorrect = q ? (q.correctAnswer || '') : '';
    const optionLabels = ['A', 'B', 'C', 'D'];

    const modalHtml = `
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? 'Edit Question' : 'Add New Question'}</h3>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <form id="question-modal-form" novalidate style="max-height: 80vh; overflow-y: auto; padding-right: 4px;">
        <div class="modal-body">
          <div id="q-modal-error" class="alert alert-danger" style="display: none; margin-bottom: 1rem;"></div>

          <div class="form-row-two" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin: 0;">
              <label for="q-cat-select" class="form-label">Category *</label>
              <select id="q-cat-select" class="form-select" required>
                <option value="">Select a Category</option>
                ${this.categories.map(c => `
                  <option value="${c._id || c.id}" ${(c._id || c.id) === qCatId ? 'selected' : ''}>
                    ${Utils.escapeHtml(c.name)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group" style="margin: 0;">
              <label for="q-diff-select" class="form-label">Difficulty</label>
              <select id="q-diff-select" class="form-select">
                <option value="Easy" ${qDiff.toLowerCase() === 'easy' ? 'selected' : ''}>Easy</option>
                <option value="Medium" ${qDiff.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="Hard" ${qDiff.toLowerCase() === 'hard' ? 'selected' : ''}>Hard</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="q-text-textarea" class="form-label">Question Text *</label>
            <textarea 
              id="q-text-textarea" 
              class="form-textarea" 
              rows="3" 
              placeholder="Enter the question text..."
              required
            >${Utils.escapeHtml(qText)}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Answer Options (Select correct answer) *</label>
            <div class="options-builder-grid" style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${options.map((optVal, idx) => {
                const label = optionLabels[idx] || (idx + 1);
                const isChecked = currentCorrect && (currentCorrect === optVal || currentCorrect === label || (q && q.correctAnswerIndex === idx));
                return `
                  <div class="option-builder-row flex-align-center" style="display: flex; gap: 0.75rem; align-items: center;">
                    <label class="radio-label" title="Mark as correct answer" style="margin: 0; cursor: pointer; display: flex; align-items: center;">
                      <input 
                        type="radio" 
                        name="correct-option-radio" 
                        value="${idx}" 
                        ${isChecked ? 'checked' : (idx === 0 && !currentCorrect ? 'checked' : '')}
                        style="width: 18px; height: 18px; accent-color: #4f46e5;"
                      >
                    </label>
                    <span style="font-weight: 700; width: 28px; height: 28px; border-radius: 6px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #475569;">${label}</span>
                    <input 
                      type="text" 
                      class="form-input q-option-val" 
                      data-index="${idx}"
                      placeholder="Option ${label}..."
                      value="${Utils.escapeHtml(optVal)}"
                      required
                      style="flex: 1;"
                    >
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="form-group">
            <label for="q-expl-textarea" class="form-label">Explanation (Optional)</label>
            <textarea 
              id="q-expl-textarea" 
              class="form-textarea" 
              rows="2" 
              placeholder="Explain why this answer is correct..."
            >${Utils.escapeHtml(qExpl)}</textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Cancel</button>
          <button type="submit" id="save-q-btn" class="btn btn-primary" style="background:#4f46e5;color:#fff;">
            ${isEdit ? 'Save Changes' : 'Create Question'}
          </button>
        </div>
      </form>
    `;

    Utils.showModal(modalHtml);

    const form = document.getElementById('question-modal-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = document.getElementById('q-modal-error');
        const catSelect = document.getElementById('q-cat-select');
        const diffSelect = document.getElementById('q-diff-select');
        const qTextArea = document.getElementById('q-text-textarea');
        const explArea = document.getElementById('q-expl-textarea');
        const saveBtn = document.getElementById('save-q-btn');

        const categoryId = catSelect.value;
        const difficulty = diffSelect.value;
        const questionText = qTextArea.value.trim();
        const explanation = explArea.value.trim();

        const optInputs = Array.from(form.querySelectorAll('.q-option-val'));
        const optValues = optInputs.map(inp => inp.value.trim());

        const checkedRadio = form.querySelector('input[name="correct-option-radio"]:checked');
        const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
        const correctAnswer = optValues[correctIndex];

        if (!categoryId) {
          if (errBox) { errBox.textContent = 'Please choose a category.'; errBox.style.display = 'block'; }
          return;
        }

        if (!questionText) {
          if (errBox) { errBox.textContent = 'Question text cannot be blank.'; errBox.style.display = 'block'; }
          return;
        }

        if (optValues.some(v => !v)) {
          if (errBox) { errBox.textContent = 'All 4 options must be filled out.'; errBox.style.display = 'block'; }
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const payload = {
          category: categoryId,
          categoryId: categoryId,
          question: questionText,
          questionText: questionText,
          options: optValues,
          correctAnswer: correctAnswer,
          correctAnswerIndex: correctIndex,
          difficulty: difficulty,
          explanation: explanation
        };

        try {
          if (isEdit) {
            await API.put(`/questions/${qId}`, payload);
            Utils.showToast('Question updated successfully!', 'success');
          } else {
            await API.post('/questions', payload);
            Utils.showToast('Question created successfully!', 'success');
          }
          Utils.closeModal();
          await this.loadQuestions();
        } catch (err) {
          if (errBox) {
            errBox.textContent = err.message || 'Failed to save question.';
            errBox.style.display = 'block';
          }
          saveBtn.disabled = false;
          saveBtn.textContent = isEdit ? 'Save Changes' : 'Create Question';
        }
      });
    }
  },

  confirmDelete: function(id) {
    Utils.showConfirm(
      'Delete Question',
      'Are you sure you want to permanently delete this question from the question bank?',
      async () => {
        try {
          await API.delete(`/questions/${id}`);
          Utils.showToast('Question deleted successfully.', 'success');
          await this.loadQuestions();
        } catch (err) {
          Utils.showToast(err.message || 'Failed to delete question.', 'error');
        }
      },
      'Delete',
      'btn-danger'
    );
  },

  loadQuestions: async function() {
    const container = document.getElementById('admin-q-table-container');
    try {
      const res = await API.get('/questions');
      const data = res.data || res;
      this.questions = data.questions || (Array.isArray(data) ? data : []);
      this.renderTable();
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div style="padding: 32px 20px; text-align: center;">
            <p style="color: #ef4444; margin-bottom: 12px; font-size: 14px;">Failed to load questions: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.adminQuestions.loadQuestions()">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.currentPage = 1;
    this.selectedCategory = 'all';
    this.selectedDifficulty = 'all';
    this.searchQuery = '';

    const searchInput = document.getElementById('admin-q-search');
    const catFilter = document.getElementById('admin-q-cat-filter');
    const diffFilter = document.getElementById('admin-q-diff-filter');
    const addBtn = document.getElementById('admin-add-q-btn');

    // Fetch categories for filter dropdown
    try {
      const catRes = await API.get('/categories');
      this.categories = catRes.data?.categories || (Array.isArray(catRes.data) ? catRes.data : []);
      if (catFilter && this.categories.length > 0) {
        catFilter.innerHTML = '<option value="all">All Categories</option>' + this.categories.map(c => `
          <option value="${c._id || c.id}">${Utils.escapeHtml(c.name)}</option>
        `).join('');
      }
    } catch (e) {
      this.categories = [];
    }

    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.currentPage = 1;
        this.renderTable();
      }, 250));
    }

    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.currentPage = 1;
        this.renderTable();
      });
    }

    if (diffFilter) {
      diffFilter.addEventListener('change', (e) => {
        this.selectedDifficulty = e.target.value;
        this.currentPage = 1;
        this.renderTable();
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => this.openModal());
    }

    await this.loadQuestions();
  }
};
