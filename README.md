# AI Exam Prep - Personalized Learning Assistant

## 🎯 Problem Statement
Students waste valuable time studying inefficiently, without focusing on their weak areas or following a structured approach. Traditional one-size-fits-all study methods don't account for individual learning patterns, leading to suboptimal exam performance despite significant time investment.

This is a real-world problem affecting millions of students preparing for board exams, competitive tests, or professional certifications who struggle with ineffective study practices.
## 🚀 Solution Overview
An AI-powered exam preparation workflow that creates personalized study plans based on individual student profiles, performance history, and target exams. The system focuses on weak areas, optimizes study time allocation, and provides adaptive practice materials.

Built for the AI Generalist Hackathon (ends May 5, 2025).

## 💡 How AI Adds Real Leverage

### Personalized Study Planning
Uses Google Gemini AI to analyze syllabi, performance data, and time constraints to create customized study schedules that would take hours for a human to plan manually.

### Adaptive Content Generation
Generates practice questions tailored to each student's weak areas and current proficiency level - something that's impossible without AI for large scale personalization.

### Intelligent Progress Tracking
Provides insights on improvement areas and adjusts recommendations based on performance trends, using AI to identify patterns humans might miss.

### Wellness Optimization
Incorporates cognitive science principles to prevent burnout and maximize retention, powered by AI analysis of study patterns.

## 🎯 Real-World Impact (Practical Usefulness)
- **Saves 5-10 hours per week** by eliminating ineffective study practices
- **Increases exam scores** by focusing efforts where they matter most (weak areas + high-weightage topics)
- **Reduces stress** through structured, manageable study plans
- **Improves retention** through spaced repetition and active recall techniques
- **Prevents burnout** with science-backed wellness recommendations

## 🏗️ Technical Architecture

### Input Processing (n8n Workflow)
- Webhook endpoint to receive student profile data
- Google Gemini integration for AI processing
- Custom JavaScript functions for data transformation
- Google Drive storage for result persistence

### AI Processing Pipeline
1. **Personalized Study Plan Generator**: Creates customized study schedules using Gemini AI
2. **Study Scheduler & Quiz Configurator**: Structures daily learning activities and configures adaptive assessments
3. **Adaptive Question Generator**: Produces practice questions tailored to weak areas
4. **Progress Tracker & Wellness Advisor**: Monitors improvement and provides motivational guidance

### Output Delivery
- Personalized study plan with daily/weekly schedules
- Adaptive practice questions
- Progress tracking metrics
- Wellness and motivation tips
- Automated saving to Google Drive for persistence
## 📁 Project Structure

