#!/bin/bash

# AI Exam Prep Workflow Demo Script
# This script demonstrates how to use the n8n workflow with sample data

echo "🚀 AI Exam Prep - Personalized Learning Assistant Demo"
echo "====================================================="
echo

# Step 1: Display sample input data
echo "📋 Sample Input Data:"
echo "--------------------"
cat sample-data.json
echo
echo

# Step 2: Instructions for setting up the workflow
echo "⚙️  Setup Instructions:"
echo "---------------------"
echo "1. Import exam-prep-workflow.json into your n8n instance"
echo "2. Configure Google Gemini and Google Drive credentials"
echo "3. Activate the workflow"
echo "4. Copy the webhook URL from n8n"
echo
echo "🌐 Usage Example:"
echo "----------------"
echo "curl -X POST https://your-n8n-instance.com/webhook/your-webhook-path \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d @sample-data.json"
echo
echo "📝 The workflow will:"
echo "--------------------"
echo "1. Generate a personalized study plan based on your inputs"
echo "2. Create adaptive quiz configurations"
echo "3. Provide progress tracking and wellness recommendations"
echo "4. Save results to Google Drive"
echo "5. Return the complete study plan as JSON response"
echo

# Step 3: Expected output explanation
echo "📊 Expected Output:"
echo "------------------"
echo "The workflow generates:"
echo "- Personalized study schedule"
echo "- Adaptive quiz configurations"
echo "- Progress tracking metrics"
echo "- Wellness and motivation tips"
echo "- All results saved to Google Drive"
echo

echo "🎉 Demo ready! Follow the setup instructions to run the workflow with your own data."