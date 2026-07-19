from __future__ import annotations

import os
import uuid
import tempfile
from datetime import datetime
from typing import Any, Sequence

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

# For PDF parsing (PyMuPDF)
try:
    import fitz  # type: ignore
except ImportError:
    fitz = None

# For DOCX parsing
try:
    import docx  # type: ignore
except ImportError:
    docx = None

from app.core.config import settings
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate
from app.repositories.resume_repo import ResumeRepository


class ResumeService:
    def __init__(self, db: Session):
        self.db = db
        self.resume_repo = ResumeRepository(db)

    def _extract_text_from_pdf(self, file_path: str) -> str:
        if not fitz:
            raise HTTPException(status_code=500, detail="PyMuPDF (fitz) is not installed.")
        
        text = ""
        try:
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading PDF file: {str(e)}")
            
        return text.strip()

    def _extract_text_from_docx(self, file_path: str) -> str:
        if not docx:
            raise HTTPException(status_code=500, detail="python-docx is not installed.")
            
        try:
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading DOCX file: {str(e)}")
            
        return text.strip()

    def _extract_structured_data_via_ai(self, text: str) -> dict[str, Any]:
        # Placeholder for AI extraction via Gemini (to be built separately)
        return {
            "skills": [],
            "projects": [],
            "education": [],
            "experience": []
        }

    async def upload_and_parse(self, file: UploadFile, user_id: int) -> Resume:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")

        # Determine file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".pdf", ".docx"]:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
            
        # Create upload directory if it doesn't exist
        upload_dir = getattr(settings, "UPLOAD_DIR", os.path.join(tempfile.gettempdir(), "interviewai_uploads"))
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file securely
        unique_filename = f"{user_id}_{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
            
        # Extract text based on file type
        if ext == ".pdf":
            parsed_text = self._extract_text_from_pdf(file_path)
        else:
            parsed_text = self._extract_text_from_docx(file_path)
            
        if not parsed_text:
            raise HTTPException(status_code=400, detail="Could not extract any text from the file")
            
        # Extract structured data
        structured_data = self._extract_structured_data_via_ai(parsed_text)
        
        resume_create = ResumeCreate(
            user_id=user_id,
            original_filename=file.filename,
            file_path=file_path,
            parsed_text=parsed_text,
            skills=structured_data.get("skills"),
            projects=structured_data.get("projects"),
            education=structured_data.get("education"),
            experience=structured_data.get("experience")
        )
        
        return self.resume_repo.create(resume_create)

    def get_user_resumes(self, user_id: int, skip: int = 0, limit: int = 100) -> Sequence[Resume]:
        return self.resume_repo.get_by_user(user_id=user_id, skip=skip, limit=limit)

    def get_latest_resume(self, user_id: int) -> Resume:
        resume = self.resume_repo.get_latest_by_user(user_id=user_id)
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No resume found for this user")
        return resume
        
    def get_resume(self, resume_id: int, user_id: int) -> Resume:
        resume = self.resume_repo.get_by_id(resume_id=resume_id, user_id=user_id)
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        return resume

    def delete_resume(self, resume_id: int, user_id: int) -> None:
        resume = self.get_resume(resume_id=resume_id, user_id=user_id)
        
        # Remove file from disk
        if os.path.exists(resume.file_path):
            try:
                os.remove(resume.file_path)
            except OSError:
                pass # Log error in real app
                
        self.resume_repo.delete(resume)
