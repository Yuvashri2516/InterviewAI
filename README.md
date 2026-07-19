# InterviewAI 🎯

An AI-powered interview preparation platform. Built with a **React + Vite** frontend and a **FastAPI** Python backend.

---

## Repository Structure

```
InterviewAI/
├── backend/               # FastAPI Python backend
│   ├── app/
│   │   ├── api/           # Route handlers (auth, interviews, users, resumes, analytics, reports)
│   │   ├── core/          # Config, security, exceptions
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Business logic & AI service
│   │   ├── repositories/  # Database access layer
│   │   └── main.py        # FastAPI app entry point
│   ├── alembic/           # Database migrations
│   ├── tests/             # Backend tests
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios API client
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Theme, Toast)
│   │   ├── layouts/       # Route layouts
│   │   ├── pages/         # Page components
│   │   ├── services/      # Frontend service layer
│   │   └── types.ts       # Shared TypeScript types
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── server.ts          # Express dev server
│   └── .env.example
│
├── render.yaml            # Render deployment config
├── .gitignore
└── README.md              ← you are here
```

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # fill in your secrets
alembic upgrade head       # run migrations
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

---

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # set VITE_API_BASE_URL
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SECRET_KEY` | JWT signing secret |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8000/api`) |

---

## Deployment

This repo is configured for **Render** via `render.yaml`.

- **Backend**: Python web service, root `backend/`
- **Database**: PostgreSQL (free tier)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Auth | JWT (python-jose) |
