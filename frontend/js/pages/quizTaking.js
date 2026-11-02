window.QuizoraPages = window.QuizoraPages || {};

window.QuizoraPages.quizTaking = {
  quizId: null,
  categoryId: null,
  categoryName: 'Quiz',
  questions: [],
  currentIndex: 0,
  answers: {}, // map of index -> selectedAnswer (text)
  selectedIndexes: {}, // map of index -> optionIndex (0, 1, 2, 3)
  markedForReview: {}, // map of index -> boolean
  totalTime: 600, // 10 minutes
  timeLeft: 600,
  timerInterval: null,
  isSubmitting: false,

  render: async function(params) {
    return `
      <div class="quiz-taking-layout" id="quiz-taking-root">
        <!-- Quiz Header Bar -->
        <header class="quiz-header">
          <div class="quiz-header-container">
            <div class="quiz-brand-category">
              <span class="quiz-brand-mini">Quizora</span>
              <span class="quiz-header-sep">/</span>
              <span class="quiz-header-cat" id="quiz-header-category">Loading...</span>
            </div>

            <!-- Central Progress indicator -->
            <div class="quiz-header-progress">
              <span id="quiz-progress-text" class="quiz-progress-text">Question 1 of 10</span>
              <div class="quiz-progress-bar-track">
                <div id="quiz-progress-fill" class="quiz-progress-bar-fill" style="width: 10%;"></div>
              </div>
            </div>

            <!-- Circular Timer Display -->
            <div class="quiz-timer-widget" id="quiz-timer-widget">
              <div class="timer-svg-wrapper">
                <svg viewBox="0 0 100 100" class="timer-svg">
                  <circle class="timer-track" cx="50" cy="50" r="45"></circle>
                  <circle class="timer-progress" id="timer-progress-ring" cx="50" cy="50" r="45" stroke-dasharray="283" stroke-dashoffset="0"></circle>
                </svg>
                <div class="timer-text" id="timer-display">10:00</div>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Quiz Workspace -->
        <main class="quiz-workspace">
          <div class="quiz-workspace-container">
            
            <!-- Question Card Area (Left/Main) -->
            <div class="quiz-main-area">
              <div class="card quiz-question-card" id="quiz-question-card">
                ${Utils.loadingHTML('Initializing your quiz session...')}
              </div>
            </div>

            <!-- Question Navigator Sidebar (Right) -->
            <aside class="quiz-sidebar-navigator card">
              <div class="navigator-header flex-between">
                <h4 class="navigator-title">Question Navigator</h4>
                <button type="button" id="review-toggle-btn" class="btn btn-sm btn-outline-warning">
                  ${Components.icon('bookmark', 14)}
                  <span id="review-toggle-label">Flag for Review</span>
                </button>
              </div>

              <!-- Navigator Legend -->
              <div class="navigator-legend">
                <div class="legend-item"><span class="legend-dot dot-answered"></span> Answered</div>
                <div class="legend-item"><span class="legend-dot dot-current"></span> Current</div>
                <div class="legend-item"><span class="legend-dot dot-unanswered"></span> Unanswered</div>
                <div class="legend-item"><span class="legend-dot dot-marked"></span> Marked</div>
              </div>

              <!-- Question Numbers Grid -->
              <div class="navigator-grid" id="question-navigator-grid">
                <!-- Dynamically generated buttons 1..N -->
              </div>

              <!-- Submit Quiz Action -->
              <div class="navigator-footer">
                <button type="button" id="submit-quiz-modal-btn" class="btn btn-primary btn-block">
                  ${Components.icon('check', 16)}
                  <span>Finish & Submit</span>
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    `;
  },

  cleanup: function() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    window.onbeforeunload = null;
  },

  afterRender: async function(params) {
    this.cleanup();
    this.categoryId = params?.id;
    this.currentIndex = 0;
    this.answers = {};
    this.selectedIndexes = {};
    this.markedForReview = {};
    this.totalTime = 600;
    this.timeLeft = 600;
    this.isSubmitting = false;

    // Prevent accidental page leave
    window.onbeforeunload = (e) => {
      if (!this.isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have an active quiz session. Leaving will lose your progress.';
        return e.returnValue;
      }
    };

    const card = document.getElementById('quiz-question-card');
    const headerCategory = document.getElementById('quiz-header-category');

    try {
      // Start quiz through API
      let startData = null;
      try {
        const startRes = await API.post('/quiz/start', { categoryId: this.categoryId });
        startData = startRes.data || startRes;
      } catch (startErr) {
        // Fallback: fetch questions directly for this category
        const qRes = await API.get(`/questions?category=${this.categoryId}`);
        const qList = qRes.data?.questions || (Array.isArray(qRes.data) ? qRes.data : []);
        const catRes = await API.get(`/categories/${this.categoryId}`);
        startData = {
          quizId: 'session_' + Date.now(),
          category: catRes.data || { name: 'Quiz' },
          questions: qList.length > 0 ? qList : []
        };
      }

      this.quizId = startData.quizId || startData._id || 'quiz_' + Date.now();
      this.categoryName = startData.category?.name || 'Quiz Assessment';
      this.questions = startData.questions || [];

      if (headerCategory) {
        headerCategory.textContent = this.categoryName;
      }

      if (!this.questions || this.questions.length === 0) {
        if (card) {
          card.innerHTML = `
            <div class="text-center" style="padding: 3rem 1rem;">
              <h3>No Questions Available</h3>
              <p style="color: var(--color-text-muted, #64748b); margin: 1rem 0;">This category does not have any active questions yet.</p>
              <a href="#/categories" class="btn btn-primary">Choose Another Category</a>
            </div>
          `;
        }
        return;
      }

      // Start Countdown Timer
      this.startTimer();

      // Render Question Navigator Grid
      this.renderNavigator();

      // Render First Question
      this.renderCurrentQuestion();

      // Setup Listeners
      this.attachListeners();

    } catch (err) {
      if (card) {
        card.innerHTML = `
          <div class="text-center" style="padding: 3rem 1rem;">
            <h3 style="color: var(--color-danger, #ef4444);">Failed to Load Quiz</h3>
            <p style="color: var(--color-text-muted, #64748b); margin: 1rem 0;">${Utils.escapeHtml(err.message)}</p>
            <a href="#/categories" class="btn btn-primary">Return to Categories</a>
          </div>
        `;
      }
    }
  },

  startTimer: function() {
    const timerDisplay = document.getElementById('timer-display');
    const timerRing = document.getElementById('timer-progress-ring');
    const timerWidget = document.getElementById('quiz-timer-widget');
    const circumference = 283; // 2 * pi * 45

    const updateDisplay = () => {
      if (timerDisplay) {
        timerDisplay.textContent = Utils.formatTime(this.timeLeft);
      }
      if (timerRing) {
        const offset = circumference - (this.timeLeft / this.totalTime) * circumference;
        timerRing.style.strokeDashoffset = offset;
      }

      // Warning color if under 2 minutes
      if (this.timeLeft <= 120 && timerWidget) {
        timerWidget.classList.add('timer-warning');
      }
      // Critical pulse if under 1 minute
      if (this.timeLeft <= 60 && timerWidget) {
        timerWidget.classList.add('timer-danger');
      }
    };

    updateDisplay();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      updateDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        Utils.showToast('Time expired! Submitting your answers...', 'warning', 4000);
        this.submitQuiz(true);
      }
    }, 1000);
  },

  renderNavigator: function() {
    const grid = document.getElementById('question-navigator-grid');
    if (!grid) return;

    grid.innerHTML = this.questions.map((_, index) => {
      const isCurrent = index === this.currentIndex;
      const isAnswered = this.answers[index] !== undefined;
      const isMarked = !!this.markedForReview[index];

      let statusClass = 'nav-unanswered';
      if (isCurrent) {
        statusClass = 'nav-current';
      } else if (isMarked) {
        statusClass = 'nav-marked';
      } else if (isAnswered) {
        statusClass = 'nav-answered';
      }

      return `
        <button 
          type="button" 
          class="navigator-num-btn ${statusClass}" 
          data-index="${index}"
          title="Go to Question ${index + 1}"
        >
          ${index + 1}
          ${isMarked ? '<span class="marked-flag">★</span>' : ''}
        </button>
      `;
    }).join('');

    // Attach click events to jump
    grid.querySelectorAll('.navigator-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
        this.goToQuestion(targetIndex);
      });
    });
  },

  renderCurrentQuestion: function() {
    const card = document.getElementById('quiz-question-card');
    const progressText = document.getElementById('quiz-progress-text');
    const progressFill = document.getElementById('quiz-progress-fill');
    const reviewBtn = document.getElementById('review-toggle-btn');
    const reviewLabel = document.getElementById('review-toggle-label');

    if (!card || !this.questions[this.currentIndex]) return;

    const q = this.questions[this.currentIndex];
    const totalQ = this.questions.length;
    const qNum = this.currentIndex + 1;

    // Update Progress
    if (progressText) {
      progressText.textContent = `Question ${qNum} of ${totalQ}`;
    }
    if (progressFill) {
      const pct = (qNum / totalQ) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Update Review button state
    const isMarked = !!this.markedForReview[this.currentIndex];
    if (reviewBtn) {
      if (isMarked) {
        reviewBtn.classList.remove('btn-outline-warning');
        reviewBtn.classList.add('btn-warning');
        if (reviewLabel) reviewLabel.textContent = 'Flagged';
      } else {
        reviewBtn.classList.remove('btn-warning');
        reviewBtn.classList.add('btn-outline-warning');
        if (reviewLabel) reviewLabel.textContent = 'Flag for Review';
      }
    }

    // Normalize options (could be array of strings or array of objects)
    const options = (q.options || []).map(opt => typeof opt === 'object' ? (opt.text || opt.option || '') : opt);
    const selectedAnswer = this.answers[this.currentIndex];
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    const questionText = q.question || q.questionText || q.title || 'Question text unavailable';

    card.innerHTML = `
      <div class="question-header flex-between">
        <span class="question-badge badge badge-primary">Question ${qNum}</span>
        <span class="question-category-tag">${Utils.escapeHtml(this.categoryName)}</span>
      </div>

      <div class="question-body">
        <h2 class="question-text">${Utils.escapeHtml(questionText)}</h2>
      </div>

      <div class="quiz-options-list" id="quiz-options-list">
        ${options.map((opt, optIdx) => {
          const letter = optionLetters[optIdx] || (optIdx + 1);
          const isSelected = selectedAnswer === opt;
          return `
            <div 
              class="quiz-option-card ${isSelected ? 'option-selected' : ''}" 
              data-opt-index="${optIdx}"
              data-opt-value="${Utils.escapeHtml(opt)}"
            >
              <div class="option-letter">${letter}</div>
              <div class="option-content">${Utils.escapeHtml(opt)}</div>
              <div class="option-radio-dot"></div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="quiz-footer-nav flex-between">
        <button 
          type="button" 
          id="prev-question-btn" 
          class="btn btn-secondary ${this.currentIndex === 0 ? 'disabled' : ''}" 
          ${this.currentIndex === 0 ? 'disabled' : ''}
        >
          ${Components.icon('chevron-left', 16)}
          <span>Previous</span>
        </button>

        ${this.currentIndex === totalQ - 1 ? `
          <button type="button" id="submit-quiz-inline-btn" class="btn btn-success btn-lg">
            <span>Submit Quiz</span>
            ${Components.icon('check', 18)}
          </button>
        ` : `
          <button type="button" id="next-question-btn" class="btn btn-primary">
            <span>Next Question</span>
            ${Components.icon('chevron-right', 16)}
          </button>
        `}
      </div>
    `;

    // Wire up option selection
    const optionsContainer = document.getElementById('quiz-options-list');
    if (optionsContainer) {
      optionsContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('.quiz-option-card');
        if (!optionCard) return;

        const optVal = optionCard.getAttribute('data-opt-value');
        const optIdx = parseInt(optionCard.getAttribute('data-opt-index'), 10);

        this.answers[this.currentIndex] = optVal;
        this.selectedIndexes[this.currentIndex] = optIdx;

        optionsContainer.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('option-selected'));
        optionCard.classList.add('option-selected');

        this.renderNavigator();
      });
    }

    // Wire Previous / Next / Inline Submit
    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.goToQuestion(this.currentIndex - 1);
        }
      });
    }

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < this.questions.length - 1) {
          this.goToQuestion(this.currentIndex + 1);
        }
      });
    }

    const inlineSubmitBtn = document.getElementById('submit-quiz-inline-btn');
    if (inlineSubmitBtn) {
      inlineSubmitBtn.addEventListener('click', () => this.confirmSubmit());
    }
  },

  goToQuestion: function(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.renderCurrentQuestion();
      this.renderNavigator();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  attachListeners: function() {
    // Flag for review button
    const reviewBtn = document.getElementById('review-toggle-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => {
        this.markedForReview[this.currentIndex] = !this.markedForReview[this.currentIndex];
        this.renderCurrentQuestion();
        this.renderNavigator();
      });
    }

    // Finish & Submit from sidebar
    const submitModalBtn = document.getElementById('submit-quiz-modal-btn');
    if (submitModalBtn) {
      submitModalBtn.addEventListener('click', () => this.confirmSubmit());
    }
  },

  confirmSubmit: function() {
    const totalQ = this.questions.length;
    const answeredCount = Object.keys(this.answers).length;
    const unansweredCount = totalQ - answeredCount;
    const markedCount = Object.values(this.markedForReview).filter(Boolean).length;

    let warningHtml = '';
    if (unansweredCount > 0) {
      warningHtml = `
        <div class="alert alert-warning" style="margin: 1rem 0; display: flex; gap: 0.5rem; align-items: center;">
          <span>${Components.icon('alert-triangle', 20)}</span>
          <span>You have <strong>${unansweredCount} unanswered</strong> ${unansweredCount === 1 ? 'question' : 'questions'}.</span>
        </div>
      `;
    }

    const modalContent = `
      <div class="modal-header">
        <h3 class="modal-title">Confirm Quiz Submission</h3>
        <button class="modal-close" onclick="Utils.closeModal()">×</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to finalize and submit your answers?</p>
        <div class="submission-summary-stats" style="margin: 1rem 0; background: var(--color-surface, #f8fafc); padding: 1rem; border-radius: 6px;">
          <div class="flex-between" style="margin-bottom: 0.5rem;">
            <span>Total Questions:</span>
            <strong>${totalQ}</strong>
          </div>
          <div class="flex-between" style="margin-bottom: 0.5rem; color: var(--color-success, #10b981);">
            <span>Answered:</span>
            <strong>${answeredCount}</strong>
          </div>
          <div class="flex-between" style="margin-bottom: 0.5rem; color: var(--color-danger, #ef4444);">
            <span>Unanswered:</span>
            <strong>${unansweredCount}</strong>
          </div>
          <div class="flex-between" style="color: var(--color-warning, #f59e0b);">
            <span>Marked for Review:</span>
            <strong>${markedCount}</strong>
          </div>
        </div>
        ${warningHtml}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="Utils.closeModal()">Keep Reviewing</button>
        <button class="btn btn-primary" id="final-submit-btn">Yes, Submit Assessment</button>
      </div>
    `;

    Utils.showModal(modalContent);

    const finalBtn = document.getElementById('final-submit-btn');
    if (finalBtn) {
      finalBtn.addEventListener('click', () => {
        Utils.closeModal();
        this.submitQuiz(false);
      });
    }
  },

  submitQuiz: async function(isAutoSubmit = false) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanup();

    // Prepare payload
    const timeSpent = this.totalTime - Math.max(0, this.timeLeft);

    // Format formatted answers array
    const formattedAnswers = this.questions.map((q, idx) => {
      const qId = q._id || q.id || idx;
      // Backend expects selectedAnswer as integer index (0-3), matching correctAnswer
      const optionIndex = this.selectedIndexes[idx] !== undefined ? this.selectedIndexes[idx] : -1;
      return {
        questionId: qId,
        selectedAnswer: optionIndex
      };
    });

    const payload = {
      categoryId: this.categoryId,
      timeTaken: timeSpent,
      answers: formattedAnswers
    };

    const card = document.getElementById('quiz-question-card');
    if (card) {
      card.innerHTML = Utils.loadingHTML('Calculating results and generating performance analysis...');
    }

    try {
      const res = await API.post('/quiz/submit', payload);
      const resultData = res.data || res;
      const resultId = resultData._id || resultData.id || resultData.resultId;

      Utils.showToast('Quiz submitted successfully!', 'success');

      if (resultId) {
        window.location.hash = `#/quiz/results/${resultId}`;
      } else {
        // Fallback to history or dashboard if resultId not returned
        window.location.hash = '#/history';
      }
    } catch (err) {
      this.isSubmitting = false;
      Utils.showToast(err.message || 'Submission failed. Please try submitting again.', 'error');
      if (card) {
        card.innerHTML = `
          <div class="text-center" style="padding: 2.5rem 1rem;">
            <h3 style="color: var(--color-danger, #ef4444);">Submission Error</h3>
            <p style="color: var(--color-text-muted, #64748b); margin: 1rem 0;">${Utils.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.QuizoraPages.quizTaking.submitQuiz(false)">Retry Submission</button>
          </div>
        `;
      }
    }
  }
};
