"""
Interview repository.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.interview import Interview, Question
from app.schemas.interview import InterviewCreate, QuestionCreate


class InterviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_interview(self, user_id: int, obj_in: InterviewCreate) -> Interview:
        db_obj = Interview(
            user_id=user_id,
            resume_id=obj_in.resume_id,
            role=obj_in.role,
            difficulty=obj_in.difficulty,
            interview_type=obj_in.interview_type,
            num_questions=obj_in.num_questions,
            status="in_progress",
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def add_questions(self, interview_id: int, questions: list[str]) -> list[Question]:
        db_questions = [
            Question(interview_id=interview_id, question_text=q) for q in questions
        ]
        self.db.add_all(db_questions)
        self.db.commit()
        for q in db_questions:
            self.db.refresh(q)
        return db_questions

    def get_by_id(self, interview_id: int, user_id: int | None = None) -> Interview | None:
        query = self.db.query(Interview).filter(Interview.id == interview_id)
        if user_id:
            query = query.filter(Interview.user_id == user_id)
        return query.first()

    def get_all_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> tuple[list[Interview], int]:
        query = self.db.query(Interview).filter(Interview.user_id == user_id)
        total = query.count()
        items = query.order_by(Interview.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    def get_question_by_id(self, question_id: int) -> Question | None:
        return self.db.query(Question).filter(Question.id == question_id).first()

    def update_question_answer(self, question: Question, answer: str) -> Question:
        question.user_answer = answer
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        return question

    def update_question_evaluation(self, question: Question, eval_data: dict) -> Question:
        for key, value in eval_data.items():
            setattr(question, key, value)
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        return question

    def complete_interview(self, interview: Interview, score: float, summary: str) -> Interview:
        interview.status = "completed"
        interview.score = score
        interview.summary = summary
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)
        return interview

    def delete(self, interview: Interview) -> None:
        self.db.delete(interview)
        self.db.commit()
