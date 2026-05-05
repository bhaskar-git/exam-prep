"""
AI Exam Prep - Flask Backend
Personalized Learning Assistant using Google Gemini AI
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configure Google Gemini
# Set your API key as environment variable: GEMINI_API_KEY
# Or replace directly below
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE')

if GEMINI_API_KEY != 'YOUR_GEMINI_API_KEY_HERE':
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# In-memory storage (replace with database for production)
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
4. Progress metrics (initialize with 0 values)
5. Wellness tips (4-5 tips)
6. Motivation tips (4-5 tips)

Return ONLY valid JSON, no other text. Use this exact JSON structure:
{{"weeklySchedule": [{{"day": "Monday", "topics": ["topic1"], "duration": "2 hours", "focus": "focus area"}}], "priorityTopics": [{{"name": "topic name", "priority": "High/Medium/Low", "weightage": "percentage"}}], "dailySchedule": {{"morning": {{"activity": "activity", "time": "duration"}}, "afternoon": {{...}}, "evening": {{...}}}}, "progressMetrics": {{}}, "wellnessTips": ["tip1"], "motivationTips": ["tip1"]}}"""
    
    response = model.generate_content(prompt)
    
    # Parse the JSON response
    try:
        # Find JSON in response
        text = response.text
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end != 0:
            json_str = text[start:end]
            study_plan = json.loads(json_str)
            return study_plan
    except Exception as e:
        print(f"Error parsing AI response: {e}")
    
    # Fallback to mock data if AI fails
    return generate_mock_study_plan()


def generate_questions_with_ai(focus_areas):
    """Generate practice questions using Gemini AI"""
    
    prompt = f"""Generate 5 adaptive practice questions based on:
- Focus Topics: {focus_areas}
- Difficulty Level: Mix of Easy, Medium, Hard
- Question Types: MCQ, Short Answer, Problem Solving

Create questions with:
1. Clear problem statements
2. Multiple choice options (for MCQ)
3. Detailed explanations

Return ONLY valid JSON array with this structure:
[{{"id": 1, "question": "question text", "options": ["a", "b", "c", "d"], "correct": 0, "explanation": "explanation"}}]"""
    
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
        ]
    }


@app.route('/')
def index():
    """Home page"""
    return jsonify({
        "message": "AI Exam Prep API",
        "version": "1.0",
        "endpoints": {
            "/api/generate-plan": "POST - Generate personalized study plan",
            "/api/generate-questions": "POST - Generate practice questions",
            "/api/get-plan/<plan_id>": "GET - Get a specific study plan",
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
        
        # Extract data
        syllabus = data.get('syllabus', '')
        performance_history = data.get('performanceHistory', '')
        target_exam = data.get('targetExam', '')
        study_time = data.get('studyTime', '3')
        weak_subjects = data.get('weakSubjects', '')
        
        # Generate study plan
        if model:
            study_plan = generate_study_plan_with_ai(
                syllabus, 
                performance_history, 
                target_exam, 
                study_time, 
                weak_subjects
            )
        else:
            study_plan = generate_mock_study_plan()
        
        # Generate questions
        if model:
            questions = generate_questions_with_ai(weak_subjects)
            study_plan['practiceQuestions'] = questions
        
        # Store plan
        plan_id = f"plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        study_plans[plan_id] = study_plan
        
        return jsonify({
            "success": True,
            "plan_id": plan_id,
            "study_plan": study_plan,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


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
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/get-plan/<plan_id>', methods=['GET'])
def get_plan(plan_id):
    """Get a specific study plan"""
    if plan_id in study_plans:
        return jsonify({
            "success": True,
            "plan": study_plans[plan_id]
        })
    return jsonify({
        "success": False,
        "error": "Plan not found"
    }), 404


@app.route('/api/plans', methods=['GET'])
def get_all_plans():
    """Get all study plans"""
    return jsonify({
        "success": True,
        "plans": study_plans
    })


# Serve static files (for frontend)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


if __name__ == '__main__':
    print("=" * 50)
    print("🚀 AI Exam Prep - Flask Backend")
    print("=" * 50)
    print("\nTo configure Gemini AI:")
    print("  Set GEMINI_API_KEY environment variable")
    print("  OR edit app.py and replace 'YOUR_GEMINI_API_KEY_HERE'")
    print("\nStarting server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
