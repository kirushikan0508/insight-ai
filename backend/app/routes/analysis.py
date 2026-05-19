"""Analysis route — EDA and chart generation."""
from fastapi import APIRouter, HTTPException, Request

from app.services.eda import generate_eda

router = APIRouter()


@router.get("/analysis/{session_id}")
async def get_analysis(session_id: str, request: Request):
    """Run EDA and return charts + statistics."""
    session = request.app.state.sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found. Please upload a dataset first.")

    df = session["df"]
    column_info = session["column_info"]

    result = generate_eda(df, column_info)

    return {
        "charts": result["charts"],
        "insights": [],  # Populated separately via AI endpoint
        "statistics": result["statistics"],
    }
