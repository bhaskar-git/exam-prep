// AI Exam Prep - Main Application Script
// This is a mock implementation that simulates AI-powered exam preparation

// ============================================
// APP STATE
// ============================================
const AppState = {
    currentTab: 'dashboard',
    user: {
        name: 'Student',
        examDate: null,
        targetScore: 85,
        studyHoursPerDay: 2
    },
    knowledgeGraph: {
        nodes: [],
        edges: []
    },
    performance: {
        overall: 0,
        byTopic: {},
        history: []
    },
    flashcards: [],
    quizzes: [],
    revisionPlan: [],
    studyStreak: 0,
    burnoutRisk: 'low',
    lastStudyTime: null
};

// ============================================
// MOCK DATA GENERATORS
// ============================================
function generateMockData() {
    // Generate knowledge graph nodes
    const topics = [
        { id: 'math', name: 'Mathematics', subtopics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'] },
        { id: 'physics', name: 'Physics', subtopics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'] },
        { id: 'chemistry', name: 'Chemistry', subtopics: ['Organic', 'Inorganic', 'Physical', 'Analytical'] },
        { id: 'biology', name: 'Biology', subtopics: ['Cell Biology', 'Genetics', 'Ecology', 'Evolution'] }
    ];
    
    AppState.knowledgeGraph.nodes = topics.map(topic => ({
        id: topic.id,
        label: topic.name,
        type: 'topic',
        mastery: Math.random() * 100,
        subtopics: topic.subtopics.map((sub, i) => ({
            id: `${topic.id}_${i}`,
            label: sub,
            type: 'subtopic',
            mastery: Math.random() * 100
        }))
    }));
    
    // Generate flashcards
    const flashcardTopics = [
        { topic: 'Algebra', cards: generateFlashcards('Algebra', 5) },
        { topic: 'Calculus', cards: generateFlashcards('Calculus', 5) },
        { topic: 'Mechanics', cards: generateFlashcards('Mechanics', 5) },
        { topic: 'Organic', cards: generateFlashcards('Organic Chemistry', 5) }
    ];
    
    AppState.flashcards = flashcardTopics.flatMap(t => t.cards);
    
    // Generate quizzes
    AppState.quizzes = generateQuizzes();
    
    // Generate revision plan
    AppState.revisionPlan = generateRevisionPlan();
    
    // Calculate initial performance
    calculatePerformance();
}

function generateFlashcards(topic, count) {
    const flashcards = [];
    const content = {
        'Algebra': [
            { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b²-4ac)) / 2a' },
            { front: 'Define a polynomial', back: 'An algebraic expression with multiple terms involving powers of variables' },
            { front: 'What is the binomial theorem?', back: '(a+b)ⁿ = Σ(k=0 to n) C(n,k) aⁿ⁻ᵏbᵏ' },
            { front: 'Define discriminant', back: 'The part under the square root in the quadratic formula: b² - 4ac' },
            { front: 'What is a function?', back: 'A relation where each input has exactly one output' }
        ],
        'Calculus': [
            { front: 'What is the derivative?', back: 'Rate of change of a function with respect to a variable' },
            { front: 'Define limit', back: 'The value that a function approaches as the input approaches a certain value' },
            { front: 'What is the power rule?', back: 'd/dx(xⁿ) = nxⁿ⁻¹' },
            { front: 'Define integral', back: 'The reverse process of differentiation, representing area under a curve' },
            { front: 'What is the chain rule?', back: 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)' }
        ],
        'Mechanics': [
            { front: "Newton's First Law", back: 'An object at rest stays at rest; an object in motion stays in motion unless acted upon by a force' },
            { front: "Newton's Second Law", back: 'F = ma (Force equals mass times acceleration)' },
            { front: "Newton's Third Law", back: 'For every action, there is an equal and opposite reaction' },
            { front: 'Define momentum', back: 'The product of mass and velocity: p = mv' },
            { front: 'What is kinetic energy?', back: 'Energy of motion: KE = ½mv²' }
        ],
        'Organic Chemistry': [
            { front: 'What is a functional group?', back: 'A specific group of atoms within a molecule that determines its chemical behavior' },
            { front: 'Define isomerism', back: 'Compounds with the same molecular formula but different structural arrangements' },
            { front: 'What is a carbonyl group?', back: 'A carbon atom double-bonded to an oxygen atom (C=O)' },
            { front: 'Define polymerization', back: 'Process of combining small molecules (monomers) into larger molecules (polymers)' },
            { front: 'What is electrophile?', back: 'An electron-deficient species that seeks electrons' }
        ]
    };
    
    const topicCards = content[topic] || content['Algebra'];
    for (let i = 0; i < Math.min(count, topicCards.length); i++) {
        flashcards.push({
            id: `${topic.toLowerCase()}_${i}`,
            topic: topic,
            ...topicCards[i],
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            nextReview: Date.now() + Math.random() * 86400000,
            timesReviewed: 0,
            timesCorrect: 0
        });
    }
    
    return flashcards;
}

function generateQuizzes() {
    return [
        {
            id: 'quiz_1',
            title: 'Algebra Fundamentals',
            topic: 'Algebra',
            questions: [
                {
                    id: 'q1',
                    question: 'Solve for x: 2x + 5 = 15',
                    options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 4'],
                    correct: 0,
                    explanation: '2x = 15 - 5 = 10, so x = 10/2 = 5'
                },
                {
                    id: 'q2',
                    question: 'What is the slope of the line y = 3x + 2?',
                    options: ['2', '3', '5', '6'],
                    correct: 1,
                    explanation: 'In y = mx + b form, m is the slope. Here m = 3'
                },
                {
                    id: 'q3',
                    question: 'Factor: x² - 9',
                    options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+3)²'],
                    correct: 0,
                    explanation: 'This is a difference of squares: a² - b² = (a-b)(a+b)'
                }
            ],
            timeLimit: 300,
            completed: false,
            score: null
        },
        {
            id: 'quiz_2',
            title: 'Physics: Newton\'s Laws',
            topic: 'Physics',
            questions: [
                {
                    id: 'q1',
                    question: 'A 10kg object accelerates at 2m/s². What is the force?',
                    options: ['5N', '20N', '12N', '8N'],
                    correct: 1,
                    explanation: 'F = ma = 10 × 2 = 20N'
                },
                {
                    id: 'q2',
                    question: 'What is the unit of force in SI?',
                    options: ['Joule', 'Watt', 'Newton', 'Pascal'],
                    correct: 2,
                    explanation: 'Newton (N) is the SI unit of force'
                }
            ],
            timeLimit: 180,
            completed: false,
            score: null
        }
    ];
}

