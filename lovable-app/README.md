# AI Exam Prep - Lovable App

This is the Lovable-compatible version of the AI Exam Prep application.

## Setup Instructions

### Option 1: Use in Lovable
1. Go to [lovable.dev](https://lovable.dev)
2. Create a new project
3. Copy the contents of the following files into your Lovable project:
   - `index.html` → main page
   - `script.js` → React components
   - `style.css` → styling

### Option 2: Standalone HTML
Simply open `index.html` in any browser - it works standalone with mock data.

## Features

- Student profile input
- Personalized study plan generation
- Adaptive quiz creation
- Progress tracking
- Wellness recommendations
- AI-powered recommendations (when connected to n8n)

## API Integration

To connect to your n8n workflow:

1. Deploy your n8n workflow
2. Copy the webhook URL
3. Update the `WEBHOOK_URL` constant in `script.js`
4. The app will send data to n8n and display real results

## Mock Mode

The app works without n8n - it generates realistic mock data to demonstrate functionality.

## Technology

- React (via CDN)
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Works in any modern browser
