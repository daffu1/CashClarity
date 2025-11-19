# CashClarity

CashClarity is an open-source, full-stack application that helps users gain financial clarity by analyzing PDF bank statements using intelligent parsing and AI-powered summaries. It's built for people who want insights, not spreadsheets.

## Features

- Upload bank or credit card statements in PDF format
- Automatically extract and categorize transactions
- Get GPT-4-powered summaries and recommendations
- Works with common banking formats
- Fully local with secure environment variable support

## Tech Stack

| Layer      | Tools & Frameworks                        |
|------------|-------------------------------------------|
| Frontend   | React (Vite), TypeScript, Tailwind CSS    |
| Backend    | Python, Flask, OpenAI API, pdfplumber     |
| Dev Tools  | Git, GitHub, dotenv, VS Code              |

## Local Development

### Requirements

- Node.js (v18+)
- Python 3.10+
- Git

### Setup Instructions

#### Clone the Repo

```bash
git clone https://github.com/daffu1/CashClarity.git
cd CashClarity

BACKEND

cd backend
python -m venv venv
.\venv\Scripts\activate       # For Windows
pip install -r requirements.txt
flask run

FRONTEND

cd frontend
npm install
npm run dev


Example Workflow:
- Upload your PDF bank statement
- The backend extracts and cleans the data
- GPT-4 analyzes the transactions and generates a summary
- The frontend displays key insights and answers user questions

Project Structure:
CashClarity/
├── backend/       # Flask app for parsing and AI logic
├── frontend/      # React + Tailwind frontend
├── .gitignore
├── README.md

Roadmap
Add data visualizations (charts, graphs)
Multi-PDF support
User login & dashboard
Deploy to Vercel (frontend) and Render (backend)

Author
Dan Afful
Senior Information Science Student
[LinkedIn](https://www.linkedin.com/in/YOUR-USERNAME)