function generateRevisionPlan() {
    const topics = ['Algebra', 'Calculus', 'Mechanics', 'Organic Chemistry', 'Cell Biology'];
    const plan = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        plan.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
            topics: topics.slice(0, Math.floor(Math.random() * 3) + 2),
            duration: Math.floor(Math.random() * 60) + 30,
            completed: i < Math.floor(Math.random() * 3),
            focus: ['weak areas', 'practice problems', 'review notes', 'mock test'][Math.floor(Math.random() * 4)]
        });
    }
    
    return plan;
}

function calculatePerformance() {
    let totalMastery = 0;
    let count = 0;
    
    AppState.knowledgeGraph.nodes.forEach(topic => {
        totalMastery += topic.mastery;
        count++;
        topic.subtopics.forEach(sub => {
            totalMastery += sub.mastery;
            count++;
        });
    });
    
    AppState.performance.overall = Math.round(totalMastery / count);
    
    // Calculate by topic
    AppState.knowledgeGraph.nodes.forEach(topic => {
        AppState.performance.byTopic[topic.id] = Math.round(topic.mastery);
    });
}

// ============================================
// UI RENDERING FUNCTIONS
// ============================================
function render() {
    const app = document.getElementById('app');
    
    const html = `
        <div class="container">
            ${renderHeader()}
            ${renderNavTabs()}
            ${renderCurrentTab()}
        </div>
    `;
    
    app.innerHTML = html;
    attachEventListeners();
}

function renderHeader() {
    return `
        <div class="header">
            <div>
                <h1>🎓 AI Exam Prep</h1>
                <p class="header-subtitle">Smart learning powered by AI</p>
            </div>
            <div class="flex gap-2 items-center">
                <div class="text-center">
                    <div class="text-primary font-bold">${AppState.studyStreak}</div>
                    <div class="text-gray text-sm">Day Streak</div>
                </div>
                <div class="text-center">
                    <div class="text-${getBurnoutColor()} font-bold">${AppState.burnoutRisk.toUpperCase()}</div>
                    <div class="text-gray text-sm">Burnout Risk</div>
                </div>
            </div>
        </div>
    `;
}

