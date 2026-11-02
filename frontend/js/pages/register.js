window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.register = {
  render: async function() {
    return `
  <div style="min-height:100vh;display:flex;">
    <div style="flex:0 0 45%;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%);border-radius:50%;"></div>
      <a href="#/" style="display:flex;align-items:center;gap:10px;text-decoration:none;position:relative;z-index:1;">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;">Q</div>
        <span style="font-size:20px;font-weight:800;color:#ffffff;">Quizora</span>
      </a>
      <div style="position:relative;z-index:1;">
        <h2 style="font-size:2rem;font-weight:800;color:#ffffff;margin-bottom:14px;line-height:1.2;">Join the Quiz Community</h2>
        <p style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:40px;">Start your learning journey today.</p>
        <div style="font-size:80px;text-align:center;margin:20px 0;">📋</div>
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.4);position:relative;z-index:1;">© 2025 Quizora. All rights reserved.</div>
    </div>

    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#f8fafc;overflow-y:auto;">
      <div style="width:100%;max-width:400px;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;margin-bottom:6px;">Create Account</h2>
        <p style="font-size:14px;color:#64748b;margin-bottom:28px;">Fill in your details to register</p>

        <div id="register-alert" class="alert alert-danger" style="display:none;margin-bottom:16px;"></div>

        <form id="register-form" novalidate>
          <div style="margin-bottom:16px;">
            <label for="reg-name" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Full Name</label>
            <input type="text" id="reg-name" name="name" class="form-input" placeholder="Alex Morgan" required autocomplete="name" style="width:100%;">
            <div class="form-feedback" id="name-error"></div>
          </div>
          <div style="margin-bottom:16px;">
            <label for="reg-email" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Email Address</label>
            <input type="email" id="reg-email" name="email" class="form-input" placeholder="alex@example.com" required autocomplete="email" style="width:100%;">
            <div class="form-feedback" id="reg-email-error"></div>
          </div>
          <div style="margin-bottom:16px;">
            <label for="reg-password" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Password</label>
            <input type="password" id="reg-password" name="password" class="form-input" placeholder="At least 6 characters" required autocomplete="new-password" style="width:100%;">
            <div class="password-strength-container" style="margin-top:6px;">
              <div style="height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden;"><div id="strength-bar" style="height:100%;width:0%;transition:width 0.3s,background-color 0.3s;"></div></div>
              <span id="strength-text" style="font-size:12px;color:#94a3b8;margin-top:4px;display:inline-block;"></span>
            </div>
            <div class="form-feedback" id="reg-password-error"></div>
          </div>
          <div style="margin-bottom:24px;">
            <label for="reg-confirm-password" style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Confirm Password</label>
            <input type="password" id="reg-confirm-password" name="confirmPassword" class="form-input" placeholder="Re-enter password" required autocomplete="new-password" style="width:100%;">
            <div class="form-feedback" id="reg-confirm-error"></div>
          </div>
          <button type="submit" id="register-submit-btn" class="btn btn-primary btn-block" style="height:48px;font-size:15px;font-weight:600;">
            <span class="btn-text">Register</span>
            <span class="btn-spinner" style="display:none;">Creating account...</span>
          </button>
        </form>

        <p style="text-align:center;margin-top:20px;font-size:14px;color:#64748b;">Already have an account? <a href="#/login" style="color:#4f46e5;font-weight:600;">Login</a></p>
      </div>
    </div>
  </div>
`;
  },

  afterRender: async function() {
    const form = document.getElementById('register-form');
    const alertBox = document.getElementById('register-alert');
    const submitBtn = document.getElementById('register-submit-btn');
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('reg-email-error');
    const passwordError = document.getElementById('reg-password-error');
    const confirmError = document.getElementById('reg-confirm-error');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (!form) return;

    // Password strength evaluator
    passwordInput?.addEventListener('input', () => {
      const val = passwordInput.value;
      let score = 0;
      if (val.length >= 6) score += 25;
      if (val.length >= 10) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 25;

      strengthBar.style.width = score + '%';
      if (score === 0) {
        strengthBar.style.backgroundColor = 'transparent';
        strengthText.textContent = '';
      } else if (score <= 25) {
        strengthBar.style.backgroundColor = '#ef4444';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ef4444';
      } else if (score <= 50) {
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthText.textContent = 'Fair';
        strengthText.style.color = '#f59e0b';
      } else if (score <= 75) {
        strengthBar.style.backgroundColor = '#3b82f6';
        strengthText.textContent = 'Good';
        strengthText.style.color = '#3b82f6';
      } else {
        strengthBar.style.backgroundColor = '#10b981';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#10b981';
      }

      passwordError.textContent = '';
      passwordInput.classList.remove('input-invalid');
    });

    [nameInput, emailInput, confirmInput].forEach(inp => {
      inp?.addEventListener('input', () => {
        inp.classList.remove('input-invalid');
        const feedback = inp.parentElement.querySelector('.form-feedback');
        if (feedback) feedback.textContent = '';
        if (alertBox) alertBox.style.display = 'none';
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (alertBox) alertBox.style.display = 'none';

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      let hasError = false;

      if (!name || name.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        nameInput.classList.add('input-invalid');
        hasError = true;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('input-invalid');
        hasError = true;
      }

      if (!password || password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordInput.classList.add('input-invalid');
        hasError = true;
      }

      if (password !== confirmPassword) {
        confirmError.textContent = 'Passwords do not match';
        confirmInput.classList.add('input-invalid');
        hasError = true;
      }

      if (hasError) return;

      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';

      try {
        await Auth.register(name, email, password);
        Utils.showToast('Registration successful! Welcome to Quizora.', 'success');
        window.location.hash = '#/dashboard';
      } catch (err) {
        if (alertBox) {
          alertBox.textContent = err.message || 'Registration failed. Please try again.';
          alertBox.style.display = 'block';
        }
        Utils.showToast(err.message || 'Registration failed', 'error');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }
};
