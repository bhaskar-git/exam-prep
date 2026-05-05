# AI Exam Prep - Deployment Guide

This document explains how to deploy the AI Exam Prep application to various platforms.

## Table of Contents
- [Quick Start](#quick-start)
- [Frontend Only (GitHub Pages)](#option-1-frontend-only-github-pages)
- [Full Stack on Render](#option-2-full-stack-on-render-free)
- [Frontend + Backend Split Deployment](#option-3-frontend-on-github-pages--backend-on-render)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Python 3.8+
- GitHub account
- Google Gemini API Key

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/exam-prep.git
cd exam-prep

# Install dependencies
pip install -r requirements.txt

# Set API key (replace with your key)
export GEMINI_API_KEY=your_gemini_api_key

# Run locally
python app.py

# Open http://localhost:5000
```

---

## Option 1: Frontend Only (GitHub Pages)

### Best for: Static frontend demo

The React/HTML frontend can be deployed to GitHub Pages without a backend.


### Steps:


1. **Create a new GitHub repository**

2. **Push the frontend files:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/exam-prep.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to your repository → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
   - Click **Save**


4. **Your site will be live at:**
```
https://yourusername.github.io/exam-prep/
```

### Note:
This version will use **mock data** since there's no backend. To use real AI:
- Deploy the backend separately (see Option 2)
- Update the API URL in the frontend

---


## Option 2: Full Stack on Render (Free)


### Best for: Complete working application with AI

Render offers a free tier for Python/Flask applications.

### Steps:


1. **Push code to GitHub:**
```bash
# Make sure you have these files:
# - app.py
# - requirements.txt
# - runtime.txt
# - Procfile

git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create Render account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create a new Web Service:**
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Render will auto-detect the settings

4. **Configure the service:**
   - **Name:** `exam-prep`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --host=0.0.0.0 --port=$PORT`


5. **Add Environment Variable:**
   - Click **Advanced**
   - Add new environment variable:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** `your_google_gemini_api_key`


6. **Deploy:**
   - Click **Create Web Service**
   - Wait for build to complete
   - Your app will be live at:
```
https://exam-prep.onrender.com
```

---


## Option 3: Frontend on GitHub Pages + Backend on Render


### Best for: Production deployment

Deploy frontend to GitHub Pages and backend to Render.

### Step 1: Deploy Backend to Render

Follow **Option 2** steps above. Note your backend URL:
```
https://your-app.onrender.com
```

### Step 2: Update Frontend Configuration

Edit `lovable-app/App.jsx`:
```javascript
// Update this line with your Render URL
const FLASK_API_URL = 'https://your-app.onrender.com/api';
const USE_MOCK_DATA = false;
```

Also update `lovable-app/index.html`:
```javascript
const FLASK_API_URL = 'https://your-app.onrender.com/api';
const USE_MOCK_DATA = false;
```

### Step 3: Deploy Frontend to GitHub Pages

1. Push the updated code to GitHub
2. Go to **Settings** → **Pages**
3. Enable GitHub Pages from main branch
4. Your frontend will be at:
```
https://yourusername.github.io/exam-prep/
```

---


## Environment Variables

### Required

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `FLASK_ENV` | development | Environment mode |

---

## Testing the Deployment

### Test the API
```bash
curl -X POST https://your-app.onrender.com/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "syllabus": "Mathematics: Algebra, Calculus",
    "targetExam": "JEE Main",
    "studyTime": "3",
    "weakSubjects": "Quadratic Equations"
  }'
```

### Expected Response
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

---


## Troubleshooting


### Build Fails
- Check that `requirements.txt` is in the root directory
- Ensure `runtime.txt` specifies a valid Python version


### 503 Service Unavailable
- Check if `GEMINI_API_KEY` is set in Render dashboard
- Verify the Start Command is correct

### CORS Errors
- Ensure Flask is running and accessible
- Check that the frontend API URL matches your backend URL

### Frontend Shows No Data
- Set `USE_MOCK_DATA = false` in the frontend
- Verify the backend URL is correct
- Check browser console for errors


---

## Project Structure for Deployment


```
exam-prep/
├── app.py                 # Flask backend (REQUIRED)
├── requirements.txt      # Python dependencies (REQUIRED)
├── runtime.txt          # Python version (REQUIRED)
├── Procfile             # Deployment command (REQUIRED)
├── render.yaml          # Render config (optional)
├── .gitignore           # Git ignore rules
├── lovable-app/
│   ├── App.jsx          # React component
│   ├── App.css          # Styles
│   └── index.html       # Standalone HTML
├── FLASK_README.md      # Backend documentation
└── DEPLOYMENT.md       # This file
```

---

## Quick Reference

| Platform | URL Format | Free Tier |
|----------|------------|-----------|
| GitHub Pages | `username.github.io/repo` | ✅ |
| Render | `app-name.onrender.com` | ✅ |
| Railway | `app-name.up.railway.app` | ✅ |
| Vercel | `app-name.vercel.app` | ✅ |

---

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Verify your `GEMINI_API_KEY` is valid
3. Check Render logs in the dashboard

---

**Last Updated:** May 2024
