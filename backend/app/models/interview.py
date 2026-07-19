"""
Interview and Question models.
"""
from __future__ import annotations

from sqlalchemy import Column, Float, ForeignKey, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin


class Interview(Base, TimestampMixin):
    """Represents a mock interview session."""
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    
    role = Column(String, index=True, nullable=False)
    difficulty = Column(String, nullable=False)
    interview_type = Column(String, nullable=False)
    
    status = Column(String, default="created", nullable=False) # created, in_progress, completed, evaluated
    num_questions = Column(Integer, default=0, nullable=False)
    
    score = Column(Float, nullable=True)
    summary = Column(String, nullable=True)

    # Relationships
    user = relationship("User", backref="interviews")
    resume = relationship("Resume")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")


class Question(Base, TimestampMixin):
    """Represents a single question within an interview."""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    
    question_text = Column(String, nullable=False)
    user_answer = Column(String, nullable=True)
    
    # Evaluation metrics
    score = Column(Float, nullable=True)
    technical_accuracy = Column(Float, nullable=True)
    clarity_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    completeness_score = Column(Float, nullable=True)
    
    # Detailed feedback
    suggestions = Column(String, nullable=True)
    ideal_answer = Column(String, nullable=True)
    ai_feedback = Column(String, nullable=True)

    # Relationships
    interview = relationship("Interview", back_populates="questions")
