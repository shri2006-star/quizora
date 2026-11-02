window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.landing = {
  render: async function() {
    return `
      <div class="landing-page">
        <!-- Public Navbar -->
        <nav class="public-navbar">
          <div class="navbar-container" style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;width:100%;">
            <a href="#/" class="navbar-brand" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
              <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;">Q</div>
              <span style="font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.025em;">Quizora</span>
            </a>
            <div style="display:flex;align-items:center;gap:32px;">
              <a href="#/" style="color:#64748b;font-size:14px;font-weight:500;text-decoration:none;">Home</a>
              <a href="#/explore" style="color:#64748b;font-size:14px;font-weight:500;text-decoration:none;">Categories</a>
              <a href="#/public-leaderboard" style="color:#64748b;font-size:14px;font-weight:500;text-decoration:none;">Leaderboard</a>
              <a href="#/" style="color:#64748b;font-size:14px;font-weight:500;text-decoration:none;">About</a>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
              <a href="#/login" class="btn btn-secondary btn-sm">Login</a>
              <a href="#/register" class="btn btn-primary btn-sm">Sign Up</a>
            </div>
          </div>
        </nav>

        <!-- Hero Section with Dark Background -->
        <section style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%);padding:80px 48px 100px;position:relative;overflow:hidden;">
          <!-- Background decoration -->
          <div style="position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>
          <div style="position:absolute;bottom:-80px;left:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(79,70,229,0.1) 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>
          
          <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:80px;">
            <!-- Left Content -->
            <div style="flex:1;">
              <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;padding:6px 16px;border-radius:9999px;font-size:13px;font-weight:600;margin-bottom:24px;letter-spacing:0.05em;">Interactive Learning Platform</div>
              <h1 style="font-size:3.2rem;font-weight:800;color:#ffffff;line-height:1.15;margin-bottom:20px;letter-spacing:-0.025em;">Sharpen Your Mind<br><span style="color:#a5b4fc;">One Quiz</span> <span style="color:#ffffff;">at Time</span></h1>
              <p style="font-size:1.1rem;color:rgba(255,255,255,0.7);max-width:460px;margin-bottom:36px;line-height:1.6;">Take quizzes, track your progress and challenge yourself!</p>
              <a href="#/explore" class="btn btn-primary btn-lg" style="font-size:16px;padding:14px 32px;">Start Exploring</a>
            </div>

            <!-- Right: Floating Quiz Preview Card -->
            <div style="flex:0 0 380px;">
              <div style="background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.4);animation:float-card 6s ease-in-out infinite;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                  <span style="font-size:12px;font-weight:700;color:#4f46e5;background:#eef2ff;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:0.05em;">Sample Question</span>
                  <span style="font-size:13px;color:#64748b;font-weight:500;">⏱ 08:45</span>
                </div>
                <h3 style="font-size:15px;font-weight:600;color:#0f172a;margin-bottom:16px;line-height:1.4;">Which data structure uses LIFO principle?</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;"><span style="width:28px;height:28px;border-radius:50%;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">A</span><span style="font-size:14px;color:#374151;">Queue</span></div>
                  <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #4f46e5;border-radius:10px;background:#eef2ff;cursor:pointer;"><span style="width:28px;height:28px;border-radius:50%;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">B</span><span style="font-size:14px;color:#4f46e5;font-weight:600;">Stack</span><span style="margin-left:auto;color:#10b981;font-size:12px;font-weight:700;">✓ Correct</span></div>
                  <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;"><span style="width:28px;height:28px;border-radius:50%;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">C</span><span style="font-size:14px;color:#374151;">Tree</span></div>
                  <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;"><span style="width:28px;height:28px;border-radius:50%;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">D</span><span style="font-size:14px;color:#374151;">Graph</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Popular Categories Section -->
        <section style="background:#f8fafc;padding:64px 48px;">
          <div style="max-width:1200px;margin:0 auto;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
              <h2 style="font-size:1.75rem;font-weight:800;color:#0f172a;">Popular Categories</h2>
              <a href="#/explore" style="color:#4f46e5;font-size:14px;font-weight:600;text-decoration:none;">View All →</a>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
              <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);border:1px solid #e2e8f0;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
                <div style="width:56px;height:56px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">💻</div>
                <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:6px;">Technology</h3>
                <p style="font-size:13px;color:#64748b;">120 Questions</p>
              </div>
              <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);border:1px solid #e2e8f0;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
                <div style="width:56px;height:56px;background:linear-gradient(135deg,#10b981,#059669);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">🔬</div>
                <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:6px;">Science</h3>
                <p style="font-size:13px;color:#64748b;">115 Questions</p>
              </div>
              <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);border:1px solid #e2e8f0;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
                <div style="width:56px;height:56px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">📐</div>
                <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:6px;">Mathematics</h3>
                <p style="font-size:13px;color:#64748b;">130 Questions</p>
              </div>
              <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);border:1px solid #e2e8f0;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
                <div style="width:56px;height:56px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">📚</div>
                <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:6px;">History</h3>
                <p style="font-size:13px;color:#64748b;">90 Questions</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async function() {
    // Landing page doesn't need afterRender logic
  }
};
