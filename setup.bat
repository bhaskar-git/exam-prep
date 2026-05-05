@echo off
REM AI Exam Prep - Setup and Run Script

echo ============================================
echo AI Exam Prep - Flask Backend Setup
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo [1/3] Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Setting up environment...

REM Check if GEMINI_API_KEY is set
if defined GEMINI_API_KEY (
    echo Gemini API Key found in environment
) else (
    echo WARNING: GEMINI_API_KEY not set in environment
    echo.
    echo To set your API key, either:
    echo 1. Set environment variable: set GEMINI_API_KEY=your_api_key
    echo 2. Edit app.py and replace 'YOUR_GEMINI_API_KEY_HERE'
    echo.
)

echo.
echo [3/3] Starting Flask server...
echo.
echo Server will run at: http://localhost:5000
echo API endpoint: http://localhost:5000/api/generate-plan
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start Flask
python app.py

pause
