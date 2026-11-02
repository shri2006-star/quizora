window.QuizoraPages = window.QuizoraPages || {};

const Router = {
  routes: {},
  currentPage: null,

  init() {
    // Register all routes
    this.routes = {
      '/': 'landing',
      '/login': 'login',
      '/register': 'register',
      '/explore': 'publicCategories',
      '/public-leaderboard': 'publicLeaderboard',
      '/dashboard': { page: 'dashboard', auth: true },
      '/categories': { page: 'categories', auth: true },
      '/quiz/instructions/:id': { page: 'quizInstructions', auth: true },
      '/quiz/take/:id': { page: 'quizTaking', auth: true },
      '/quiz/results/:id': { page: 'quizResults', auth: true },
      '/history': { page: 'quizHistory', auth: true },
      '/leaderboard': { page: 'leaderboard', auth: true },
      '/profile': { page: 'profile', auth: true },
      '/admin': { page: 'adminDashboard', auth: true, admin: true },
      '/admin/categories': { page: 'adminCategories', auth: true, admin: true },
      '/admin/questions': { page: 'adminQuestions', auth: true, admin: true },
      '/admin/users': { page: 'adminUsers', auth: true, admin: true },
      '/admin/results': { page: 'adminResults', auth: true, admin: true },
    };

    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  parseHash() {
    const rawHash = window.location.hash.slice(1);
    if (!rawHash) return '/';
    // Remove query params if any in hash (e.g. #/categories?search=foo)
    const cleanHash = rawHash.split('?')[0];
    return cleanHash.startsWith('/') ? cleanHash : '/' + cleanHash;
  },

  matchRoute(path) {
    // Try exact match first
    if (this.routes[path]) {
      return { route: this.routes[path], params: {} };
    }
    
    // Try parameterized routes
    for (const [pattern, route] of Object.entries(this.routes)) {
      const paramNames = [];
      const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });
      const regex = new RegExp('^' + regexStr + '$');
      const match = path.match(regex);
      if (match) {
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        return { route, params };
      }
    }
    return null;
  },

  async handleRoute() {
    const path = this.parseHash();
    const matched = this.matchRoute(path);

    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    if (!matched) {
      appContainer.innerHTML = `
        <div class="error-page text-center" style="padding: 4rem 1rem;">
          <h1 style="font-size: 5rem; font-weight: 800; color: var(--color-primary, #4f46e5); margin-bottom: 1rem;">404</h1>
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Page Not Found</h2>
          <p style="color: var(--color-text-muted, #64748b); margin-bottom: 2rem;">The page you requested does not exist or has been moved.</p>
          <a href="#/" class="btn btn-primary">Return Home</a>
        </div>
      `;
      return;
    }

    let { route, params } = matched;
    let pageName = typeof route === 'string' ? route : route.page;
    let requiresAuth = typeof route === 'object' ? !!route.auth : false;
    let requiresAdmin = typeof route === 'object' ? !!route.admin : false;

    // Auth guards
    if (requiresAuth && (!Auth || !Auth.isAuthenticated())) {
      window.location.hash = '#/login';
      return;
    }
    if (requiresAdmin && (!Auth || !Auth.isAdmin())) {
      window.location.hash = '#/dashboard';
      if (typeof Utils !== 'undefined' && Utils.showToast) {
        Utils.showToast('Access denied. Admin privileges required.', 'error');
      }
      return;
    }

    // Redirect authenticated users away from login/register
    if ((pageName === 'login' || pageName === 'register') && Auth && Auth.isAuthenticated()) {
      window.location.hash = Auth.isAdmin() ? '#/admin' : '#/dashboard';
      return;
    }

    const page = window.QuizoraPages[pageName];
    if (!page) {
      appContainer.innerHTML = `
        <div class="error-page text-center" style="padding: 4rem 1rem;">
          <h2>Module Not Found</h2>
          <p style="color: var(--color-text-muted, #64748b);">The page module "${Utils.escapeHtml(pageName)}" is not registered.</p>
          <a href="#/" class="btn btn-primary" style="margin-top: 1rem;">Return Home</a>
        </div>
      `;
      return;
    }

    try {
      // Show loading indicator
      appContainer.innerHTML = Utils.loadingHTML();
      
      // Render page HTML
      const html = await page.render(params);
      appContainer.innerHTML = html;
      
      // Post-render logic
      if (page.afterRender) {
        await page.afterRender(params);
      }

      // Setup sidebar logout handlers
      const logoutBtn = document.getElementById('sidebar-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Utils.showConfirm('Logout', 'Are you sure you want to log out of your account?', () => {
            Auth.logout();
            window.location.hash = '#/';
            Utils.showToast('Logged out successfully', 'success');
          }, 'Logout', 'btn-danger');
        });
      }

      // Setup sidebar toggle
      const sidebarToggle = document.getElementById('sidebar-toggle');
      if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
          const sidebar = document.getElementById('sidebar');
          const mainContent = document.querySelector('.main-content');
          if (sidebar) sidebar.classList.toggle('collapsed');
          if (mainContent) mainContent.classList.toggle('expanded');
        });
      }

      // Setup mobile menu toggle for public navbar
      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      const navLinks = document.getElementById('navbar-links');
      if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }

      this.currentPage = pageName;
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Route error:', error);
      appContainer.innerHTML = `
        <div class="error-page text-center" style="padding: 4rem 1rem;">
          <h1>Oops!</h1>
          <p style="color: var(--color-danger, #ef4444); margin: 1rem 0;">${Utils.escapeHtml(error.message || 'Something went wrong')}</p>
          <a href="#/" class="btn btn-primary">Return Home</a>
        </div>
      `;
    }
  },

  navigate(hash) {
    window.location.hash = hash;
  }
};

window.Router = Router;

// Initialize router when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Router.init());
} else {
  Router.init();
}
