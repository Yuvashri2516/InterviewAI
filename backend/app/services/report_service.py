"""
Report generation service using ReportLab.
"""
from __future__ import annotations

import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.repositories.interview_repo import InterviewRepository


class ReportService:
    def __init__(self, db: Session):
        self.interview_repo = InterviewRepository(db)
        self.styles = getSampleStyleSheet()
        self.styles.add(ParagraphStyle(name='CustomTitle', parent=self.styles['Heading1'], spaceAfter=14))
        self.styles.add(ParagraphStyle(name='CustomHeading', parent=self.styles['Heading2'], spaceBefore=12, spaceAfter=6))
        self.styles.add(ParagraphStyle(name='CustomBody', parent=self.styles['Normal'], spaceAfter=6))

    def generate_interview_pdf(self, interview_id: int, user_id: int) -> bytes:
        """Generate a PDF report for a single interview."""
        interview = self.interview_repo.get_by_id(interview_id, user_id)
        if not interview:
            raise NotFoundError("Interview", interview_id)
            
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        elements = []
        
        # Title
        elements.append(Paragraph(f"Interview Report: {interview.role}", self.styles['CustomTitle']))
        
        # Meta info
        meta_data = [
            ["Date:", interview.created_at.strftime("%B %d, %Y")],
            ["Type:", interview.interview_type],
            ["Difficulty:", interview.difficulty],
            ["Score:", f"{interview.score:.1f}/10" if interview.score else "N/A"]
        ]
        
        t = Table(meta_data, colWidths=[100, 300])
        t.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 20))
        
        # Summary
        if interview.summary:
            elements.append(Paragraph("Overall Summary", self.styles['CustomHeading']))
            elements.append(Paragraph(interview.summary, self.styles['CustomBody']))
            elements.append(Spacer(1, 20))
            
        # Questions
        elements.append(Paragraph("Detailed Feedback", self.styles['CustomHeading']))
        
        for i, q in enumerate(interview.questions, 1):
            # Question
            elements.append(Paragraph(f"<b>Q{i}:</b> {q.question_text}", self.styles['CustomBody']))
            
            # Answer
            ans_text = q.user_answer if q.user_answer else "<i>No answer provided.</i>"
            elements.append(Paragraph(f"<b>Your Answer:</b> {ans_text}", self.styles['CustomBody']))
            
            # Scores
            if q.score is not None:
                score_str = f"Score: {q.score:.1f}/10 | Tech: {q.technical_accuracy:.1f} | Clarity: {q.clarity_score:.1f}"
                elements.append(Paragraph(f"<b>Metrics:</b> {score_str}", self.styles['CustomBody']))
                
            # Feedback
            if q.ai_feedback:
                elements.append(Paragraph(f"<b>Feedback:</b> {q.ai_feedback}", self.styles['CustomBody']))
                
            if q.suggestions:
                elements.append(Paragraph(f"<b>Suggestions:</b> {q.suggestions}", self.styles['CustomBody']))
                
            elements.append(Spacer(1, 12))
            
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

    def generate_progress_pdf(self, user_id: int) -> bytes:
        """Generate a summary PDF report of all interviews."""
        interviews, total = self.interview_repo.get_all_by_user(user_id, limit=50)
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        
        elements = []
        elements.append(Paragraph("Progress Report", self.styles['CustomTitle']))
        elements.append(Paragraph(f"Total Interviews: {total}", self.styles['CustomBody']))
        
        if not interviews:
            elements.append(Paragraph("No interviews found.", self.styles['CustomBody']))
            doc.build(elements)
            return buffer.getvalue()
            
        # Table of history
        data = [["Date", "Role", "Score", "Questions"]]
        for inv in interviews:
            date_str = inv.created_at.strftime("%Y-%m-%d")
            score_str = f"{inv.score:.1f}" if inv.score else "N/A"
            data.append([date_str, inv.role, score_str, str(inv.num_questions)])
            
        t = Table(data, colWidths=[100, 200, 80, 80])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(t)
        
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