function renderNavTabs() {
    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'knowledge', label: '🧠 Knowledge', icon: '🧠' },
        { id: 'flashcards', label: '🎴 Flashcards', icon: '🎴' },
        { id: 'quiz', label: '✏️ Quiz', icon: '✏️' },
        { id: 'plan', label: '📅 Plan', icon: '📅' },
        { id: 'analytics', label: '📈 Analytics', icon: '📈' }
    ];
    
    return `
        <div class="nav-tabs">
            ${tabs.map(tab => `
                <button class="nav-tab ${AppState.currentTab === tab.id ? 'active' : ''}" 
                        data-tab="${tab.id}">
                    ${tab.label}
                </button>
            `).join('')}
        </div>
    `;
}

function renderCurrentTab() {
    switch (AppState.currentTab) {
        case 'dashboard': return renderDashboard();
        case 'knowledge': return renderKnowledgeGraph();
        case 'flashcards': return renderFlashcards();
        case 'quiz': return renderQuiz();
        case 'plan': return renderRevisionPlan();
        case 'analytics': return renderAnalytics();
        default: return renderDashboard();
    }
}

function renderDashboard() {
    return `
        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Overall Progress</h3>
                    <span class="card-badge badge-${getProgressBadge(AppState.performance.overall)}">
                        ${getProgressLabel(AppState.performance.overall)}
                    </span>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${AppState.performance.overall}%</div>
                    <div class="stat-label">Mastery Level</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${getProgressClass(AppState.performance.overall)}" 
                         style="width: ${AppState.performance.overall}%"></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Today's Focus</h3>
                    <span class="card-badge badge-high">Priority</span>
                </div>
                <div id="today-focus">
                    ${renderTodayFocus()}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Topic Performance</h3>
                </div>
                ${renderTopicPerformance()}
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="flex flex-col gap-2">
                    <button class="btn btn-primary w-full" onclick="startQuickQuiz()">
                        ⚡ Start Quick Quiz
                    </button>
                    <button class="btn btn-secondary w-full" onclick="switchTab('flashcards')">
                        🎴 Review Flashcards
                    </button>
                    <button class="btn btn-secondary w-full" onclick="switchTab('plan')">
                        📅 View Study Plan
                    </button>
                </div>
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Weekly Progress</h3>
            </div>
            ${renderWeeklyChart()}
        </div>
    `;
}

function renderTodayFocus() {
    const today = new Date().toISOString().split('T')[0];
    const todayPlan = AppState.revisionPlan.find(p => p.date === today);
    
    if (!todayPlan) {
        return '<p class="text-gray">No study plan for today</p>';
    }
    
    return `
        <div class="mb-2">
            <strong>Topics:</strong> ${todayPlan.topics.join(', ')}
        </div>
        <div class="mb-2">
            <strong>Duration:</strong> ${todayPlan.duration} minutes
        </div>
        <div class="mb-2">
            <strong>Focus:</strong> ${todayPlan.focus}
        </div>
        <div class="progress-bar">
            <div class="progress-fill ${todayPlan.completed ? 'high' : 'medium'}" 
                 style="width: ${todayPlan.completed ? 100 : 30}%"></div>
        </div>
        <p class="text-sm text-gray mt-1">${todayPlan.completed ? '✅ Completed' : '⏳ In Progress'}</p>
    `;
}

function renderTopicPerformance() {
    return AppState.knowledgeGraph.nodes.map(topic => `
        <div class="mb-2">
            <div class="flex justify-between mb-1">
                <span>${topic.label}</span>
                <span class="text-${getProgressColor(topic.mastery)}">${Math.round(topic.mastery)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${getProgressClass(topic.mastery)}" 
                     style="width: ${topic.mastery}%"></div>
            </div>
        </div>
    `).join('');
}

