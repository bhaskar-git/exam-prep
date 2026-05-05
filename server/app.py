

"""
AI Exam Prep - Flask Backend
Personalized Learning Assistant using Google Gemini AI
"""

from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
import json

app = Flask(__name__, 
           static_folder='../client/build/static',
           template_folder='../client/build')
""" app = Flask(__name__, static_folder="../client/dist", static_url_path="") """

CORS(app)

# Configure Google Gemini
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE')

if GEMINI_API_KEY and GEMINI_API_KEY != 'YOUR_GEMINI_API_KEY_HERE':
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# In-memory storage
study_plans = {}


def generate_study_plan_with_ai(syllabus, performance_history, target_exam, study_time, weak_subjects):
    """Generate personalized study plan using Gemini AI"""
    
    prompt = f"""You are an expert educational consultant. Based on the student's inputs, create a personalized study plan.

Student Profile:
- Syllabus: {syllabus}
- Performance History: {performance_history}
- Target Exam: {target_exam}
- Available Study Time: {study_time} hours/day
- Weak Subjects: {weak_subjects}

Create a structured study plan in JSON format with:
1. Weekly schedule (7 days)
2. Priority topics with weightage
3. Daily routine (morning, afternoon, evening)
4. Progress metrics
5. Wellness tips (4-5 tips)
6. Motivation tips (4-5 tips)

Return ONLY valid JSON."""
    
    response = model.generate_content(prompt)
    
    try:
        text = response.text
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = text[start:end]
            study_plan = json.loads(json_str)
            return study_plan
    except Exception as e:
        print(f"Error parsing AI response: {e}")
    
    return generate_mock_study_plan()


def generate_questions_with_ai(focus_areas):
    """Generate practice questions using Gemini AI"""
    
    prompt = f"""Generate 5 practice questions based on:
- Focus Topics: {focus_areas}
- Include: question, options, correct answer, explanation

Return ONLY valid JSON array."""
    
    response = model.generate_content(prompt)
    
    try:
        text = response.text
        start = text.find('[')
        end = text.rfind(']') + 1
        if start != -1 and end != 0:
            json_str = text[start:end]
            questions = json.loads(json_str)
            return questions
    except Exception as e:
        print(f"Error parsing questions: {e}")
    
    return []


def generate_mock_study_plan():
    """Generate mock study plan when AI is not available"""
    return {
        "weeklySchedule": [
            {"day": "Monday", "topics": ["Quadratic Equations", "Newton Laws"], "duration": "2 hours", "focus": "Weak areas"},
            {"day": "Tuesday", "topics": ["Differentiation", "Work and Energy"], "duration": "2 hours", "focus": "Practice problems"},
            {"day": "Wednesday", "topics": ["Limits", "Momentum"], "duration": "2 hours", "focus": "New concepts"},
            {"day": "Thursday", "topics": ["Integration", "Work Energy"], "duration": "2 hours", "focus": "Review"},
            {"day": "Friday", "topics": ["Derivatives", "Newton Laws"], "duration": "2 hours", "focus": "Mock test"},
            {"day": "Saturday", "topics": ["Full Revision"], "duration": "3 hours", "focus": "Practice"},
            {"day": "Sunday", "topics": ["Break"], "duration": "0 hours", "focus": "Rest"}
        ],
        "priorityTopics": [
            {"name": "Quadratic Equations", "priority": "High", "weightage": "15%"},
            {"name": "Differentiation", "priority": "High", "weightage": "20%"},
            {"name": "Newton Laws", "priority": "Medium", "weightage": "12%"},
            {"name": "Integration", "priority": "Medium", "weightage": "15%"}
        ],
        "dailySchedule": {
            "morning": {"activity": "Review previous topics", "time": "30 min"},
            "afternoon": {"activity": "New concepts", "time": "1 hour"},
            "evening": {"activity": "Practice problems", "time": "1 hour"}
        },
        "progressMetrics": {
            "topicsCovered": 0,
            "questionsAttempted": 0,
            "accuracyRate": "0%",
            "studyStreak": 0
        },
        "wellnessTips": [
            "Take 5-minute breaks every 45 minutes",
            "Stay hydrated throughout study sessions",
            "Get 7-8 hours of sleep for better retention",
            "Alternate between easy and difficult topics"
        ],
        "motivationTips": [
            "Consistent daily practice beats last-minute cramming",
            "You are making progress! Keep it up!",
            "Focus on understanding, not just memorization",
            "Small improvements compound over time"
        ],
        "practiceQuestions": [
            {"id": 1, "question": "Solve: x² - 5x + 6 = 0", "options": ["x=2,3", "x=-2,-3", "x=1,6", "x=-1,-6"], "correct": 0, "explanation": "Using quadratic formula"},
            {"id": 2, "question": "Find derivative of x³", "options": ["x²", "3x²", "3x³", "x³/3"], "correct": 1, "explanation": "Power rule: d/dx(xⁿ) = nxⁿ⁻¹"}
        ]
    }


# Serve React frontend for all routes (SPA support)
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/<path:path>')
def serve_react(path):
    """Serve the React app for all non-API routes"""
    # If it's an API request, return 404
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Try to serve the index.html
    try:
        return send_from_directory(app.template_folder, 'index.html')
    except:
        # If no build exists, return API info
        return jsonify({
            "message": "AI Exam Prep API",
            "version": "1.0",
            "note": "Build the React client for full app",
            "endpoints": {
                "/api/generate-plan": "POST - Generate study plan",
                "/api/health": "GET - Health check"
            }
        })


@app.route('/api')
def api_info():
    """API information"""
    return jsonify({
        "message": "AI Exam Prep API",
        "version": "1.0",
        "endpoints": {
            "/api/generate-plan": "POST - Generate study plan",
            "/api/generate-questions": "POST - Generate questions",
            "/api/health": "GET - Health check"
        }
    })


@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "ai_configured": model is not None,
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    """Generate personalized study plan"""
    try:
        data = request.get_json()
        
        syllabus = data.get('syllabus', '')
        performance_history = data.get('performanceHistory', '')
        target_exam = data.get('targetExam', '')
        study_time = data.get('studyTime', '3')
        weak_subjects = data.get('weakSubjects', '')
        
        if model:
            study_plan = generate_study_plan_with_ai(
                syllabus, performance_history, target_exam, study_time, weak_subjects
            )
        else:
            study_plan = generate_mock_study_plan()
        
        if model:
            questions = generate_questions_with_ai(weak_subjects)
            study_plan['practiceQuestions'] = questions
        
        plan_id = f"plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        study_plans[plan_id] = study_plan
        
        return jsonify({
            "success": True,
            "plan_id": plan_id,
            "study_plan": study_plan,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    """Generate practice questions"""
    try:
        data = request.get_json()
        focus_areas = data.get('focusAreas', '')
        
        if model:
            questions = generate_questions_with_ai(focus_areas)
        else:
            questions = []
        
        return jsonify({
            "success": True,
            "questions": questions,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/get-plan/<plan_id>', methods=['GET'])
def get_plan(plan_id):
    """Get a specific study plan"""
    if plan_id in study_plans:
        return jsonify({"success": True, "plan": study_plans[plan_id]})
    return jsonify({"success": False, "error": "Plan not found"}), 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 50)
    print("🚀 AI Exam Prep - Flask Backend")
    print("=" * 50)
    print(f"\nAI Configured: {model is not None}")
    print(f"Server running on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)