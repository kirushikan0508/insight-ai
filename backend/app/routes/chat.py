"""Chat route — AI insights and conversational Q&A."""
from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import ChatRequest, InsightsRequest
from app.services.ai_engine import generate_insights, chat_with_data

router = APIRouter()


@router.post("/ai/insights")
async def get_insights(body: InsightsRequest, request: Request):
    """Generate AI-powered insights for the dataset."""
    session = request.app.state.sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Please upload a dataset first.")

    insights = generate_insights(session["df"], session["column_info"])
    return insights


@router.post("/ai/chat")
async def chat(body: ChatRequest, request: Request):
    """Chat with AI about the dataset."""
    session = request.app.state.sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Please upload a dataset first.")

    response = chat_with_data(session["df"], session["column_info"], body.message)
    return {"response": response}
