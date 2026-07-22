from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.resume import ResumeResponse, ResumeListResponse
from app.services.resume_service import ResumeService
from app.api.deps import get_current_user, get_db

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Upload and parse a new resume.
    """
    resume_service = ResumeService(db)
    return await resume_service.upload_and_parse(file, user_id=current_user.id)


@router.get("/", response_model=ResumeListResponse)
def get_user_resumes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    List all resumes for the current user.
    """
    resume_service = ResumeService(db)
    resumes = resume_service.get_user_resumes(user_id=current_user.id, skip=skip, limit=limit)
    return ResumeListResponse(items=list(resumes), total=len(resumes))


@router.get("/latest", response_model=ResumeResponse)
def get_latest_resume(
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Get the most recently uploaded resume for the current user.
    """
    resume_service = ResumeService(db)
    return resume_service.get_latest_resume(user_id=current_user.id)


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Get a specific resume by ID.
    """
    resume_service = ResumeService(db)
    return resume_service.get_resume(resume_id=resume_id, user_id=current_user.id)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> None:
    """
    Delete a specific resume by ID.
    """
    resume_service = ResumeService(db)
    resume_service.delete_resume(resume_id=resume_id, user_id=current_user.id)
