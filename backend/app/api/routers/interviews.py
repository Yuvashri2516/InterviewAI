from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Dict
import io
import random
import json
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

try:
    import fitz
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.interview import Interview, Question
from app.schemas.interview import InterviewCreate, InterviewResponse

router = APIRouter()

# ── Gemini Integrations ────────────────────────────────────────────────────────

def get_feedback_and_score(question_text: str, answer: str | None) -> tuple[float, str]:
    if not answer or len(answer.strip()) < 10:
        return 0.0, "No answer or very short answer provided. Practice is key — try answering every question, even if you're unsure."

    prompt = f"""
You are an expert technical interviewer evaluating a candidate's answer.
Question: {question_text}
Candidate's Answer: {answer}

Evaluate the answer. Provide:
1. A score from 0.0 to 10.0 (1 decimal place).
2. Actionable, constructive feedback for the candidate (max 3 sentences).

Return the result as a JSON object with exactly these keys: "score" (number) and "feedback" (string). Do not return any other text or markdown formatting.
"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text.replace("```json", "", 1).rstrip("```")
        elif text.startswith("```"):
            text = text.replace("```", "", 1).rstrip("```")
        result = json.loads(text)
        return float(result.get("score", 0.0)), result.get("feedback", "No feedback provided.")
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return 5.0, "Could not generate feedback at this time."


def get_questions_for_role(role: str, difficulty: str, interview_type: str) -> list[str]:
    counts = {"Easy": 5, "Medium": 8, "Hard": 10}
    count = counts.get(difficulty, 8)

    prompt = f"""
You are an expert technical interviewer. Generate exactly {count} interview questions for a candidate applying for the role of '{role}'.
The difficulty level should be '{difficulty}'.
The interview type is '{interview_type}' (if it is HR / Behavioral, focus on behavioral; if Mixed, do a mix; if Technical, focus on technical).

Return the questions as a JSON array of strings. Do not return any other text or markdown formatting.
"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text.replace("```json", "", 1).rstrip("```")
        elif text.startswith("```"):
            text = text.replace("```", "", 1).rstrip("```")
        questions = json.loads(text)
        if isinstance(questions, list) and len(questions) > 0:
            return questions[:count]
    except Exception as e:
        print(f"Error calling Gemini: {e}")

    # Fallback questions
    return [
        f"Can you explain your experience with {role}?",
        "What is the most challenging project you've worked on?",
        "How do you handle disagreements with team members?",
        "Where do you see yourself in 5 years?",
        "Why should we hire you?"
    ][:count]


# ── Routes ────────────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not HAS_FITZ:
        return ""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "".join(page.get_text() for page in doc)


def extract_text_from_docx(file_bytes: bytes) -> str:
    if not HAS_DOCX:
        return ""
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs)


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    content = await file.read()
    text = ""
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(content)
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX formats are supported.")

    return {
        "message": "Resume uploaded and processed successfully.",
        "extracted_chars": len(text),
        "preview": text[:200] if text else "Text extraction library not available.",
    }


@router.post("/generate", response_model=InterviewResponse)
def generate_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = Interview(
        user_id=current_user.id,
        role=data.role,
        difficulty=data.difficulty,
        interview_type=data.interview_type,
    )
    db.add(interview)
    db.flush()

    questions = get_questions_for_role(data.role, data.difficulty, data.interview_type)
    for q_text in questions:
        db.add(Question(interview_id=interview.id, question_text=q_text))

    db.commit()
    db.refresh(interview)
    return interview


@router.get("/", response_model=List[InterviewResponse])
def get_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).order_by(Interview.created_at.desc()).all()


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id,
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")
    return interview


@router.post("/{interview_id}/evaluate", response_model=InterviewResponse)
def evaluate_interview(
    interview_id: int,
    answers: Dict[str, str],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id,
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")

    total_score = 0.0
    count = 0

    for q in interview.questions:
        ans = answers.get(str(q.id), "").strip()
        q.user_answer = ans if ans else None
        score, feedback = get_feedback_and_score(q.question_text, ans if ans else None)
        q.score = score
        q.ai_feedback = feedback
        total_score += score
        count += 1

    interview.score = round(total_score / count, 2) if count > 0 else 0.0
    db.commit()
    db.refresh(interview)
    return interview
