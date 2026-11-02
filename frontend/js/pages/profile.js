window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.profile = {
  render: async function() {
    const user = Auth.getUser() || {};
    const isAdmin = Auth.isAdmin();
    const sidebar = isAdmin ? Components.adminSidebar() : Components.userSidebar();

    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    const content = `
      <div class="user-profile-page">
        <!-- Profile Header Card -->
        <div class="card profile-header-card" style="margin-bottom: 2rem; padding: 2rem;">
          <div class="profile-header-layout" style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
            <div class="avatar avatar-xl profile-avatar" style="width: 80px; height: 80px; font-size: 2rem;">
              ${initial}
            </div>
            <div class="profile-header-details" style="flex: 1;">
              <div class="flex-align-center" style="gap: 0.75rem; flex-wrap: wrap;">
                <h2 class="profile-name" id="profile-display-name" style="margin: 0; font-size: 1.75rem; font-weight: 700;">
                  ${Utils.escapeHtml(user.name || 'User Profile')}
                </h2>
                <span class="badge ${isAdmin ? 'badge-danger' : 'badge-primary'}">
                  ${isAdmin ? 'Administrator' : 'Scholar'}
                </span>
              </div>
              <p class="profile-email" id="profile-display-email" style="color: var(--color-text-muted, #64748b); margin: 0.25rem 0 0.5rem;">
                ${Utils.escapeHtml(user.email || '')}
              </p>
              <div class="profile-meta-chips" style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--color-text-muted, #64748b);">
                <span>Member since: <strong id="profile-member-since">${Utils.formatDate(user.createdAt || new Date())}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Performance Summary -->
        <div class="stat-cards-grid" id="profile-stats-row" style="margin-bottom: 2rem;">
          ${Components.statCard('book', '0', 'Quizzes Taken', 'primary')}
          ${Components.statCard('target', '0%', 'Average Score', 'success')}
          ${Components.statCard('award', '0%', 'Highest Score', 'warning')}
        </div>

        <!-- Settings Forms (2 Columns) -->
        <div class="dashboard-grid-two">
          <!-- Edit Profile Information -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Edit Account Information</h3>
              <p class="card-subtitle">Update your personal display name and primary email address</p>
            </div>
            <div class="card-body">
              <div id="edit-profile-alert" class="alert" style="display: none; margin-bottom: 1rem;"></div>
              
              <form id="edit-profile-form" novalidate>
                <div class="form-group">
                  <label for="profile-name-input" class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="profile-name-input" 
                    class="form-input" 
                    value="${Utils.escapeHtml(user.name || '')}" 
                    required
                  >
                  <div class="form-feedback" id="profile-name-error"></div>
                </div>

                <div class="form-group">
                  <label for="profile-email-input" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="profile-email-input" 
                    class="form-input" 
                    value="${Utils.escapeHtml(user.email || '')}" 
                    required
                  >
                  <div class="form-feedback" id="profile-email-error"></div>
                </div>

                <button type="submit" id="save-profile-btn" class="btn btn-primary">
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Change Password -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Security & Password</h3>
              <p class="card-subtitle">Ensure your account uses a strong and protected password</p>
            </div>
            <div class="card-body">
              <div id="change-password-alert" class="alert" style="display: none; margin-bottom: 1rem;"></div>

              <form id="change-password-form" novalidate>
                <div class="form-group">
                  <label for="current-password-input" class="form-label">Current Password</label>
                  <input 
                    type="password" 
                    id="current-password-input" 
                    class="form-input" 
                    placeholder="••••••••" 
                    required
                  >
                  <div class="form-feedback" id="curr-pass-error"></div>
                </div>

                <div class="form-group">
                  <label for="new-password-input" class="form-label">New Password</label>
                  <input 
                    type="password" 
                    id="new-password-input" 
                    class="form-input" 
                    placeholder="Min. 6 characters" 
                    required
                  >
                  <div class="form-feedback" id="new-pass-error"></div>
                </div>

                <div class="form-group">
                  <label for="confirm-new-password-input" class="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirm-new-password-input" 
                    class="form-input" 
                    placeholder="Re-enter new password" 
                    required
                  >
                  <div class="form-feedback" id="confirm-pass-error"></div>
                </div>

                <button type="submit" id="change-password-btn" class="btn btn-secondary">
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      sidebar,
      Components.topbar('User Profile', [
        { label: isAdmin ? 'Admin' : 'Dashboard', hash: isAdmin ? '#/admin' : '#/dashboard' },
        { label: 'Profile', hash: '#/profile' }
      ]),
      content
    );
  },

  afterRender: async function() {
    const editForm = document.getElementById('edit-profile-form');
    const passForm = document.getElementById('change-password-form');
    const statsRow = document.getElementById('profile-stats-row');

    // Fetch fresh profile data & stats
    try {
      const res = await API.get('/auth/profile');
      const data = res.data || res;
      const user = data.user || data;
      const stats = data.stats || {};

      if (user) {
        Auth.updateUser(user);
        const nameEl = document.getElementById('profile-display-name');
        const emailEl = document.getElementById('profile-display-email');
        const memberEl = document.getElementById('profile-member-since');
        if (nameEl && user.name) nameEl.textContent = user.name;
        if (emailEl && user.email) emailEl.textContent = user.email;
        if (memberEl && user.createdAt) memberEl.textContent = Utils.formatDate(user.createdAt);
      }

      if (statsRow) {
        const total = stats.totalQuizzes || stats.quizzesTaken || 0;
        const avg = Math.round(stats.averageScore || stats.avgScore || 0);
        const best = Math.round(stats.bestScore || stats.highestScore || 0);

        statsRow.innerHTML = `
          ${Components.statCard('book', total, 'Quizzes Taken', 'primary')}
          ${Components.statCard('target', `${avg}%`, 'Average Score', 'success')}
          ${Components.statCard('award', `${best}%`, 'Highest Score', 'warning')}
        `;
      }
    } catch (err) {
      // If /auth/profile fails, fallback to dashboard stats
      try {
        const dStats = await API.get('/stats/dashboard');
        const s = dStats.data || dStats;
        if (statsRow && s) {
          statsRow.innerHTML = `
            ${Components.statCard('book', s.totalQuizzes || 0, 'Quizzes Taken', 'primary')}
            ${Components.statCard('target', `${Math.round(s.averageScore || 0)}%`, 'Average Score', 'success')}
            ${Components.statCard('award', `${Math.round(s.bestScore || 0)}%`, 'Highest Score', 'warning')}
          `;
        }
      } catch (e) {
        // Silently keep default placeholders
      }
    }

    // Handle Edit Profile Form
    if (editForm) {
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const alertBox = document.getElementById('edit-profile-alert');
        const nameInput = document.getElementById('profile-name-input');
        const emailInput = document.getElementById('profile-email-input');
        const nameError = document.getElementById('profile-name-error');
        const emailError = document.getElementById('profile-email-error');
        const submitBtn = document.getElementById('save-profile-btn');

        if (alertBox) alertBox.style.display = 'none';
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        let hasError = false;

        if (!name || name.length < 2) {
          nameError.textContent = 'Name must be at least 2 characters';
          hasError = true;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailError.textContent = 'Please enter a valid email address';
          hasError = true;
        }

        if (hasError) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
          const res = await API.put('/auth/profile', { name, email });
          const updatedUser = res.data?.user || res.data || { name, email };
          Auth.updateUser(updatedUser);

          const nameEl = document.getElementById('profile-display-name');
          const emailEl = document.getElementById('profile-display-email');
          if (nameEl) nameEl.textContent = updatedUser.name || name;
          if (emailEl) emailEl.textContent = updatedUser.email || email;

          Utils.showToast('Profile updated successfully!', 'success');
          if (alertBox) {
            alertBox.className = 'alert alert-success';
            alertBox.textContent = 'Profile details updated successfully!';
            alertBox.style.display = 'block';
          }
        } catch (err) {
          Utils.showToast(err.message || 'Failed to update profile', 'error');
          if (alertBox) {
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = err.message || 'Update failed';
            alertBox.style.display = 'block';
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Changes';
        }
      });
    }

    // Handle Change Password Form
    if (passForm) {
      passForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const alertBox = document.getElementById('change-password-alert');
        const currInput = document.getElementById('current-password-input');
        const newInput = document.getElementById('new-password-input');
        const confirmInput = document.getElementById('confirm-new-password-input');
        const currError = document.getElementById('curr-pass-error');
        const newError = document.getElementById('new-pass-error');
        const confirmError = document.getElementById('confirm-pass-error');
        const submitBtn = document.getElementById('change-password-btn');

        if (alertBox) alertBox.style.display = 'none';
        if (currError) currError.textContent = '';
        if (newError) newError.textContent = '';
        if (confirmError) confirmError.textContent = '';

        const currentPassword = currInput.value;
        const newPassword = newInput.value;
        const confirmPassword = confirmInput.value;
        let hasError = false;

        if (!currentPassword) {
          currError.textContent = 'Current password is required';
          hasError = true;
        }
        if (!newPassword || newPassword.length < 6) {
          newError.textContent = 'New password must be at least 6 characters';
          hasError = true;
        }
        if (newPassword !== confirmPassword) {
          confirmError.textContent = 'Passwords do not match';
          hasError = true;
        }

        if (hasError) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        try {
          await API.put('/auth/change-password', { currentPassword, newPassword });
          Utils.showToast('Password changed successfully!', 'success');
          passForm.reset();
          if (alertBox) {
            alertBox.className = 'alert alert-success';
            alertBox.textContent = 'Password changed successfully!';
            alertBox.style.display = 'block';
          }
        } catch (err) {
          Utils.showToast(err.message || 'Failed to change password', 'error');
          if (alertBox) {
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = err.message || 'Password update failed';
            alertBox.style.display = 'block';
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Update Password';
        }
      });
    }
  }
};
