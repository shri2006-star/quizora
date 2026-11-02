const API = {
  baseURL: '/api',

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (typeof Auth !== 'undefined' && Auth.getToken) {
      const token = Auth.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(method, endpoint, data = null) {
    const config = { method, headers: this.getHeaders() };
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      let json = {};
      try {
        json = await response.json();
      } catch (parseErr) {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof Auth !== 'undefined' && Auth.logout) {
            Auth.logout();
          }
          window.location.hash = '#/login';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(json.message || json.error || 'Something went wrong');
      }
      return json;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  },

  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, data) { return this.request('POST', endpoint, data); },
  put(endpoint, data) { return this.request('PUT', endpoint, data); },
  delete(endpoint) { return this.request('DELETE', endpoint); }
};

window.API = API;
