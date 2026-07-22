"""
Main FastAPI application setup.
"""
from __future__ import annotations

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.middleware.request_logging import RequestLoggingMiddleware

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered mock interview platform backend",
    version="1.0.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Parse comma-separated ALLOWED_ORIGINS env var into a list
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)

# Register central exception handlers
register_exception_handlers(app)

# Include v1 routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Ensure upload dir exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Note: In production we wouldn't serve static files directly from FastAPI,
# but it's useful for dev/testing.
# app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": f"{settings.API_V1_STR}/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
