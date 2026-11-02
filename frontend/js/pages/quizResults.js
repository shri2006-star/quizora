window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.quizResults = {
  render: async function(params) {
    const resultId = params?.id;

    const content = `
      <div class="quiz-results-page" id="quiz-results-container">
        ${Utils.loadingHTML('Analyzing your quiz performance...')}
      </div>
    `;

    return Components.dashboardLayout(
      Components.userSidebar(),
      Components.topbar('Quiz Results', [
        { label: 'Dashboard', hash: '#/dashboard' },
        { label: 'Results', hash: `#/quiz/results/${resultId}` }
      ]),
      content
    );
  },

  afterRender: async function(params) {
    const resultId = params?.id;
    const container = document.getElementById('quiz-results-container');
    if (!container) return;

    if (!resultId) {
      container.innerHTML = `
        <div class="card text-center" style="max-width: 600px; margin: 3rem auto; padding: 2rem;">
          <h3>No Result Selected</h3>
          <p style="color: var(--color-text-muted, #64748b); margin: 1rem 0;">Please select a quiz result from your history.</p>
          <a href="#/history" class="btn btn-primary">Go to History</a>
        </div>
      `;
      return;
    }

    try {
      const res = await API.get(`/results/${resultId}`);
      const result = res.data || res;

      const score = result.score !== undefined ? result.score : 0;
      const total = result.totalQuestions || 10;
      const percentage = result.percentage !== undefined ? Math.round(result.percentage) : Math.round((score / total) * 100);
      const timeTakenSec = result.timeTaken || 0;
      const correct = score;
      const skipped = (result.answers || []).filter(a => a.selectedAnswer === null || a.selectedAnswer === undefined || a.selectedAnswer < 0).length || 0;
      const wrong = Math.max(0, total - correct - skipped);

      // Determine headline message
      let messageTitle = 'Keep Practicing!';
      if (percentage >= 80) {
        messageTitle = 'Excellent Performance!';
      } else if (percentage >= 60) {
        messageTitle = 'Good Effort!';
      }

      // answers[] is populated: each has .questionId (full question object), .selectedAnswer (index), .isCorrect
      const questions = (result.answers || []).map(a => {
        const q = a.questionId || {};
        const options = (q.options || []).map(opt => typeof opt === 'object' ? (opt.text || opt.option || '') : opt);
        return {
          questionText: q.questionText || 'Question unavailable',
          options: options,
          selectedAnswer: a.selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: a.isCorrect,
          explanation: q.explanation || ''
        };
      });

      container.innerHTML = `
        <!-- Hero Banner Card -->
        <div class="card" style="text-align:center;padding:48px;margin-bottom:24px;">
          <div style="font-size:64px;margin-bottom:16px;">🏆</div>
          <div style="font-size:3.5rem;font-weight:900;color:${percentage>=80?'#10b981':percentage>=60?'#f59e0b':'#ef4444'};line-height:1;margin-bottom:8px;">${percentage}%</div>
          <div style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:28px;">${messageTitle}</div>
          
          <!-- Stats Row -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;">
            <div style="background:#f0fdf4;border-radius:12px;padding:16px;"><div style="font-size:1.5rem;font-weight:800;color:#10b981;">${correct}</div><div style="font-size:12px;color:#064e3b;font-weight:600;">Correct</div></div>
            <div style="background:#fef2f2;border-radius:12px;padding:16px;"><div style="font-size:1.5rem;font-weight:800;color:#ef4444;">${wrong}</div><div style="font-size:12px;color:#7f1d1d;font-weight:600;">Incorrect</div></div>
            <div style="background:#fffbeb;border-radius:12px;padding:16px;"><div style="font-size:1.5rem;font-weight:800;color:#f59e0b;">${skipped}</div><div style="font-size:12px;color:#78350f;font-weight:600;">Skipped</div></div>
            <div style="background:#eff6ff;border-radius:12px;padding:16px;"><div style="font-size:1.1rem;font-weight:800;color:#3b82f6;">${Utils.formatTime(timeTakenSec)}</div><div style="font-size:12px;color:#1e3a8a;font-weight:600;">Time Taken</div></div>
          </div>
          
          <!-- Action Buttons -->
          <div style="display:flex;gap:12px;justify-content:center;">
            <button onclick="document.getElementById('review-section').scrollIntoView({behavior:'smooth'})" class="btn btn-primary">View Review</button>
            <a href="#/categories" class="btn btn-secondary">Back to Categories</a>
          </div>
        </div>

        <!-- Question Review Accordion -->
        <div id="review-section">
          <div class="card question-review-card">
            <div class="card-header flex-between" style="padding: 1.5rem 1.5rem 1rem 1.5rem;">
              <div>
                <h3 class="card-title" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 4px;">Detailed Solutions & Review</h3>
                <p class="card-subtitle" style="font-size: 0.9rem; color: #64748b; margin: 0;">Examine correct answers and comprehensive explanations for every question</p>
              </div>
              <div class="review-filter-pills" style="display: flex; gap: 8px;">
                <span class="badge badge-success">${correct} Correct</span>
                <span class="badge badge-danger">${wrong} Incorrect</span>
              </div>
            </div>

            <div class="card-body" style="padding: 1.5rem;">
              ${questions.length === 0 ? `
                <p style="color: var(--color-text-muted, #64748b); text-align: center; padding: 2rem;">
                  Question-by-question breakdown is not available for this record.
                </p>
              ` : `
                <div class="review-questions-list">
                  ${questions.map((q, idx) => {
                    const qNum = idx + 1;
                    const qText = q.questionText || `Question ${qNum}`;
                    const options = q.options || [];
                    const userAnsIdx = q.selectedAnswer;
                    const correctAnsIdx = q.correctAnswer;
                    const isCorrect = q.isCorrect;
                    const explanation = q.explanation || '';
                    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

                    return `
                      <div class="review-item card ${isCorrect ? 'review-item-correct' : 'review-item-incorrect'}" style="margin-bottom: 1.25rem; border-left: 5px solid ${isCorrect ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)'}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div class="review-item-header flex-between" style="padding: 1rem 1.25rem; background: var(--color-surface, #f8fafc); border-bottom: 1px solid var(--color-border, #e2e8f0);">
                          <div class="flex-align-center" style="gap: 0.75rem; display: flex; align-items: center;">
                            <span class="review-status-badge ${isCorrect ? 'badge-success' : 'badge-danger'}" style="padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: ${isCorrect ? '#dcfce7' : '#fee2e2'}; color: ${isCorrect ? '#15803d' : '#b91c1c'};">
                              ${isCorrect ? '✓ Correct' : '✕ Incorrect'}
                            </span>
                            <span class="font-bold" style="font-weight: 700; color: #0f172a;">Question ${qNum}</span>
                          </div>
                        </div>

                        <div class="review-item-body" style="padding: 1.25rem;">
                          <h4 class="review-q-text" style="font-size: 1.05rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b;">${Utils.escapeHtml(qText)}</h4>

                          <div style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 8px;">
                            ${options.map((opt, oi) => {
                              const letter = optionLetters[oi] || (oi + 1);
                              let optStyle = 'padding: 0.75rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.75rem; border: 1px solid #e2e8f0; font-size: 14px;';
                              if (oi === correctAnsIdx) {
                                optStyle += ' background: #f0fdf4; border-color: #86efac;';
                              } else if (oi === userAnsIdx && !isCorrect) {
                                optStyle += ' background: #fef2f2; border-color: #fca5a5;';
                              }
                              return '<div style="' + optStyle + '">' +
                                '<span style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; flex-shrink: 0;' +
                                (oi === correctAnsIdx ? ' background: #10b981; color: white;' : (oi === userAnsIdx && !isCorrect ? ' background: #ef4444; color: white;' : ' background: #f1f5f9; color: #64748b;')) +
                                '">' + letter + '</span>' +
                                '<span style="flex-grow: 1; color: #1e293b;">' + Utils.escapeHtml(opt) + '</span>' +
                                (oi === correctAnsIdx ? ' <span style="margin-left: auto; color: #10b981; font-weight: 600; font-size: 0.85rem;">✓ Correct</span>' : '') +
                                (oi === userAnsIdx && !isCorrect ? ' <span style="margin-left: auto; color: #ef4444; font-weight: 600; font-size: 0.85rem;">Your answer</span>' : '') +
                                '</div>';
                            }).join('')}
                          </div>

                          ${explanation ? `
                            <div class="review-explanation" style="background: #f8fafc; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.9rem; color: #334155; border: 1px dashed #cbd5e1; margin-top: 12px;">
                              <strong style="color: #1e293b;">Explanation:</strong> ${Utils.escapeHtml(explanation)}
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div class="card text-center" style="max-width: 600px; margin: 3rem auto; padding: 2rem;">
          <h3 style="color: var(--color-danger, #ef4444);">Failed to Load Results</h3>
          <p style="color: var(--color-text-muted, #64748b); margin: 1rem 0;">${Utils.escapeHtml(err.message)}</p>
          <a href="#/history" class="btn btn-primary">Return to History</a>
        </div>
      `;
    }
  }
};
