const Auth = {
  TOKEN_KEY: 'quizora_token',
  USER_KEY: 'quizora_user',

  async login(email, password) {
    const res = await API.post('/auth/login', { email, password });
    const token = res.token || (res.data && res.data.token);
    // Backend returns user info directly in res.data (not res.data.user)
    const user = res.user || (res.data && res.data.user) || (res.data && res.data.id ? res.data : null);
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    return res;
  },

  async register(name, email, password) {
    const res = await API.post('/auth/register', { name, email, password });
    const token = res.token || (res.data && res.data.token);
    const user = res.user || (res.data && res.data.user) || (res.data && res.data.id ? res.data : null);
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    return res;
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return !!(user && user.role === 'admin');
  },

  updateUser(userData) {
    const currentUser = this.getUser() || {};
    const updated = { ...currentUser, ...userData };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
  }
};

window.Auth = Auth;
