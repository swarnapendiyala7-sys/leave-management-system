from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.leave_types import router as leave_types_router
from app.api.leaves import router as leaves_router
from app.core.config import settings


app = FastAPI(
    title="Leave Management System API",
    version="1.0.0",
    description="Backend API for managing employee leaves.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(leave_types_router)
app.include_router(leaves_router)


@app.get("/")
def root():
    return {
        "message": "Leave Management System API is running",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }