# InterviewAI Backend

Production-ready backend for the InterviewAI mock interview platform. Built with Python, FastAPI, SQLAlchemy, and Google Gemini AI.

## Architecture

This backend follows a modular, feature-based architecture with distinct layers:

- **Routers** (`app/api/v1/`) - API endpoints and route definitions
- **Services** (`app/services/`) - Core business logic and orchestration
- **Repositories** (`app/repositories/`) - Database CRUD operations
- **Schemas** (`app/schemas/`) - Pydantic models for validation and serialization
- **Models** (`app/models/`) - SQLAlchemy database models

## Features

- **Authentication**: JWT access & refresh tokens, password hashing, role-based access
- **AI Integration**: Google Gemini integration for dynamic question generation and answer evaluation
- **Resume Parsing**: Upload PDF/DOCX resumes to customize interview questions
- **Analytics**: Dashboard statistics, progress tracking, and skill analysis
- **Reports**: Downloadable PDF reports for individual interviews and overall progress (via ReportLab)

## Local Setup

### Prerequisites
- Python 3.12+
- SQLite (built-in) or PostgreSQL

### 1. Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables
Copy the example environment file and fill in your Gemini API key:
```bash
cp .env.example .env
```
Ensure you set `GEMINI_API_KEY` in `.env`.

### 3. Database Migrations
Initialize the database schema using Alembic:
```bash
alembic upgrade head
```

### 4. Run the Application
Start the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.
Swagger documentation is available at `http://localhost:8000/api/v1/docs`.

## Docker Setup

To run the entire stack (API + PostgreSQL) via Docker:

```bash
docker-compose up --build
```
This uses the `.env` file for configuration.

## Testing

Run the automated test suite using pytest:
```bash
pytest
```
