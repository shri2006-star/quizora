window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.login = {
  render: async function() {
    return `
  <div style="min-height:100vh;display:flex;">
    <!-- Left Dark Panel -->
    <div style="flex:0 0 45%;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%);border-radius:50%;"></div>
      <a href="#/" style="display:flex;align-items:center;gap:10px;text-decoration:none;position:relative;z-index:1;">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;">Q</div>
        <span style="font-size:20px;font-weight:800;color:#ffffff;">Quizora</span>
      </a>
      <div style="position:relative;z-index:1;">
        <h2 style="font-size:2.2rem;font-weight:800;color:#ffffff;margin-bottom:16px;line-height:1.2;">Welcome Back!</h2>
        <p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:40px;line-height:1.6;">Login to continue your learning journey.</p>
        <div style="font-size:80px;text-align:center;margin:20px 0;">📖</div>
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.4);position:relative;z-index:1;">© 2025 Quizora. All rights reserved.</div>
    </div>

    <!-- Right Form Panel -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#f8fafc;">
      <div style="width:100%;max-width:400px;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;margin-bottom:6px;">Login</h2>
        <p style="font-size:14px;color:#64748b;margin-bottom:32px;">Enter your email and password</p>

        <div id="login-alert" class="alert alert-danger" style="display:none;margin-bottom:16px;"></div>

        <form id="login-form" novalidate>
          <div style="margin-bottom:20px;">
            <label for="login-email" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Email Address</label>
            <input type="email" id="login-email" name="email" class="form-input" placeholder="name@example.com" required autocomplete="email" style="width:100%;">
            <div class="form-feedback" id="email-error"></div>
          </div>
          <div style="margin-bottom:8px;">
            <label for="login-password" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Password</label>
            <input type="password" id="login-password" name="password" class="form-input" placeholder="••••••••" required autocomplete="current-password" style="width:100%;">
            <div class="form-feedback" id="password-error"></div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#64748b;cursor:pointer;"><input type="checkbox"> Remember me</label>
            <a href="#" style="font-size:13px;color:#4f46e5;font-weight:500;">Forgot password?</a>
          </div>
          <button type="submit" id="login-submit-btn" class="btn btn-primary btn-block" style="height:48px;font-size:15px;font-weight:600;">
            <span class="btn-text">Login</span>
            <span class="btn-spinner" style="display:none;">Signing in...</span>
          </button>
        </form>

        <p style="text-align:center;margin-top:24px;font-size:14px;color:#64748b;">Don't have an account? <a href="#/register" style="color:#4f46e5;font-weight:600;">Sign Up</a></p>
      </div>
    </div>
  </div>
`;
  },

  afterRender: async function() {
    const form = document.getElementById('login-form');
    const alertBox = document.getElementById('login-alert');
    const submitBtn = document.getElementById('login-submit-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    if (!form) return;

    function clearErrors() {
      if (alertBox) {
        alertBox.style.display = 'none';
        alertBox.textContent = '';
      }
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';
      emailInput?.classList.remove('input-invalid');
      passwordInput?.classList.remove('input-invalid');
    }

    emailInput?.addEventListener('input', () => {
      emailError.textContent = '';
      emailInput.classList.remove('input-invalid');
      if (alertBox) alertBox.style.display = 'none';
    });

    passwordInput?.addEventListener('input', () => {
      passwordError.textContent = '';
      passwordInput.classList.remove('input-invalid');
      if (alertBox) alertBox.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let hasError = false;

      // Validation
      if (!email) {
        emailError.textContent = 'Email is required';
        emailInput.classList.add('input-invalid');
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('input-invalid');
        hasError = true;
      }

      if (!password) {
        passwordError.textContent = 'Password is required';
        passwordInput.classList.add('input-invalid');
        hasError = true;
      }

      if (hasError) return;

      // Submit state
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';

      try {
        const res = await Auth.login(email, password);
        Utils.showToast('Login successful! Redirecting...', 'success');
        
        // Check if admin or regular user
        if (Auth.isAdmin()) {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/dashboard';
        }
      } catch (err) {
        if (alertBox) {
          alertBox.textContent = err.message || 'Invalid email or password';
          alertBox.style.display = 'block';
        }
        Utils.showToast(err.message || 'Login failed', 'error');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }
};
