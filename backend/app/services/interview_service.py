"""
Interview service.
"""
from __future__ import annotations

import asyncio
from typing import Any

from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, NotFoundError
from app.models.interview import Interview
from app.repositories.interview_repo import InterviewRepository
from app.repositories.resume_repo import ResumeRepository
from app.schemas.interview import AnswerSubmission, InterviewCreate
from app.services.ai_service import ai_service


class InterviewService:
    def __init__(self, db: Session):
        self.interview_repo = InterviewRepository(db)
        self.resume_repo = ResumeRepository(db)

    async def generate_interview(self, user_id: int, obj_in: InterviewCreate) -> Interview:
        # Get resume text if provided
        resume_text = None
        if obj_in.resume_id:
            resume = self.resume_repo.get_by_id(obj_in.resume_id)
            if resume and resume.user_id == user_id:
                resume_text = resume.parsed_text

        # Create base interview record
        interview = self.interview_repo.create_interview(user_id, obj_in)

        # Generate questions
        questions = await ai_service.generate_questions(
            role=obj_in.role,
            difficulty=obj_in.difficulty,
            interview_type=obj_in.interview_type,
            resume_text=resume_text,
            count=obj_in.num_questions,
        )

        # Save questions to DB
        self.interview_repo.add_questions(interview.id, questions)
        
        # Refresh to get questions loaded
        return self.interview_repo.get_by_id(interview.id)

    def get_interview(self, interview_id: int, user_id: int) -> Interview:
        interview = self.interview_repo.get_by_id(interview_id, user_id)
        if not interview:
            raise NotFoundError("Interview", interview_id)
        return interview

    def get_user_interviews(self, user_id: int, skip: int = 0, limit: int = 100) -> tuple[list[Interview], int]:
        return self.interview_repo.get_all_by_user(user_id, skip, limit)

    def save_progress(self, interview_id: int, user_id: int, answers: dict[int, str]) -> Interview:
        interview = self.get_interview(interview_id, user_id)
        if interview.status == "completed":
            raise BadRequestError("Cannot modify a completed interview.")

        for q_id, answer_text in answers.items():
            question = next((q for q in interview.questions if q.id == q_id), None)
            if question:
                self.interview_repo.update_question_answer(question, answer_text)
                
        return interview

    async def evaluate_interview(self, interview_id: int, user_id: int, submission: AnswerSubmission) -> Interview:
        interview = self.get_interview(interview_id, user_id)
        if interview.status == "completed":
            return interview

        # Save any final answers
        self.save_progress(interview_id, user_id, submission.answers)

        # Evaluate all questions in parallel
        tasks = []
        for question in interview.questions:
            answer = question.user_answer or ""
            task = ai_service.evaluate_answer(
                question=question.question_text,
                answer=answer,
                role=interview.role,
            )
            tasks.append((question, task))

        evaluations = await asyncio.gather(*(t for _, t in tasks))

        total_score = 0.0
        q_and_a_list = []
        
        for (question, _), eval_data in zip(tasks, evaluations):
            self.interview_repo.update_question_evaluation(question, eval_data)
            total_score += eval_data.get("score", 0.0)
            q_and_a_list.append({
                "question": question.question_text,
                "answer": question.user_answer
            })

        # Calculate average score
        final_score = total_score / len(interview.questions) if interview.questions else 0.0
        final_score = round(final_score, 1)

        # Generate overall summary
        summary = await ai_service.generate_interview_summary(
            role=interview.role,
            questions_and_answers=q_and_a_list
        )

        return self.interview_repo.complete_interview(interview, final_score, summary)
