const Utils = {
  // Format date to "Oct 23, 2026"
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Format seconds to "MM:SS"
  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  // Format relative time "2 hours ago"
  timeAgo(dateString) {
    if (!dateString) return 'N/A';
    const now = new Date();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return Utils.formatDate(dateString);
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  },

  // Debounce function
  debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${Utils.escapeHtml(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">×</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Show modal
  showModal(content, options = {}) {
    let overlay = document.getElementById('modal-overlay');
    let modal = document.getElementById('modal-content');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = '<div class="modal-content" id="modal-content"></div>';
      document.body.appendChild(overlay);
      modal = document.getElementById('modal-content');
    }
    modal.innerHTML = content;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('active'));
    
    if (options.onClose) {
      overlay._onClose = options.onClose;
    }
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) Utils.closeModal();
    };
  },

  // Close modal
  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      if (overlay._onClose) {
        overlay._onClose();
        overlay._onClose = null;
      }
    }, 200);
  },

  // Confirm dialog
  showConfirm(title, message, onConfirm, confirmText = 'Confirm', confirmClass = 'btn-danger') {
    Utils.showModal(`
      <div class="modal-header">
        <h3 class="modal-title">${Utils.escapeHtml(title)}</h3>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="modal-body"><p>${Utils.escapeHtml(message)}</p></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Utils.closeModal()">Cancel</button>
        <button class="btn ${confirmClass}" id="confirm-action-btn">${Utils.escapeHtml(confirmText)}</button>
      </div>
    `);
    const actionBtn = document.getElementById('confirm-action-btn');
    if (actionBtn) {
      actionBtn.onclick = () => {
        Utils.closeModal();
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
  },

  // Get difficulty badge HTML
  difficultyBadge(difficulty) {
    const diff = (difficulty || 'Medium').toString();
    const normalized = diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase();
    const colors = { Easy: 'success', Medium: 'warning', Hard: 'danger' };
    return `<span class="badge badge-${colors[normalized] || 'info'}">${Utils.escapeHtml(normalized)}</span>`;
  },

  // Get score status badge
  scoreBadge(percentage) {
    const p = Number(percentage) || 0;
    if (p >= 80) return '<span class="badge badge-success">Passed</span>';
    if (p >= 50) return '<span class="badge badge-warning">Average</span>';
    return '<span class="badge badge-danger">Failed</span>';
  },

  // Generate pagination HTML
  paginationHTML(currentPage, totalPages, onClickFn) {
    if (!totalPages || totalPages <= 1) return '';
    let html = '<div class="pagination">';
    html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="${onClickFn}(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="${onClickFn}(${i})">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += '<span class="page-ellipsis">…</span>';
      }
    }
    html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="${onClickFn}(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">›</button>`;
    html += '</div>';
    return html;
  },

  // Loading spinner HTML
  loadingHTML(message = 'Loading...') {
    return `<div class="loading-state"><div class="spinner"></div><p>${Utils.escapeHtml(message)}</p></div>`;
  },

  // Empty state HTML
  emptyStateHTML(icon, title, message, actionHTML = '') {
    return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${Utils.escapeHtml(title)}</h3><p>${Utils.escapeHtml(message)}</p>${actionHTML}</div>`;
  },

  // Get greeting based on time
  getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
};

window.Utils = Utils;
