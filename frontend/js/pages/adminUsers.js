window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.adminUsers = {
  users: [],
  searchQuery: '',
  roleFilter: 'all',
  currentPage: 1,
  limit: 10,

  render: async function() {
    const content = `
      <div class="admin-users-page">
        <!-- Search and Filter Toolbar -->
        <div class="card" style="padding: 1.25rem; margin-bottom: 2rem;">
          <div class="toolbar-grid flex-between" style="flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; flex: 1;">
              <div class="search-input-wrapper" style="flex: 1; min-width: 240px; max-width: 380px;">
                <span class="search-icon">${Components.icon('search', 18)}</span>
                <input 
                  type="text" 
                  id="admin-user-search" 
                  class="form-input search-input" 
                  placeholder="Search scholars by name or email..."
                >
              </div>

              <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem;">
                <label for="admin-user-role-filter" class="form-label" style="margin: 0; white-space: nowrap;">Role:</label>
                <select id="admin-user-role-filter" class="form-select" style="min-width: 130px;">
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student / User</option>
                </select>
              </div>
            </div>

            <span id="admin-users-count-badge" class="badge badge-secondary">0 Registered</span>
          </div>
        </div>

        <!-- Users Table Card -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">User Accounts Registry</h3>
            <p class="card-subtitle">View registered scholars, administrators, access privileges, and account activity</p>
          </div>

          <div class="table-responsive" id="admin-users-table-container">
            ${Utils.loadingHTML('Loading user accounts...')}
          </div>

          <div class="card-footer flex-center" id="admin-users-pagination"></div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.adminSidebar(),
      Components.topbar('Manage Users', [
        { label: 'Admin', hash: '#/admin' },
        { label: 'Users', hash: '#/admin/users' }
      ]),
      content
    );
  },

  renderTable: function() {
    const container = document.getElementById('admin-users-table-container');
    const pagination = document.getElementById('admin-users-pagination');
    const countBadge = document.getElementById('admin-users-count-badge');
    if (!container) return;

    let filtered = this.users;

    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(u => (u.role || 'student').toLowerCase() === this.roleFilter.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q))
      );
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'User' : 'Users'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = Utils.emptyStateHTML(
        Components.icon('users', 40),
        'No Users Found',
        'No user accounts match your search and filter criteria.'
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
            <th>Email Address</th>
            <th class="text-center">Role</th>
            <th class="text-center">Registered Date</th>
            <th class="text-center">Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(user => {
            const uId = user._id || user.id;
            const name = user.name || 'Anonymous';
            const email = user.email || 'N/A';
            const role = user.role || 'student';
            const isAdmin = role.toLowerCase() === 'admin';
            const date = user.createdAt || new Date();
            const initial = name.charAt(0).toUpperCase();

            return `
              <tr>
                <td>
                  <div class="table-user-cell">
                    <div class="avatar avatar-sm ${isAdmin ? 'avatar-danger' : 'avatar-primary'}">${initial}</div>
                    <span class="font-bold text-dark">${Utils.escapeHtml(name)}</span>
                  </div>
                </td>
                <td>
                  <span class="text-muted font-mono" style="font-size: 0.9rem;">${Utils.escapeHtml(email)}</span>
                </td>
                <td class="text-center">
                  <span class="badge ${isAdmin ? 'badge-danger' : 'badge-primary'}">
                    ${isAdmin ? 'Admin' : 'Student'}
                  </span>
                </td>
                <td class="text-center">
                  <span>${Utils.formatDate(date)}</span>
                  <span class="text-muted" style="font-size: 0.8rem; display: block;">${Utils.timeAgo(date)}</span>
                </td>
                <td class="text-center">
                  <span class="badge badge-success">Active</span>
                </td>
                <td class="text-right">
                  <button 
                    class="btn btn-outline-primary btn-sm view-user-btn" 
                    data-id="${uId}"
                    title="View user details"
                  >
                    ${Components.icon('eye', 14)}
                    <span>Details</span>
                  </button>
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
        'window.QuizoraPages.adminUsers.setPage'
      );
    }

    container.querySelectorAll('.view-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const user = this.users.find(u => (u._id || u.id) === id);
        if (user) this.showUserDetails(user);
      });
    });
  },

  setPage: function(p) {
    this.currentPage = p;
    this.renderTable();
  },

  showUserDetails: function(user) {
    const name = user.name || 'User';
    const email = user.email || 'N/A';
    const role = user.role || 'student';
    const date = user.createdAt ? Utils.formatDate(user.createdAt) : 'Unknown';
    const initial = name.charAt(0).toUpperCase();

    const modalHtml = `
      <div class="modal-header">
        <h3 class="modal-title">Scholar Account Profile</h3>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="flex-align-center" style="gap: 1.25rem; margin-bottom: 1.5rem;">
          <div class="avatar avatar-lg" style="width: 56px; height: 56px; font-size: 1.5rem;">${initial}</div>
          <div>
            <h3 style="margin: 0; font-size: 1.3rem;">${Utils.escapeHtml(name)}</h3>
            <span class="text-muted" style="font-size: 0.95rem;">${Utils.escapeHtml(email)}</span>
          </div>
        </div>

        <div class="user-details-list card" style="background: var(--color-surface, #f8fafc); padding: 1.25rem; border-radius: 8px;">
          <div class="flex-between" style="margin-bottom: 0.75rem;">
            <span class="text-muted">Account ID:</span>
            <span class="font-mono" style="font-size: 0.85rem;">${user._id || user.id || 'N/A'}</span>
          </div>
          <div class="flex-between" style="margin-bottom: 0.75rem;">
            <span class="text-muted">Access Privilege:</span>
            <span class="badge ${role === 'admin' ? 'badge-danger' : 'badge-primary'}">${role.toUpperCase()}</span>
          </div>
          <div class="flex-between" style="margin-bottom: 0.75rem;">
            <span class="text-muted">Registered Date:</span>
            <span class="font-medium">${date}</span>
          </div>
          <div class="flex-between">
            <span class="text-muted">Account Status:</span>
            <span class="badge badge-success">Active</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="Utils.closeModal()">Close</button>
      </div>
    `;

    Utils.showModal(modalHtml);
  },

  loadUsers: async function() {
    const container = document.getElementById('admin-users-table-container');
    try {
      const res = await API.get('/users');
      const data = res.data || res;
      this.users = data.users || (Array.isArray(data) ? data : []);
      this.renderTable();
    } catch (err) {
      if (container) {
        container.innerHTML = `
          <div class="error-inline text-center" style="padding: 2.5rem;">
            <p style="color: var(--color-danger, #ef4444); margin-bottom: 1rem;">Failed to load users: ${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-secondary btn-sm" onclick="window.QuizoraPages.adminUsers.loadUsers()">Retry</button>
          </div>
        `;
      }
    }
  },

  afterRender: async function() {
    this.currentPage = 1;
    this.searchQuery = '';
    this.roleFilter = 'all';

    const searchInput = document.getElementById('admin-user-search');
    const roleSelect = document.getElementById('admin-user-role-filter');

    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.searchQuery = e.target.value.trim();
        this.currentPage = 1;
        this.renderTable();
      }, 250));
    }

    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.roleFilter = e.target.value;
        this.currentPage = 1;
        this.renderTable();
      });
    }

    await this.loadUsers();
  }
};
