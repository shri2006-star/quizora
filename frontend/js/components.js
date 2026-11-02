const Components = {
  icons: {
    home: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    grid: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    trophy: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    'x-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    'chevron-left': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
    'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
    'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
    book: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    filter: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    award: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    target: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
    'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    'help-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    bookmark: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
    'alert-triangle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
  },

  icon(name, size) {
    const svg = this.icons[name] || '';
    if (size && svg) {
      return svg.replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`);
    }
    return svg;
  },

  // User sidebar for authenticated users
  userSidebar() {
    const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
    const currentHash = window.location.hash || '#/dashboard';
    const navItems = [
      { section: 'MAIN', items: [
        { icon: 'home', label: 'Dashboard', hash: '#/dashboard' },
        { icon: 'grid', label: 'Categories', hash: '#/categories' },
        { icon: 'clock', label: 'History', hash: '#/history' },
        { icon: 'trophy', label: 'Leaderboard', hash: '#/leaderboard' },
      ]},
      { section: 'ACCOUNT', items: [
        { icon: 'user', label: 'Profile', hash: '#/profile' },
      ]}
    ];

    let navHTML = '';
    navItems.forEach(section => {
      navHTML += `<div class="sidebar-section"><div class="sidebar-section-title">${section.section}</div>`;
      section.items.forEach(item => {
        const active = (item.hash === '#/dashboard' ? currentHash === '#/dashboard' : currentHash.startsWith(item.hash)) ? 'active' : '';
        navHTML += `<a href="${item.hash}" class="nav-link ${active}"><span class="nav-icon">${Components.icon(item.icon)}</span><span>${item.label}</span></a>`;
      });
      navHTML += '</div>';
    });

    const initial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <a href="#/dashboard" class="brand-wrapper">
            <div class="brand-icon">Q</div>
            <span class="brand-title">Quizora</span>
          </a>
        </div>
        <nav class="sidebar-nav">${navHTML}</nav>
        <div class="sidebar-footer">
          <div class="user-card">
            <div class="avatar avatar-sm">${initial}</div>
            <div class="user-info">
              <div class="user-name">${user ? Utils.escapeHtml(user.name) : 'User'}</div>
              <div class="user-role">${user ? Utils.escapeHtml(user.role || 'Student') : 'Student'}</div>
            </div>
          </div>
          <a href="#" class="nav-link" id="sidebar-logout"><span class="nav-icon">${Components.icon('logout')}</span><span>Logout</span></a>
        </div>
      </aside>`;
  },

  // Admin sidebar
  adminSidebar() {
    const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
    const currentHash = window.location.hash || '#/admin';
    const navItems = [
      { icon: 'home', label: 'Dashboard', hash: '#/admin' },
      { icon: 'grid', label: 'Categories', hash: '#/admin/categories' },
      { icon: 'book', label: 'Questions', hash: '#/admin/questions' },
      { icon: 'users', label: 'Users', hash: '#/admin/users' },
      { icon: 'bar-chart', label: 'Results', hash: '#/admin/results' },
      { icon: 'settings', label: 'Settings', hash: '#/profile' },
    ];

    let navHTML = '<div class="sidebar-section">';
    navItems.forEach(item => {
      const active = (item.hash === '#/admin' ? currentHash === '#/admin' : currentHash.startsWith(item.hash)) ? 'active' : '';
      navHTML += `<a href="${item.hash}" class="nav-link ${active}"><span class="nav-icon">${Components.icon(item.icon)}</span><span>${item.label}</span></a>`;
    });
    navHTML += '</div>';

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <a href="#/admin" class="brand-wrapper">
            <div class="brand-icon">Q</div>
            <span class="brand-title">Quizora</span>
          </a>
          <span class="admin-badge">Admin</span>
        </div>
        <nav class="sidebar-nav">${navHTML}</nav>
        <div class="sidebar-footer">
          <a href="#" class="nav-link" id="sidebar-logout"><span class="nav-icon">${Components.icon('logout')}</span><span>Logout</span></a>
        </div>
      </aside>`;
  },

  // Top bar
  topbar(title, breadcrumbs = []) {
    let breadcrumbHTML = '';
    if (breadcrumbs && breadcrumbs.length) {
      breadcrumbHTML = '<div class="breadcrumb">' + breadcrumbs.map((b, i) => 
        i < breadcrumbs.length - 1 
          ? `<a href="${b.hash}" class="breadcrumb-link">${Utils.escapeHtml(b.label)}</a><span class="breadcrumb-sep">/</span>` 
          : `<span class="breadcrumb-current">${Utils.escapeHtml(b.label)}</span>`
      ).join('') + '</div>';
    }
    const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
    const userName = user && user.name ? Utils.escapeHtml(user.name) : 'User';
    const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return `
      <header class="topbar">
        <div class="topbar-left">
          <button class="btn btn-icon sidebar-toggle" id="sidebar-toggle" aria-label="Toggle Sidebar">${Components.icon('menu')}</button>
          <div class="topbar-title-group">
            <h1 class="page-title">${Utils.escapeHtml(title)}</h1>
            ${breadcrumbHTML}
          </div>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <div class="input-icon-wrap">
              <span class="input-icon-left">${Components.icon('search', 16)}</span>
              <input type="text" class="form-control form-control-sm" placeholder="Search..." id="topbar-search-input" />
            </div>
          </div>
          <div class="topbar-user">
            <div class="avatar avatar-sm">${userInitial}</div>
            <span class="topbar-username">${userName}</span>
          </div>
        </div>
      </header>`;
  },

  // Dashboard layout wrapper
  dashboardLayout(sidebar, topbar, content) {
    return `
      <div class="app-layout">
        ${sidebar}
        <div class="main-content">
          ${topbar}
          <div class="content-area">${content}</div>
        </div>
      </div>`;
  },

  // Stat card
  statCard(icon, value, label, color = 'primary') {
    return `
      <div class="stat-card stat-card-${color}">
        <div class="stat-icon"><span>${Components.icon(icon, 24)}</span></div>
        <div class="stat-info">
          <div class="stat-value">${Utils.escapeHtml(String(value))}</div>
          <div class="stat-label">${Utils.escapeHtml(label)}</div>
        </div>
      </div>`;
  },

  // Public navbar
  publicNavbar() {
    const isAuth = typeof Auth !== 'undefined' && Auth.isAuthenticated();
    const isAdmin = isAuth && Auth.isAdmin();
    return `
      <nav class="public-navbar">
        <div class="navbar-container">
          <a href="#/" class="navbar-brand">
            <div class="brand-icon">Q</div>
            <span>Quizora</span>
          </a>
          <div class="navbar-links" id="navbar-links">
            <a href="#/" class="navbar-link">Home</a>
            <a href="#/explore" class="navbar-link">Categories</a>
            <a href="#/public-leaderboard" class="navbar-link">Leaderboard</a>
          </div>
          <div class="navbar-actions">
            ${isAuth 
              ? `<a href="#/${isAdmin ? 'admin' : 'dashboard'}" class="btn btn-primary">${isAdmin ? 'Admin Dashboard' : 'Dashboard'}</a>`
              : `<a href="#/login" class="btn btn-secondary">Login</a><a href="#/register" class="btn btn-primary">Sign Up</a>`
            }
          </div>
          <button class="btn btn-icon mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Menu">${Components.icon('menu')}</button>
        </div>
      </nav>`;
  }
};

window.Components = Components;
