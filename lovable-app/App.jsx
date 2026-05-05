import React, { useState, useEffect } from 'react';
import './App.css';

// Configuration - Update this to your Flask server URL
const FLASK_API_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false; // Set to true if Flask is not running

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [studentData, setStudentData] = useState({
    syllabus: '',
    performanceHistory: '',
    targetExam: '',
    studyTime: '3',
    weakSubjects: ''
  });
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  // Generate mock study plan
  const generateMockStudyPlan = () => {
    return {
      weeklySchedule: [
        { day: 'Monday', topics: ['Quadratic Equations', 'Newton Laws'], duration: '2 hours', focus: 'Weak areas' },
        { day: 'Tuesday', topics: ['Differentiation', 'Work and Energy'], duration: '2 hours', focus: 'Practice problems' },
        { day: 'Wednesday', topics: ['Limits', 'Momentum'], duration: '2 hours', focus: 'New concepts' },
        { day: 'Thursday', topics: ['Integration', 'Work Energy'], duration: '2 hours', focus: 'Review' },
        { day: 'Friday', topics: ['Derivatives', 'Newton Laws'], duration: '2 hours', focus: 'Mock test' },
        { day: 'Saturday', topics: ['Full Revision'], duration: '3 hours', focus: 'Practice' },
        { day: 'Sunday', topics: ['Break'], duration: '0 hours', focus: 'Rest' }
      ],
      priorityTopics: [
        { name: 'Quadratic Equations', priority: 'High', weightage: '15%' },
        { name: 'Differentiation', priority: 'High', weightage: '20%' },
        { name: 'Newton Laws', priority: 'Medium', weightage: '12%' },
        { name: 'Integration', priority: 'Medium', weightage: '15%' }
      ],
      dailySchedule: {
        morning: { activity: 'Review previous topics', time: '30 min' },
        afternoon: { activity: 'New concepts', time: '1 hour' },
        evening: { activity: 'Practice problems', time: '1 hour' }
      },
      progressMetrics: {
        topicsCovered: 12,
        questionsAttempted: 150,
        accuracyRate: '72%',
        studyStreak: 5
      },
      wellnessTips: [
        'Take 5-minute breaks every 45 minutes',
        'Stay hydrated throughout study sessions',
        'Get 7-8 hours of sleep for better retention',
        'Alternate between easy and difficult topics'
      ],
      motivationTips: [
        'Consistent daily practice beats last-minute cramming',
        'You are making progress! Keep it up!',
        'Focus on understanding, not just memorization',
        'Small improvements compound over time'
      ],
      practiceQuestions: [
        { id: 1, question: 'Solve: x² - 5x + 6 = 0', options: ['x=2,3', 'x=-2,-3', 'x=1,6', 'x=-1,-6'], correct: 0, explanation: 'Using quadratic formula or factorization' },
        { id: 2, question: 'Find derivative of x³', options: ['x²', '3x²', '3x³', 'x³/3'], correct: 1, explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹' }
      ]
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (USE_MOCK_DATA) {
        // Generate mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = generateMockStudyPlan();
      } else {
        // Call Flask API
        const response = await fetch(`${FLASK_API_URL}/generate-plan`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(studentData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to generate plan');
        }
        
        result = data.study_plan;
      }
      
      setStudyPlan(result);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Error generating study plan:', err);
      setError('Failed to connect to server. Using demo data.');
      // Fallback to mock data
      setStudyPlan(generateMockStudyPlan());
      setCurrentView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Input form view
  if (currentView === 'home') {
    return (
      <div className="app-container">
        <header className="header">
          <h1>🎓 AI Exam Prep</h1>
          <p>Personalized Learning Assistant</p>
        </header>

        <main className="main-content">
          <div className="form-card">
            <h2>Create Your Study Plan</h2>
            <p className="subtitle">Enter your details and let AI create a personalized study plan for you</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Syllabus / Topics to Cover</label>
                <textarea
                  placeholder="e.g., Mathematics: Algebra, Calculus; Physics: Mechanics, Thermodynamics"
                  value={studentData.syllabus}
                  onChange={(e) => setStudentData({...studentData, syllabus: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Performance History</label>
                <textarea
                  placeholder="e.g., Previous test scores, weak areas identified"
                  value={studentData.performanceHistory}
                  onChange={(e) => setStudentData({...studentData, performanceHistory: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Target Exam</label>
                <input
                  type="text"
                  placeholder="e.g., JEE Main, NEET, Board Exam"
                  value={studentData.targetExam}
                  onChange={(e) => setStudentData({...studentData, targetExam: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Study Time Available (hours/day)</label>
                <select
                  value={studentData.studyTime}
                  onChange={(e) => setStudentData({...studentData, studyTime: e.target.value})}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5+ hours</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weak Subjects / Topics (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Quadratic Equations, Differentiation, Newton Laws"
                  value={studentData.weakSubjects}
                  onChange={(e) => setStudentData({...studentData, weakSubjects: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Generating...' : 'Generate My Study Plan 🚀'}
              </button>
            </form>
          </div>
        </main>

        <footer className="footer">
          <p>Powered by Python Flask + Google Gemini AI</p>
        </footer>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>🎓 AI Exam Prep</h1>
          <p>Your Personalized Learning Plan</p>
        </div>
        <button className="new-plan-btn" onClick={() => { setCurrentView('home'); setStudyPlan(null); }}>
          New Plan
        </button>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Questions
        </button>
        <button 
          className={`tab ${activeTab === 'wellness' ? 'active' : ''}`}
          onClick={() => setActiveTab('wellness')}
        >
          💪 Wellness
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && studyPlan && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{studyPlan.progressMetrics?.topicsCovered || 0}</div>
                <div className="stat-label">Topics Covered</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{studyPlan.progressMetrics?.questionsAttempted || 0}</div>
                <div className="stat-label">Questions Attempted</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{studyPlan.progressMetrics?.accuracyRate || '0%'}</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{studyPlan.progressMetrics?.studyStreak || 0} 🔥</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <div className="card">
              <h3>🎯 Priority Topics</h3>
              <div className="topic-list">
                {studyPlan.priorityTopics?.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <span className="topic-name">{topic.name}</span>
                    <span className={`priority-badge ${topic.priority.toLowerCase()}`}>
                      {topic.priority}
                    </span>
                    <span className="weightage">{topic.weightage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>💡 Today's Motivation</h3>
              <div className="motivation-list">
                {studyPlan.motivationTips?.slice(0, 2).map((tip, index) => (
                  <p key={index}>✨ {tip}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && studyPlan && (
          <div className="schedule">
            <div className="card">
              <h3>📅 Weekly Schedule</h3>
              <div className="weekly-grid">
                {studyPlan.weeklySchedule?.map((day, index) => (
                  <div key={index} className={`day-card ${day.topics[0] === 'Break' ? 'rest' : ''}`}>
                    <div className="day-name">{day.day}</div>
                    <div className="day-topics">{day.topics.join(', ')}</div>
                    <div className="day-duration">{day.duration}</div>
                    <div className="day-focus">{day.focus}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>⏰ Daily Routine</h3>
              <div className="routine-list">
                <div className="routine-item">
                  <span className="time">Morning</span>
                  <span className="activity">{studyPlan.dailySchedule?.morning?.activity}</span>
                  <span className="duration">{studyPlan.dailySchedule?.morning?.time}</span>
                </div>
                <div className="routine-item">
                  <span className="time">Afternoon</span>
                  <span className="activity">{studyPlan.dailySchedule?.afternoon?.activity}</span>
                  <span className="duration">{studyPlan.dailySchedule?.afternoon?.time}</span>
                </div>
                <div className="routine-item">
                  <span className="time">Evening</span>
                  <span className="activity">{studyPlan.dailySchedule?.evening?.activity}</span>
                  <span className="duration">{studyPlan.dailySchedule?.evening?.time}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && studyPlan && (
          <div className="questions">
            <div className="card">
              <h3>❓ Practice Questions</h3>
              {studyPlan.practiceQuestions?.length > 0 ? (
                <div className="questions-list">
                  {studyPlan.practiceQuestions.map((q, index) => (
                    <div key={index} className="question-card">
                      <div className="question-text">{index + 1}. {q.question}</div>
                      <div className="question-options">
                        {q.options?.map((opt, i) => (
                          <div key={i} className="option">
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                      <div className="question-explanation">
                        <strong>Answer:</strong> {q.options?.[q.correct]} <br/>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No practice questions generated yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wellness' && studyPlan && (
          <div className="wellness">
            <div className="card">
              <h3>🧘 Study Wellness Tips</h3>
              <ul className="wellness-list">
                {studyPlan.wellnessTips?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>💪 Motivation</h3>
              <ul className="motivation-list">
                {studyPlan.motivationTips?.map((tip, index) => (
                  <li key={index}>✨ {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
