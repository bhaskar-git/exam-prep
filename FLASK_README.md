<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Exam Prep - Personalized Learning</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="App.css">
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

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

      const generateMockStudyPlan = () => ({
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
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
          let result;
          
          if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            result = generateMockStudyPlan();
          } else {
            const response = await fetch(`${FLASK_API_URL}/generate-plan`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(studentData)
            });
            
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            result = data.study_plan;
          }
          
          setStudyPlan(result);
          setCurrentView('dashboard');
        } catch (err) {
          console.error('Error:', err);
          setError('Failed to connect to server. Using demo data.');
          setStudyPlan(generateMockStudyPlan());
          setCurrentView('dashboard');
        } finally {
          setLoading(false);
        }
      };

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
                <p className="subtitle">Enter your details and let AI create a personalized study plan</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Syllabus / Topics</label>
                    <textarea
                      placeholder="e.g., Mathematics: Algebra, Calculus; Physics: Mechanics"
                      value={studentData.syllabus}
                      onChange={(e) => setStudentData({...studentData, syllabus: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Performance History</label>
                    <textarea
                      placeholder="Previous test scores, weak areas"
                      value={studentData.performanceHistory}
                      onChange={(e) => setStudentData({...studentData, performanceHistory: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Target Exam</label>
                    <input
                      type="text"
                      placeholder="e.g., JEE Main, NEET"
                      value={studentData.targetExam}
                      onChange={(e) => setStudentData({...studentData, targetExam: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Study Time (hours/day)</label>
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
                    <label>Weak Subjects</label>
                    <input
                      type="text"
                      placeholder="e.g., Quadratic Equations, Differentiation"
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
          </div>
        );
      }

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
            {['dashboard', 'schedule', 'questions', 'wellness'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'schedule' && '📅 Schedule'}
                {tab === 'questions' && '❓ Questions'}
                {tab === 'wellness' && '💪 Wellness'}
              </button>
            ))}
          </nav>
          <main className="main-content">
            {activeTab === 'dashboard' && studyPlan && (
              <div className="dashboard">
                <div className="stats-grid">
                  {Object.entries(studyPlan.progressMetrics).map(([key, value]) => (
                    <div key={key} className="stat-card">
                      <div className="stat-value">{value}</div>
                      <div className="stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h3>🎯 Priority Topics</h3>
                  <div className="topic-list">
                    {studyPlan.priorityTopics.map((topic, i) => (
                      <div key={i} className="topic-item">
                        <span className="topic-name">{topic.name}</span>
                        <span className={`priority-badge ${topic.priority.toLowerCase()}`}>{topic.priority}</span>
                        <span className="weightage">{topic.weightage}</span>
                      </div>
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
                    {studyPlan.weeklySchedule.map((day, i) => (
                      <div key={i} className={`day-card ${day.topics[0] === 'Break' ? 'rest' : ''}`}>
                        <div className="day-name">{day.day}</div>
                        <div className="day-topics">{day.topics.join(', ')}</div>
                        <div className="day-duration">{day.duration}</div>
                        <div className="day-focus">{day.focus}</div>
                      </div>
                    ))}
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
                      {studyPlan.practiceQuestions.map((q, i) => (
                        <div key={i} className="question-card">
                          <div className="question-text">{i + 1}. {q.question}</div>
                          <div className="question-options">
                            {q.options?.map((opt, j) => (
                              <div key={j} className="option">{String.fromCharCode(65 + j)}. {opt}</div>
                            ))}
                          </div>
                          <div className="question-explanation">
                            <strong>Answer:</strong> {q.options?.[q.correct]} | <strong>Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p>No questions available</p>}
                </div>
              </div>
            )}
            {activeTab === 'wellness' && studyPlan && (
              <div className="wellness">
                <div className="card">
                  <h3>🧘 Study Wellness Tips</h3>
                  <ul className="wellness-list">
                    {studyPlan.wellnessTips?.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
                <div className="card">
                  <h3>💪 Motivation</h3>
                  <ul className="motivation-list">
                    {studyPlan.motivationTips?.map((tip, i) => <li key={i}>✨ {tip}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </main>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html># AI Exam Prep - Flask Backend

A personalized learning assistant that uses Google Gemini AI to create study plans for students.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Google Gemini API Key

### Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set your Gemini API Key:**

**Option A - Environment Variable (Recommended):**
```bash
# Windows
set GEMINI_API_KEY=your_api_key_here

# Mac/Linux
export GEMINI_API_KEY=your_api_key_here
```

**Option B - Edit app.py:**
Open `app.py` and replace:
```python
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE')
```
with:
```python
GEMINI_API_KEY = 'your_actual_api_key_here'
```

3. **Run the server:**
```bash
python app.py
```

4. **Open in browser:**
```
http://localhost:5000
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page info |
| `/api/health` | GET | Health check |
| `/api/generate-plan` | POST | Generate study plan |
| `/api/generate-questions` | POST | Generate practice questions |
| `/api/get-plan/<plan_id>` | GET | Get specific plan |

## 📝 API Request/Response Examples

### Generate Study Plan

**Request:**
```bash
curl -X POST http://localhost:5000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "syllabus": "Mathematics: Algebra, Calculus; Physics: Mechanics",
    "performanceHistory": "Previous test scores: Math 65%, Physics 58%",
    "targetExam": "Engineering Entrance Exam",
    "studyTime": "3",
    "weakSubjects": "Quadratic Equations, Differentiation, Newton Laws"
  }'
```

**Response:**
```json
{
  "success": true,
  "plan_id": "plan_20240501_143022",
  "study_plan": {
    "weeklySchedule": [...],
    "priorityTopics": [...],
    "dailySchedule": {...},
    "progressMetrics": {...},
    "wellnessTips": [...],
    "motivationTips": [...]
  },
  "timestamp": "2024-05-01T14:30:22.123456"
}
```

## 🖥️ Running the Frontend

### Option 1: Standalone HTML
Simply open `lovable-app/index.html` in your browser.


### Option 2: Connect to Flask

1. In `lovable-app/App.jsx`, update:
```javascript
const FLASK_API_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false;
```

2. Open `lovable-app/index.html` in your browser

### Option 3: Deploy to Lovable

1. Go to [lovable.dev](https://lovable.dev)
2. Create a new project
3. Copy `lovable-app/App.jsx` → `App.jsx`
4. Copy `lovable-app/App.css` → `App.css`
5. Update the `FLASK_API_URL` constant with your deployed Flask URL

## 🔧 Configuration

### Change API Key
```bash
export GEMINI_API_KEY=your_key  # Linux/Mac
set GEMINI_API_KEY=your_key     # Windows
```

### Change Port
In `app.py`, change:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📁 Project Structure

```
.
├── app.py                 # Flask backend
├── requirements.txt      # Python dependencies
├── setup.bat            # Windows setup script
├── FLASK_README.md       # This file
├── lovable-app/
│   ├── App.jsx          # React component
│   ├── App.css          # Styles
│   ├── index.html       # Standalone HTML
│   └── README.md       # Frontend docs
└── static/              # Static files (optional)
```

## 🐛 Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt
```

### "Gemini API Key not found" error
Make sure `GEMINI_API_KEY` is set as an environment variable or edit `app.py`

### CORS errors
The Flask app includes CORS support via `flask-cors`. Make sure your frontend makes requests to the correct URL.

### Connection refused
Make sure Flask is running on `http://localhost:5000`

## 📄 License

MIT License

## 👤 Author

Built for the AI Generalist Hackathon
