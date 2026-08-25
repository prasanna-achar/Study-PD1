/**
 * @description Core Application Logic for Salesforce PD1 Exam Prep Hub
 */

// Application State
let currentSection = 'dashboard';
let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // { questionId: selectedIndexOrArray }
let isAnswered = {}; // { questionId: boolean }
let bookmarkedIds = new Set(JSON.parse(localStorage.getItem('pd1_bookmarks') || '[]'));
let examTimer = null;
let timeRemaining = 0; // in seconds
let isMockExamMode = false;
let quizHistory = JSON.parse(localStorage.getItem('pd1_history') || '[]');

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateDashboardStats();
    initGovernorSandbox();
    initCheatSheetTabs();
});

// Navigation Handling
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetSection = btn.getAttribute('data-section');
            switchSection(targetSection);
        });
    });
}

function switchSection(sectionId) {
    currentSection = sectionId;

    // Update nav active class
    document.querySelectorAll('.nav-item button').forEach(btn => {
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update view section active class
    document.querySelectorAll('.view-section').forEach(sec => {
        if (sec.id === `section-${sectionId}`) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    if (sectionId === 'dashboard') {
        updateDashboardStats();
    } else if (sectionId === 'bookmarks') {
        renderBookmarksView();
    } else if (sectionId === 'all-questions') {
        renderAllQuestionsView();
    } else if (sectionId === 'sequential-blocks') {
        renderSequentialBlocksView();
    }
}

// Dashboard Stats Updater
function updateDashboardStats() {
    const totalAttemptedEl = document.getElementById('stat-attempted');
    const avgScoreEl = document.getElementById('stat-avg-score');
    const bookmarksCountEl = document.getElementById('stat-bookmarks');
    const historyListEl = document.getElementById('history-list');

    if (totalAttemptedEl) totalAttemptedEl.textContent = quizHistory.length;
    if (bookmarksCountEl) bookmarksCountEl.textContent = bookmarkedIds.size;

    if (quizHistory.length > 0) {
        const totalPct = quizHistory.reduce((acc, curr) => acc + curr.percentage, 0);
        const avg = Math.round(totalPct / quizHistory.length);
        if (avgScoreEl) avgScoreEl.textContent = `${avg}%`;
    } else {
        if (avgScoreEl) avgScoreEl.textContent = '0%';
    }

    // Render Recent History
    if (historyListEl) {
        if (quizHistory.length === 0) {
            historyListEl.innerHTML = `<p style="color: var(--text-dim); font-size: 14px;">No practice attempts yet. Start a quiz or mock exam below!</p>`;
        } else {
            historyListEl.innerHTML = quizHistory.slice(-5).reverse().map((attempt, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <strong style="font-size: 15px; color: var(--text-main);">${attempt.mode}</strong>
                        <div style="font-size: 12px; color: var(--text-muted);">${new Date(attempt.date).toLocaleDateString()} at ${new Date(attempt.date).toLocaleTimeString()}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: 700; font-size: 16px; color: ${attempt.percentage >= 68 ? 'var(--accent-green)' : 'var(--accent-red)'};">
                            ${attempt.percentage}%
                        </span>
                        <span style="font-size: 12px; padding: 3px 8px; border-radius: 4px; background: ${attempt.percentage >= 68 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${attempt.percentage >= 68 ? '#34d399' : '#f87171'};">
                            ${attempt.percentage >= 68 ? 'PASS' : 'REVIEW NEEDED'}
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Start Quiz or Mock Exam
function startPractice(filterDomain = null, isMock = false, blockIndex = null) {
    isMockExamMode = isMock;

    if (isMock) {
        // Full 60-Question Mock Exam mode (Simulating actual exam distribution)
        const domainLimits = {
            'Process Automation & Apex Logic': 23, // 38%
            'User Interface (LWC & Aura)': 15,     // 25%
            'Testing, Debugging & Deployment': 10, // 17%
            'Data Modeling & Management': 8,       // 13%
            'Salesforce Fundamentals': 4           // 7%
        };
        
        let mockQuestions = [];
        for (const [domain, limit] of Object.entries(domainLimits)) {
            const domainQuestions = QUESTION_BANK.filter(q => q.domain === domain)
                                                 .sort(() => 0.5 - Math.random())
                                                 .slice(0, limit);
            mockQuestions.push(...domainQuestions);
        }
        
        // Shuffle the final 60 questions so domains are mixed
        activeQuestions = mockQuestions.sort(() => 0.5 - Math.random());
        timeRemaining = 105 * 60; // 105 minutes in seconds
        startTimer();
    } else if (filterDomain) {
        // Domain specific practice
        activeQuestions = QUESTION_BANK.filter(q => q.domain === filterDomain);
        timeRemaining = activeQuestions.length * 90; // 1.5 mins per question
        startTimer();
    } else if (blockIndex !== null) {
        // Sequential block practice
        const blockSize = 30;
        const start = blockIndex * blockSize;
        const end = start + blockSize;
        activeQuestions = QUESTION_BANK.slice(start, end);
        timeRemaining = activeQuestions.length * 90; // 1.5 mins per question
        startTimer();
    } else {
        // Quick 10-Question Random Practice
        activeQuestions = [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
        timeRemaining = 15 * 60; // 15 mins
        startTimer();
    }

    currentQuestionIndex = 0;
    userAnswers = {};
    isAnswered = {};

    switchSection('quiz');
    renderCurrentQuestion();
}

// Timer Engine
function startTimer() {
    if (examTimer) clearInterval(examTimer);
    updateTimerDisplay();

    examTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(examTimer);
            alert('⏰ Time is up! Submitting your exam now.');
            submitQuizResults();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer-display');
    if (!timerEl) return;

    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Render Current Question
function renderCurrentQuestion() {
    const container = document.getElementById('quiz-container');
    const questionCounterEl = document.getElementById('question-counter');
    if (!container) return;

    const q = activeQuestions[currentQuestionIndex];
    if (!q) return;

    if (questionCounterEl) {
        questionCounterEl.textContent = `Question ${currentQuestionIndex + 1} of ${activeQuestions.length}`;
    }

    const isBookmarked = bookmarkedIds.has(q.id);
    const answered = isAnswered[q.id] || false;
    const currentAnswer = userAnswers[q.id];

    // Format options with correct/wrong classes if answered
    const optionsHtml = q.options.map((opt, idx) => {
        let btnClass = 'option-btn';
        if (answered) {
            btnClass += ' disabled';
            if (q.type === 'single') {
                if (idx === q.correctAnswer) btnClass += ' correct';
                else if (currentAnswer === idx) btnClass += ' wrong';
            } else if (q.type === 'multi') {
                if (q.correctAnswers.includes(idx)) btnClass += ' correct';
                else if (currentAnswer && currentAnswer.includes(idx)) btnClass += ' wrong';
            }
        } else if (currentAnswer !== undefined) {
            if (q.type === 'single' && currentAnswer === idx) btnClass += ' selected';
            else if (q.type === 'multi' && currentAnswer.includes(idx)) btnClass += ' selected';
        }

        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        return `
            <button class="${btnClass}" onclick="selectOption(${q.id}, ${idx})" ${answered ? 'disabled' : ''}>
                <span class="option-letter">${letter}</span>
                <span>${escapeHtml(opt)}</span>
            </button>
        `;
    }).join('');

    // Format Explanation HTML if answered
    let explanationHtml = '';
    if (answered) {
        const isCorrect = checkIsCorrect(q);
        explanationHtml = `
            <div class="explanation-box ${isCorrect ? '' : 'wrong-expl'}">
                <div class="explanation-header" style="color: ${isCorrect ? '#34d399' : '#f87171'};">
                    <span>${isCorrect ? '✔ Correct Answer!' : '✖ Incorrect Answer'}</span>
                </div>
                <p style="font-size: 14px; color: var(--text-main); margin-top: 6px;">${escapeHtml(q.explanation)}</p>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="question-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div class="question-meta">
                    <span class="badge badge-domain">${q.domain} (${q.weight})</span>
                    <span class="badge badge-diff">${q.difficulty}</span>
                    <span class="badge" style="background: rgba(255,255,255,0.08); color: var(--text-main);">${q.type === 'multi' ? 'Multi-Select (Choose 2)' : 'Single Choice'}</span>
                </div>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="toggleBookmark(${q.id})">
                    ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
            </div>

            <div class="question-text">${formatQuestionText(q.question)}</div>

            <div class="options-list">
                ${optionsHtml}
            </div>

            ${explanationHtml}
        </div>

        <div class="quiz-controls">
            <button class="btn btn-secondary" onclick="prevQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                &larr; Previous Question
            </button>
            <div style="display: flex; gap: 12px;">
                ${!answered ? `<button class="btn btn-primary" onclick="submitAnswer(${q.id})">Check Answer</button>` : ''}
                ${currentQuestionIndex < activeQuestions.length - 1 ?
            `<button class="btn btn-secondary" onclick="nextQuestion()">Next Question &rarr;</button>` :
            `<button class="btn btn-primary" style="background: var(--gradient-green);" onclick="submitQuizResults()">Finish & Submit Exam ✔</button>`
        }
            </div>
        </div>
    `;

    // Render the question navigator panel
    renderQuestionNavigator();
}

function renderQuestionNavigator() {
    const navContainer = document.getElementById('question-navigator');
    if (!navContainer) return;

    navContainer.innerHTML = activeQuestions.map((q, idx) => {
        let btnClass = 'nav-btn';
        
        // Determine if answered (has a selection)
        let hasSelection = userAnswers[q.id] !== undefined;
        if (q.type === 'multi') {
            hasSelection = Array.isArray(userAnswers[q.id]) && userAnswers[q.id].length > 0;
        }

        if (isAnswered[q.id] || hasSelection) {
            btnClass += ' answered';
        }
        
        if (idx === currentQuestionIndex) {
            btnClass += ' active';
        }
        
        return `<button class="${btnClass}" onclick="jumpToQuestion(${idx})">${idx + 1}</button>`;
    }).join('');
}

function jumpToQuestion(index) {
    if (index >= 0 && index < activeQuestions.length) {
        currentQuestionIndex = index;
        renderCurrentQuestion();
    }
}

function formatQuestionText(text) {
    // If text contains code snippet inside ``` or code lines, wrap them
    return escapeHtml(text);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Option Selection Logic
function selectOption(questionId, optionIndex) {
    const q = activeQuestions[currentQuestionIndex];
    if (isAnswered[questionId]) return;

    if (q.type === 'single') {
        userAnswers[questionId] = optionIndex;
    } else if (q.type === 'multi') {
        if (!userAnswers[questionId]) userAnswers[questionId] = [];
        const currentList = userAnswers[questionId];
        const existingIdx = currentList.indexOf(optionIndex);
        if (existingIdx === -1) {
            if (currentList.length < 2) currentList.push(optionIndex);
        } else {
            currentList.splice(existingIdx, 1);
        }
    }
    renderCurrentQuestion();
}

function submitAnswer(questionId) {
    const q = activeQuestions[currentQuestionIndex];
    if (userAnswers[questionId] === undefined || (Array.isArray(userAnswers[questionId]) && userAnswers[questionId].length === 0)) {
        alert('Please select an option first before checking your answer!');
        return;
    }
    isAnswered[questionId] = true;
    renderCurrentQuestion();
}

function checkIsCorrect(q) {
    const ans = userAnswers[q.id];
    if (ans === undefined) return false;
    if (q.type === 'single') {
        return ans === q.correctAnswer;
    } else if (q.type === 'multi') {
        if (!Array.isArray(ans) || ans.length !== q.correctAnswers.length) return false;
        return q.correctAnswers.every(val => ans.includes(val));
    }
    return false;
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < activeQuestions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
    }
}

function toggleBookmark(questionId) {
    if (bookmarkedIds.has(questionId)) {
        bookmarkedIds.delete(questionId);
    } else {
        bookmarkedIds.add(questionId);
    }
    localStorage.setItem('pd1_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    renderCurrentQuestion();
    updateDashboardStats();
}

// Submit Quiz & Show Results
function submitQuizResults() {
    if (examTimer) clearInterval(examTimer);

    let correctCount = 0;
    activeQuestions.forEach(q => {
        if (checkIsCorrect(q)) correctCount++;
    });

    const percentage = Math.round((correctCount / activeQuestions.length) * 100);
    const passed = percentage >= 68; // 68% passing score for PD1

    // Determine mode name for history
    let attemptMode = 'Practice Quiz';
    if (isMockExamMode) {
        attemptMode = 'Full 60-Question Mock Exam';
    } else if (activeQuestions.length === 30 && QUESTION_BANK.includes(activeQuestions[0])) {
        // Heuristic to detect block practice
        attemptMode = 'Sequential Block Practice';
    } else if (activeQuestions.length === 10) {
        attemptMode = 'Quick 10-Question Quiz';
    } else {
        attemptMode = 'Domain Practice Quiz';
    }

    // Save attempt to history
    quizHistory.push({
        date: new Date().toISOString(),
        mode: attemptMode,
        correct: correctCount,
        total: activeQuestions.length,
        percentage: percentage
    });
    localStorage.setItem('pd1_history', JSON.stringify(quizHistory));

    const container = document.getElementById('quiz-container');
    if (container) {
        container.innerHTML = `
            <div class="glass-card" style="text-align: center; padding: 48px;">
                <div class="score-circle" style="border-color: ${passed ? 'var(--accent-green)' : 'var(--accent-red)'};">
                    <h2 style="color: ${passed ? '#34d399' : '#f87171'};">${percentage}%</h2>
                    <span>Score</span>
                </div>
                
                <h3 style="font-size: 28px; font-family: 'Outfit', sans-serif; margin-bottom: 8px;">
                    ${passed ? '🎉 Congratulations! You Passed!' : '📚 Keep Practicing! Almost There!'}
                </h3>
                <p style="color: var(--text-muted); font-size: 16px; max-width: 500px; margin: 0 auto 24px;">
                    You answered <strong>${correctCount} out of ${activeQuestions.length}</strong> questions correctly. The official Salesforce Platform Developer I passing threshold is <strong>68%</strong>.
                </p>

                <div style="display: flex; gap: 16px; justify-content: center;">
                    <button class="btn btn-primary" onclick="switchSection('dashboard')">&larr; Return to Dashboard</button>
                    <button class="btn btn-secondary" onclick="startPractice(null, ${isMockExamMode})">Try Another Attempt &rarr;</button>
                </div>
            </div>
        `;
    }
    updateDashboardStats();
}

// Render Bookmarks View
function renderBookmarksView() {
    const container = document.getElementById('bookmarks-list');
    if (!container) return;

    if (bookmarkedIds.size === 0) {
        container.innerHTML = `
            <div class="glass-card" style="text-align: center; padding: 40px;">
                <p style="color: var(--text-muted); font-size: 16px;">You haven't bookmarked any questions yet. Click the ⭐ Bookmark button during a quiz to save tricky questions here for quick review!</p>
            </div>
        `;
        return;
    }

    const bookmarkedQuestions = QUESTION_BANK.filter(q => bookmarkedIds.has(q.id));
    container.innerHTML = bookmarkedQuestions.map(q => `
        <div class="glass-card" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="badge badge-domain">${q.domain}</span>
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="toggleBookmark(${q.id}); renderBookmarksView();">
                    Remove Bookmark ✖
                </button>
            </div>
            <strong style="font-size: 16px; display: block; margin-bottom: 12px; color: var(--text-main);">${escapeHtml(q.question)}</strong>
            <div class="explanation-box" style="margin-top: 12px;">
                <span style="font-weight: 700; color: var(--accent-green); display: block; margin-bottom: 4px;">Correct Answer & Explanation:</span>
                <p style="font-size: 14px;">${escapeHtml(q.explanation)}</p>
            </div>
        </div>
    `).join('');
}

// Render Sequential Blocks View
function renderSequentialBlocksView() {
    const container = document.getElementById('sequential-blocks-list');
    if (!container) return;
    
    const blockSize = 30;
    const totalBlocks = Math.ceil(QUESTION_BANK.length / blockSize);
    
    let html = '';
    for (let i = 0; i < totalBlocks; i++) {
        const start = i * blockSize + 1;
        const end = Math.min((i + 1) * blockSize, QUESTION_BANK.length);
        const count = end - start + 1;
        
        html += `
            <div class="glass-card">
                <span class="badge badge-domain" style="margin-bottom: 12px; display: inline-block;">Block ${i + 1}</span>
                <h3 style="font-size: 22px; font-family: 'Outfit', sans-serif; margin-bottom: 8px;">Questions ${start} - ${end}</h3>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">Practice this sequential block of ${count} questions to guarantee complete coverage without randomization.</p>
                <button class="btn btn-primary" style="background: var(--gradient-brand);" onclick="startPractice(null, false, ${i})">Start Block ${i + 1} &rarr;</button>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Render Master Question Bank View
function renderAllQuestionsView() {
    const container = document.getElementById('all-questions-list');
    if (!container) return;

    const searchTerm = document.getElementById('search-questions')?.value.toLowerCase() || '';
    const domainFilter = document.getElementById('filter-domain')?.value || 'all';

    let filteredQuestions = QUESTION_BANK;

    if (domainFilter !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.domain === domainFilter);
    }

    if (searchTerm) {
        filteredQuestions = filteredQuestions.filter(q =>
            q.question.toLowerCase().includes(searchTerm) ||
            q.explanation.toLowerCase().includes(searchTerm) ||
            q.options.some(opt => opt.toLowerCase().includes(searchTerm))
        );
    }

    if (filteredQuestions.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="text-align: center; padding: 40px;">
                <p style="color: var(--text-muted); font-size: 16px;">No questions match your search filters.</p>
            </div>
        `;
        return;
    }

    // Add state tracker if it doesn't exist
    if (typeof window.bankAnswersRevealed === 'undefined') {
        window.bankAnswersRevealed = {};
    }

    container.innerHTML = filteredQuestions.map((q, idx) => {
        const isRevealed = window.bankAnswersRevealed[q.id] || false;

        // Format options
        const optionsHtml = q.options.map((opt, optIdx) => {
            const isCorrect = q.type === 'single' ? optIdx === q.correctAnswer : q.correctAnswers.includes(optIdx);
            const letter = String.fromCharCode(65 + optIdx);

            if (isRevealed) {
                // Highlighted correct answers
                return `
                    <div style="padding: 8px; margin-bottom: 6px; border-radius: 6px; background: ${isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isCorrect ? 'var(--accent-green)' : 'var(--border-color)'}; display: flex; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: bold; color: ${isCorrect ? 'var(--accent-green)' : 'var(--text-muted)'}; min-width: 20px;">${letter}.</span>
                        <span style="color: ${isCorrect ? '#fff' : 'var(--text-muted)'};">${escapeHtml(opt)}</span>
                        ${isCorrect ? '<span style="margin-left: auto; color: var(--accent-green);">✔ Correct</span>' : ''}
                    </div>
                `;
            } else {
                // Hidden default state
                return `
                    <div style="padding: 8px; margin-bottom: 6px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); display: flex; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: bold; color: var(--text-muted); min-width: 20px;">${letter}.</span>
                        <span style="color: var(--text-main);">${escapeHtml(opt)}</span>
                    </div>
                `;
            }
        }).join('');

        return `
            <div class="glass-card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="badge badge-domain">${q.domain}</span>
                        <span style="color: var(--text-dim); font-size: 13px;">ID: ${q.id}</span>
                    </div>
                </div>
                
                <strong style="font-size: 16px; display: block; margin-bottom: 16px; color: var(--text-main); line-height: 1.5;">${formatQuestionText(q.question)}</strong>
                
                <div style="margin-bottom: 16px;">
                    ${optionsHtml}
                </div>
                
                ${!isRevealed ? `
                    <button class="btn btn-primary" onclick="window.bankAnswersRevealed[${q.id}] = true; renderAllQuestionsView();" style="padding: 8px 16px; font-size: 14px;">
                        Check Answer
                    </button>
                ` : `
                    <div class="explanation-box" style="margin-top: 16px; background: rgba(0,0,0,0.2);">
                        <span style="font-weight: 700; color: var(--accent-cyan); display: block; margin-bottom: 6px;">Explanation:</span>
                        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">${escapeHtml(q.explanation)}</p>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly to ensure elements exist
    setTimeout(() => {
        const searchInput = document.getElementById('search-questions');
        const filterSelect = document.getElementById('filter-domain');

        if (searchInput) searchInput.addEventListener('input', renderAllQuestionsView);
        if (filterSelect) filterSelect.addEventListener('change', renderAllQuestionsView);
    }, 500);
});

// Governor Limit Sandbox Simulator
function initGovernorSandbox() {
    const soqlSlider = document.getElementById('slider-soql');
    const dmlSlider = document.getElementById('slider-dml');
    const loopSlider = document.getElementById('slider-loop');

    if (!soqlSlider || !dmlSlider || !loopSlider) return;

    const updateSandbox = () => {
        const soqlCount = parseInt(soqlSlider.value);
        const dmlCount = parseInt(dmlSlider.value);
        const loopCount = parseInt(loopSlider.value);

        document.getElementById('val-soql').textContent = soqlCount;
        document.getElementById('val-dml').textContent = dmlCount;
        document.getElementById('val-loop').textContent = `${loopCount} iterations`;

        // Calculate simulated consumption if SOQL is inside the loop!
        const isSoqlInLoop = document.getElementById('check-soql-in-loop')?.checked || false;
        const totalSoqlExecuted = isSoqlInLoop ? (soqlCount * loopCount) : soqlCount;

        const soqlPct = Math.min(100, Math.round((totalSoqlExecuted / 100) * 100));
        const dmlPct = Math.min(100, Math.round((dmlCount / 150) * 100));

        const soqlBar = document.getElementById('bar-soql');
        const dmlBar = document.getElementById('bar-dml');
        const statusAlert = document.getElementById('sandbox-alert');

        if (soqlBar) {
            soqlBar.style.width = `${soqlPct}%`;
            soqlBar.style.background = totalSoqlExecuted > 100 ? 'var(--accent-red)' : 'var(--accent-cyan)';
        }
        if (dmlBar) {
            dmlBar.style.width = `${dmlPct}%`;
            dmlBar.style.background = dmlCount > 150 ? 'var(--accent-red)' : 'var(--accent-green)';
        }

        if (statusAlert) {
            if (totalSoqlExecuted > 100) {
                statusAlert.innerHTML = `
                    <div style="padding: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--accent-red); color: #f87171;">
                        <strong>⚠️ FATAL GOVERNOR LIMIT EXCEEDED: System.LimitException: Too many SOQL queries: 101</strong><br>
                        ${isSoqlInLoop ? `You executed <strong>${soqlCount} query inside a loop of ${loopCount} iterations (${totalSoqlExecuted} total queries)</strong>! Never place SOQL inside a for loop. Move the query outside the loop and use Collections (Map/Set).` : `You executed ${totalSoqlExecuted} queries in a single synchronous transaction (Max 100).`}
                    </div>
                `;
            } else if (dmlCount > 150) {
                statusAlert.innerHTML = `
                    <div style="padding: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--accent-red); color: #f87171;">
                        <strong>⚠️ FATAL GOVERNOR LIMIT EXCEEDED: System.LimitException: Too many DML statements: 151</strong><br>
                        You attempted ${dmlCount} separate DML statements (Max 150). Bulkify your DML by adding records to a List&lt;sObject&gt; and calling insert/update once outside the loop!
                    </div>
                `;
            } else {
                statusAlert.innerHTML = `
                    <div style="padding: 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent-green); color: #34d399;">
                        <strong>✔ Safe Transaction! Governor Limits OK.</strong><br>
                        Total SOQL Queries: ${totalSoqlExecuted} / 100 (${soqlPct}%) | Total DML Statements: ${dmlCount} / 150 (${dmlPct}%)
                    </div>
                `;
            }
        }
    };

    soqlSlider.addEventListener('input', updateSandbox);
    dmlSlider.addEventListener('input', updateSandbox);
    loopSlider.addEventListener('input', updateSandbox);
    document.getElementById('check-soql-in-loop')?.addEventListener('change', updateSandbox);
    updateSandbox();
}

// Cheat Sheet Tabs
function initCheatSheetTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => {
                if (c.id === `tab-${targetTab}`) c.style.display = 'block';
                else c.style.display = 'none';
            });
        });
    });
}
