window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.quizInstructions = {
  render: async function(params) {
    const categoryId = params?.id || '';
    const categoryName = '';

    const content = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div class="card" style="max-width:560px;width:100%;padding:48px;text-align:center;">
          <!-- Icon -->
          <div style="width:72px;height:72px;background:#eef2ff;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;font-size:32px;">📋</div>
          
          <!-- Title -->
          <h2 style="font-size:1.5rem;font-weight:800;color:#0f172a;margin-bottom:8px;" id="instructions-category-name">${categoryName ? Utils.escapeHtml(categoryName) + ' ' : ''}Quiz</h2>
          <h3 style="font-size:1.1rem;font-weight:600;color:#4f46e5;margin-bottom:28px;">Instructions</h3>
          
          <!-- Rules -->
          <div style="text-align:left;background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
              <li style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#374151;"><span style="color:#4f46e5;font-weight:700;flex-shrink:0;">•</span> Each question has 4 options.</li>
              <li style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#374151;"><span style="color:#4f46e5;font-weight:700;flex-shrink:0;">•</span> You have 15 minutes to complete.</li>
              <li style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#374151;"><span style="color:#4f46e5;font-weight:700;flex-shrink:0;">•</span> Minimum score to pass: 60%.</li>
            </ul>
          </div>
          
          <!-- Meta -->
          <div style="display:flex;align-items:center;justify-content:center;gap:24px;background:#f1f5f9;border-radius:8px;padding:14px;margin-bottom:32px;font-size:13px;color:#64748b;font-weight:600;">
            <span>Total Questions: <strong id="instr-q-count" style="color:#0f172a;">10</strong></span>
            <span style="color:#cbd5e1;">|</span>
            <span>Time Limit: <strong style="color:#0f172a;">15 min</strong></span>
          </div>
          
          <!-- Start Button -->
          <a href="#/quiz/take/${categoryId}" id="start-quiz-btn" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;font-size:16px;height:52px;">Start Quiz</a>
        </div>
      </div>
    `;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Quiz Instructions', [
        { label: 'Dashboard', hash: '#/dashboard' },
        { label: 'Categories', hash: '#/categories' },
        { label: 'Instructions', hash: `#/quiz/instructions/${categoryId}` }
      ]),
      content
    );
  },

  afterRender: async function(params) {
    const categoryId = params?.id;
    if (!categoryId) return;

    try {
      let category = null;
      try {
        const res = await API.get(`/categories/${categoryId}`);
        category = res.data?.category || res.data || res;
      } catch (e) {
        // Fallback: list all and find
        const allRes = await API.get('/categories');
        const list = allRes.data?.categories || (Array.isArray(allRes.data) ? allRes.data : []);
        category = list.find(c => (c._id || c.id) === categoryId) || { name: 'Quiz Assessment', description: 'General assessment' };
      }

      const catName = category?.name || 'Quiz Assessment';
      const questionCount = category?.questionCount !== undefined ? category.questionCount : (category?.questions?.length || 10);

      const titleEl = document.getElementById('instructions-category-name');
      if (titleEl) {
        titleEl.textContent = `${catName} Quiz`;
      }

      const countEl = document.getElementById('instr-q-count');
      if (countEl) {
        countEl.textContent = questionCount;
      }

      const startBtn = document.getElementById('start-quiz-btn');
      if (startBtn) {
        startBtn.href = `#/quiz/take/${categoryId}`;
      }
    } catch (err) {
      console.error('Failed to load category details for instructions:', err);
    }
  }
};
