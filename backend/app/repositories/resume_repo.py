from __future__ import annotations

from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.schemas.resume import ResumeCreate


class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, resume_in: ResumeCreate) -> Resume:
        db_obj = Resume(
            user_id=resume_in.user_id,
            original_filename=resume_in.original_filename,
            file_path=resume_in.file_path,
            parsed_text=resume_in.parsed_text,
            skills=resume_in.skills,
            projects=resume_in.projects,
            education=resume_in.education,
            experience=resume_in.experience
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> Sequence[Resume]:
        stmt = select(Resume).where(Resume.user_id == user_id).order_by(Resume.created_at.desc()).offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().all()

    def get_latest_by_user(self, user_id: int) -> Resume | None:
        stmt = select(Resume).where(Resume.user_id == user_id).order_by(Resume.created_at.desc()).limit(1)
        return self.db.execute(stmt).scalar_one_or_none()
        
    def get_by_id(self, resume_id: int, user_id: int | None = None) -> Resume | None:
        stmt = select(Resume).where(Resume.id == resume_id)
        if user_id is not None:
            stmt = stmt.where(Resume.user_id == user_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def delete(self, resume: Resume) -> Resume:
        self.db.delete(resume)
        self.db.commit()
        return resume