function renderWeeklyChart() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [65, 72, 68, 80, 75, 90, 85];
    
    return `
        <div class="flex justify-between items-end" style="height: 150px; padding: 10px 0;">
            ${days.map((day, i) => `
                <div class="text-center" style="flex: 1;">
                    <div class="progress-bar" style="height: ${data[i]}px; width: 30px; margin: 0 auto;">
                        <div class="progress-fill high" style="width: 100%;"></div>
                    </div>
                    <div class="text-sm text-gray mt-1">${day}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderKnowledgeGraph() {
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Knowledge Graph</h3>
                <div>
                    <button class="btn btn-small btn-secondary" onclick="generateNewPath()">
                        🔄 Generate New Path
                    </button>
                </div>
            </div>
            <p class="text-gray mb-3">Your personalized learning path based on performance data</p>
            
            <div class="grid-2">
                ${AppState.knowledgeGraph.nodes.map(topic => `
                    <div class="card" style="background: #f8fafc;">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="card-title">${topic.label}</h4>
                            <span class="card-badge badge-${getProgressBadge(topic.mastery)}">
                                ${Math.round(topic.mastery)}%
                            </span>
                        </div>
                        <div class="progress-bar mb-2">
                            <div class="progress-fill ${getProgressClass(topic.mastery)}" 
                                 style="width: ${topic.mastery}%"></div>
                        </div>
                        <div class="text-sm">
                            <strong>Subtopics:</strong>
                            <div class="flex flex-col gap-1 mt-1">
                                ${topic.subtopics.map(sub => `
                                    <div class="flex justify-between p-1" style="background: white; border-radius: 4px;">
                                        <span>${sub.label}</span>
                                        <span class="text-${getProgressColor(sub.mastery)}">${Math.round(sub.mastery)}%</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">AI Recommendations</h3>
            </div>
            <div id="ai-recommendations">
                ${renderAIRecommendations()}
            </div>
        </div>
    `;
}

function renderAIRecommendations() {
    const weakTopics = [];
    AppState.knowledgeGraph.nodes.forEach(topic => {
        if (topic.mastery < 60) {
            weakTopics.push({ name: topic.label, score: topic.mastery });
        }
        topic.subtopics.forEach(sub => {
            if (sub.mastery < 60) {
                weakTopics.push({ name: sub.label, score: sub.mastery });
            }
        });
    });
    
    if (weakTopics.length === 0) {
        return '<p class="text-success">🎉 Great job! All topics are performing well.</p>';
    }
    
    return weakTopics.slice(0, 3).map(topic => `
        <div class="flex justify-between items-center p-2 mb-1" style="background: #fef3c7; border-radius: 8px;">
            <span>⚠️ Focus on: <strong>${topic.name}</strong></span>
            <span class="text-danger">${Math.round(topic.score)}%</span>
        </div>
    `).join('') + `
        <p class="text-sm text-gray mt-2">💡 AI Suggestion: Spend 30 minutes on weak topics before moving to new content.</p>
    `;
}

function renderFlashcards() {
    const currentCard = AppState.flashcards[0] || { topic: 'No cards', front: 'No cards available', back: '' };
    
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Flashcards - Active Recall</h3>
                <span class="card-badge badge-moderate">${AppState.flashcards.length} cards</span>
            </div>
            
            <div class="flashcard-container" onclick="flipCard()">
                <div class="flashcard" id="flashcard">
                    <div class="flashcard-face flashcard-front">
                        <div class="flashcard-topic">${currentCard.topic}</div>
                        <div class="flashcard-content">${currentCard.front}</div>
                        <div class="flashcard-hint">Click to reveal answer</div>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <div class="flashcard-topic">Answer</div>
                        <div class="flashcard-content">${currentCard.back}</div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-center gap-2 mt-3">
                <button class="btn btn-danger" onclick="rateCard('hard')">😓 Hard</button>
                <button class="btn btn-secondary" onclick="rateCard('medium')">🤔 Medium</button>
                <button class="btn btn-primary" onclick="rateCard('easy')">😊 Easy</button>
            </div>
            
            <div class="text-center mt-2">
                <button class="btn btn-small btn-secondary" onclick="nextCard()">Next Card →</button>
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Topics</h3>
            </div>
            <div class="flex gap-2 flex-wrap">
                ${[...new Set(AppState.flashcards.map(c => c.topic))].map(topic => `
                    <button class="btn btn-small btn-secondary" onclick="filterFlashcards('${topic}')">
                        ${topic}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderQuiz() {
    const activeQuiz = AppState.quizzes[0];
    
    if (!activeQuiz) {
        return '<div class="card"><p>No quizzes available</p></div>';
    }
    
    return `
        <div class="quiz-container">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${activeQuiz.title}</h3>
                    <span class="card-badge badge-high">${activeQuiz.questions.length} Questions</span>
                </div>
                
                <div class="timer" id="quiz-timer">
                    ${formatTime(activeQuiz.timeLimit)}
                </div>
                
                <div id="quiz-content">
                    ${renderQuizQuestion(activeQuiz, 0)}
                </div>
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Available Quizzes</h3>
            </div>
            ${AppState.quizzes.map(quiz => `
                <div class="flex justify-between items-center p-2 mb-1" style="background: #f8fafc; border-radius: 8px;">
                    <div>
                        <strong>${quiz.title}</strong>
                        <div class="text-sm text-gray">${quiz.questions.length} questions • ${Math.floor(quiz.timeLimit/60)} min</div>
                    </div>
                    <span class="card-badge badge-${quiz.completed ? 'strong' : 'moderate'}">
                        ${quiz.completed ? `Score: ${quiz.score}%` : 'Not taken'}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderQuizQuestion(quiz, questionIndex) {
    const question = quiz.questions[questionIndex];
    
    return `
        <div class="quiz-question">
            <div class="mb-2">
                <span class="text-gray">Question ${questionIndex + 1} of ${quiz.questions.length}</span>
            </div>
            <h4 class="mb-2">${question.question}</h4>
            <div class="quiz-options">
                ${question.options.map((option, i) => `
                    <div class="quiz-option" onclick="selectAnswer(${questionIndex}, ${i})" 
                         data-index="${i}" id="option-${questionIndex}-${i}">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div id="explanation-${questionIndex}" class="hidden mt-2 p-2" style="background: #f0fdf4; border-radius: 8px;">
                <strong>Explanation:</strong> ${question.explanation}
            </div>
        </div>
        
        <div class="flex justify-between mt-3">
            <button class="btn btn-secondary" onclick="prevQuestion(${questionIndex})" 
                    ${questionIndex === 0 ? 'disabled' : ''}>
                ← Previous
            </button>
            <button class="btn btn-primary" onclick="nextQuestion(${questionIndex}, ${quiz.questions.length})">
                ${questionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
            </button>
        </div>
    `;
}

function renderRevisionPlan() {
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Weekly Revision Plan</h3>
                <button class="btn btn-small btn-primary" onclick="regeneratePlan()">
                    🔄 Regenerate
                </button>
            </div>
            
            <div class="flex flex-col gap-2">
                ${AppState.revisionPlan.map((day, i) => `
                    <div class="card" style="background: ${day.completed ? '#f0fdf4' : '#f8fafc'};">
                        <div class="flex justify-between items-center">
                            <div>
                                <strong>${day.dayName}</strong>
                                <span class="text-gray"> - ${day.date}</span>
                            </div>
                            <span class="card-badge badge-${day.completed ? 'strong' : 'moderate'}">
                                ${day.completed ? '✅ Done' : '⏳ Pending'}
                            </span>
                        </div>
                        <div class="mt-2">
                            <p><strong>Topics:</strong> ${day.topics.join(', ')}</p>
                            <p><strong>Duration:</strong> ${day.duration} minutes</p>
                            <p><strong>Focus:</strong> ${day.focus}</p>
                        </div>
                        ${!day.completed ? `
                            <button class="btn btn-small btn-primary mt-2" onclick="markComplete(${i})">
                                Mark Complete
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Study Tips</h3>
            </div>
            <div class="flex flex-col gap-2">
                <div class="p-2" style="background: #eff6ff; border-radius: 8px;">
                    💡 <strong>Pomodoro Technique:</strong> Study for 25 min, break for 5 min
                </div>
                <div class="p-2" style="background: #f0fdf4; border-radius: 8px;">
                    🎯 <strong>Active Recall:</strong> Test yourself instead of passive reading
                </div>
                <div class="p-2" style="background: #fef3c7; border-radius: 8px;">
                    😴 <strong>Sleep:</strong> 7-8 hours improves memory consolidation
                </div>
            </div>
        </div>
    `;
}

function renderAnalytics() {
    return `
        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Performance Summary</h3>
                </div>
                <div class="grid-3">
                    <div class="stat-card">
                        <div class="stat-value">${AppState.performance.overall}%</div>
                        <div class="stat-label">Overall Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${AppState.studyStreak}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${AppState.flashcards.length}</div>
                        <div class="stat-label">Cards Reviewed</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Topic Breakdown</h3>
                </div>
                ${Object.entries(AppState.performance.byTopic).map(([topic, score]) => `
                    <div class="mb-2">
                        <div class="flex justify-between">
                            <span>${topic.charAt(0).toUpperCase() + topic.slice(1)}</span>
                            <span class="text-${getProgressColor(score)}">${score}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${getProgressClass(score)}" style="width: ${score}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Progress Over Time</h3>
            </div>
            <div style="height: 200px; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px 0;">
                ${[65, 68, 72, 70, 75, 78, 82].map((score, i) => `
                    <div class="text-center">
                        <div style="height: ${score * 1.5}px; width: 40px; background: linear-gradient(to top, #2563eb, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                        <div class="text-sm text-gray mt-1">Week ${i + 1}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card mt-3">
            <div class="card-header">
                <h3 class="card-title">Burnout Prevention</h3>
            </div>
            <div class="flex flex-col gap-2">
                <div class="p-2" style="background: #f0fdf4; border-radius: 8px;">
                    <strong>Current Risk Level:</strong> 
                    <span class="text-${getBurnoutColor()}">${AppState.burnoutRisk.toUpperCase()}</span>
                </div>
                <div class="p-2" style="background: #f8fafc; border-radius: 8px;">
                    <strong>Recommendations:</strong>
                    <ul class="mt-1">
                        <li>✓ Take regular breaks every 45-50 minutes</li>
                        <li>✓ Stay hydrated and maintain healthy snacks</li>
                        <li>✓ Get adequate sleep (7-8 hours)</li>
                        <li>✓ Mix subjects to avoid monotony</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function switchTab(tabId) {
    AppState.currentTab = tabId;
    render();
}

function getProgressClass(value) {
    if (value >= 70) return 'high';
    if (value >= 40) return 'medium';
    return 'low';
}

function getProgressColor(value) {
    if (value >= 70) return 'success';
    if (value >= 40) return 'warning';
    return 'danger';
}

function getProgressBadge(value) {
    if (value >= 70) return 'strong';
    if (value >= 40) return 'moderate';
    return 'critical';
}

function getProgressLabel(value) {
    if (value >= 70) return 'Excellent';
    if (value >= 40) return 'Good';
    return 'Needs Work';
}

function getBurnoutColor() {
    switch (AppState.burnoutRisk) {
        case 'low': return 'success';
        case 'medium': return 'warning';
        case 'high': return 'danger';
        default: return 'gray';
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// INTERACTION FUNCTIONS
// ============================================
function attachEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            AppState.currentTab = tab.dataset.tab;
            render();
        });
    });
}

function flipCard() {
    const card = document.getElementById('flashcard');
    card.classList.toggle('flipped');
}

function rateCard(difficulty) {
    // Simulate rating - in real app, this would update spaced repetition data
    alert(`Card marked as: ${difficulty.toUpperCase()}`);
    nextCard();
}

function nextCard() {
    // Move to next card (simulated)
    const card = document.getElementById('flashcard');
    if (card) card.classList.remove('flipped');
    // In real app, would load next card
}

function filterFlashcards(topic) {
    alert(`Filtering flashcards for: ${topic}`);
}

function startQuickQuiz() {
    switchTab('quiz');
}

function generateNewPath() {
    alert('🔄 Generating new personalized learning path...');
    // In real app, this would call AI to generate new path
}

function regeneratePlan() {
    AppState.revisionPlan = generateRevisionPlan();
    render();
}

function markComplete(index) {
    AppState.revisionPlan[index].completed = true;
    AppState.studyStreak++;
    render();
}

function selectAnswer(questionIndex, optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    const option = document.getElementById(`option-${questionIndex}-${optionIndex}`);
    option.classList.add('selected');
    
    // Show explanation
    const explanation = document.getElementById(`explanation-${questionIndex}`);
    explanation.classList.remove('hidden');
}

function nextQuestion(currentIndex, total) {
    if (currentIndex < total - 1) {
        alert('Moving to next question...');
    } else {
        alert('Quiz completed! Great job! 🎉');
    }
}

function prevQuestion(currentIndex) {
    if (currentIndex > 0) {
        alert('Moving to previous question...');
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    generateMockData();
    render();
}

// Start the app
init();