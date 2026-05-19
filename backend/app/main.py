"""InsightAI — FastAPI Backend Entry Point"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes import upload, analysis, ml, forecast, chat

app = FastAPI(
    title="InsightAI API",
    description="AI-Powered Dataset Insight & Prediction Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store
app.state.sessions = {}

app.include_router(upload.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(ml.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "InsightAI"}
