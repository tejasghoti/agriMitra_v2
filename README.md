# AgriMitra

AgriMitra is a full-stack agricultural decision-support demo. It provides Mandi price tracking, forecasting, weather insights, and a lightweight multilingual advisory chatbot.

**This is a portfolio demo project.** The goal is to demonstrate system design judgment: clean separation of concerns, sensible tradeoffs for a serverless deployment, graceful degradation, and offline tolerance.

## 🚀 Live Demo
[Live Demo Link (Vercel) Placeholder]

## 🏗️ Architecture & Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast builds, perfect Vercel Edge fit. |
| Frontend Hosting | Vercel | Best-in-class static hosting, zero cost. |
| Backend | FastAPI (Python) | Async, typed contracts (Pydantic), auto OpenAPI docs. |
| Backend Hosting | Render (Web Service + Cron) | Avoids Vercel Serverless Function timeouts (10s) and cold starts. Allows persistent Cron jobs for data fetching. |
| Database | Supabase (Postgres) | Free tier, robust relational schema. |

*See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DECISIONS.md](docs/DECISIONS.md) for detailed architectural decisions and diagrams.*

## ✨ Features

- **Graceful Degradation**: If the database or external APIs (Agmarknet) fail, the backend seamlessly falls back to bundled seed data. The UI never breaks.
- **Asynchronous Data Ingestion**: All external data is fetched via a nightly Cron job. The API only performs fast DB reads.
- **Multilingual Advisory Bot**: Simulates a WhatsApp interface with NLP intent parsing for English, Hindi, and Marathi.
- **Scroll-Storytelling**: High-fidelity marketing landing page built with Lenis and Framer Motion.

## 🛠️ Setup Instructions

### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8008
```

### 2. Frontend (React)
```bash
npm install
npm run dev
```

### 3. Environment Variables
Copy `.env.example` to `.env` in the `backend` folder and populate:
- `DATABASE_URL` (Supabase connection string)
- `AGMARKNET_API_KEY` (Optional, for cron job)
- `OPENWEATHER_API_KEY` (Optional, for cron job)
- `CORS_ORIGIN` (Frontend URL)

## 📖 Privacy by Design
The mocked "Farmer Profile" selector in the demo is purely local state. **No real PII (Personally Identifiable Information) is collected or persisted**, addressing the valid concerns farmers have regarding data sharing.
