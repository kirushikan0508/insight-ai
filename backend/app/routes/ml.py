"""ML route — model training and prediction."""
from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import MLTrainRequest
from app.services.ml_engine import train_and_evaluate

router = APIRouter()


@router.post("/ml/train")
async def train_models(body: MLTrainRequest, request: Request):
    """Train ML models on the dataset and return comparison results."""
    session = request.app.state.sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Please upload a dataset first.")

    try:
        result = train_and_evaluate(
            session["df"],
            body.target_column,
            session["column_info"],
        )
        return result
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"ML training failed: {str(e)}")
