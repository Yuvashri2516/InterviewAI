"""
AI Service utilizing Google Gemini for question generation and interview evaluation.
"""
from __future__ import annotations

import json
import logging
from typing import Any

import google.generativeai as genai

from app.core.config import settings
from app.utils.question_bank import get_fallback_evaluation, get_fallback_questions

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.is_configured = bool(self.api_key)
        
        if self.is_configured:
            genai.configure(api_key=self.api_key)
            # Use JSON mode for structured responses
            self.generation_config = genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
            self.model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=self.generation_config
            )
        else:
            logger.warning("GEMINI_API_KEY is not set. AI features will use fallback mock data.")

    async def generate_questions(
        self, role: str, difficulty: str, interview_type: str, resume_text: str | None = None, count: int = 5
    ) -> list[str]:
        """Generate interview questions using AI or fallback."""
        if not self.is_configured:
            return get_fallback_questions(role, difficulty, interview_type)[:count]
            
        prompt = f"""
        You are an expert technical interviewer hiring for a {role} position.
        Generate exactly {count} interview questions for a {difficulty} level candidate.
        The interview type is {interview_type}.
        
        {f'Base some of the questions on the candidate\'s resume:\n{resume_text[:2000]}' if resume_text else 'Do not assume any specific prior experience.'}
        
        Return ONLY a JSON array of strings, where each string is a question.
        Example: ["Question 1?", "Question 2?", ...]
        """
        
        try:
            response = self.model.generate_content(prompt)
            questions = json.loads(response.text)
            
            if not isinstance(questions, list) or len(questions) == 0:
                raise ValueError("Invalid response format from Gemini")
                
            return [str(q) for q in questions[:count]]
            
        except Exception as e:
            logger.error(f"Error generating questions via Gemini: {e}")
            return get_fallback_questions(role, difficulty, interview_type)[:count]

    async def evaluate_answer(
        self, question: str, answer: str, role: str
    ) -> dict[str, Any]:
        """Evaluate a single interview answer using AI or fallback."""
        if not self.is_configured or not answer or len(answer.strip()) < 10:
            result = get_fallback_evaluation(answer)
            return {
                "score": result["score"],
                "technical_accuracy": result["technical_accuracy"],
                "clarity_score": result["clarity_score"],
                "communication_score": result["communication_score"],
                "completeness_score": result["completeness_score"],
                "suggestions": result["suggestions"],
                "ideal_answer": result["ideal_answer"],
                "ai_feedback": result["feedback"]
            }
            
        prompt = f"""
        You are evaluating a candidate for a {role} position.
        
        Question asked: "{question}"
        Candidate's answer: "{answer}"
        
        Evaluate this answer and return ONLY a JSON object with exactly these fields:
        - "score": A float from 0.0 to 10.0 representing the overall quality.
        - "technical_accuracy": A float from 0.0 to 10.0.
        - "clarity_score": A float from 0.0 to 10.0.
        - "communication_score": A float from 0.0 to 10.0.
        - "completeness_score": A float from 0.0 to 10.0.
        - "suggestions": A short string with specific, actionable advice on how to improve this answer.
        - "ideal_answer": A string demonstrating a concise, 10/10 answer to this question.
        - "ai_feedback": A short 2-3 sentence paragraph providing overall feedback to the candidate. Address the candidate directly ("You...").
        """
        
        try:
            response = self.model.generate_content(prompt)
            data = json.loads(response.text)
            
            # Ensure required fields exist
            return {
                "score": float(data.get("score", 5.0)),
                "technical_accuracy": float(data.get("technical_accuracy", 5.0)),
                "clarity_score": float(data.get("clarity_score", 5.0)),
                "communication_score": float(data.get("communication_score", 5.0)),
                "completeness_score": float(data.get("completeness_score", 5.0)),
                "suggestions": str(data.get("suggestions", "Add more detail.")),
                "ideal_answer": str(data.get("ideal_answer", "A complete technical explanation.")),
                "ai_feedback": str(data.get("ai_feedback", "Good effort, but could use more detail."))
            }
            
        except Exception as e:
            logger.error(f"Error evaluating answer via Gemini: {e}")
            result = get_fallback_evaluation(answer)
            return {
                "score": result["score"],
                "technical_accuracy": result["technical_accuracy"],
                "clarity_score": result["clarity_score"],
                "communication_score": result["communication_score"],
                "completeness_score": result["completeness_score"],
                "suggestions": result["suggestions"],
                "ideal_answer": result["ideal_answer"],
                "ai_feedback": result["feedback"]
            }

    async def generate_interview_summary(
        self, role: str, questions_and_answers: list[dict[str, str]]
    ) -> str:
        """Generate an overall summary of the interview."""
        if not self.is_configured or not questions_and_answers:
            return "Interview completed. Review the detailed feedback for each question."
            
        # Format the Q&A for the prompt
        qa_text = ""
        for i, qa in enumerate(questions_and_answers):
            qa_text += f"\nQ{i+1}: {qa.get('question')}\nA: {qa.get('answer', 'No answer')}\n"
            
        prompt = f"""
        You are an expert technical interviewer summarizing a mock interview for a {role} position.
        
        Here is the transcript of the interview:
        {qa_text[:5000]} # Limit length if needed
        
        Provide a 3-4 paragraph summary of the candidate's overall performance. 
        Highlight their key strengths and the main areas they need to focus on improving before a real interview.
        Address the candidate directly (e.g., "Overall, you demonstrated...").
        Return ONLY the raw text, no markdown headers or JSON.
        """
        
        try:
            # We don't want JSON for this one, just text
            text_model = genai.GenerativeModel(model_name=self.model_name)
            response = text_model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating summary via Gemini: {e}")
            return "Interview completed. Review the detailed feedback for each question to see how you performed."

# Singleton instance
ai_service = AIService()
