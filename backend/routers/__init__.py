from fastapi import APIRouter

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.resumes import router as resumes_router
from routers.interviews import router as interviews_router
from routers.reports import router as reports_router
from routers.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(resumes_router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(interviews_router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(reports_router, prefix="/reports", tags=["Reports"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
