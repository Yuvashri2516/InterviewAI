"""
Reports router.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from models.user import User
from app.services.report_service import ReportService

router = APIRouter()


@router.get("/interview/{interview_id}/pdf")
def download_interview_report(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Response:
    """Download a PDF report for a specific interview."""
    service = ReportService(db)
    pdf_bytes = service.generate_interview_pdf(interview_id, current_user.id)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={
            "Content-Disposition": f"attachment; filename=interview_report_{interview_id}.pdf"
        }
    )


@router.get("/progress")
def download_progress_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Response:
    """Download a PDF progress report."""
    service = ReportService(db)
    pdf_bytes = service.generate_progress_pdf(current_user.id)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={
            "Content-Disposition": "attachment; filename=progress_report.pdf"
        }
    )
