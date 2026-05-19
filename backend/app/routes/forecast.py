"""Forecast route — time series forecasting."""
from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import ForecastRequest
from app.services.forecast_engine import generate_forecast

router = APIRouter()


@router.post("/forecast")
async def forecast(body: ForecastRequest, request: Request):
    """Generate time series forecast."""
    session = request.app.state.sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Please upload a dataset first.")

    try:
        result = generate_forecast(
            session["df"],
            body.date_column,
            body.value_column,
            body.period,
        )
        return result
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Forecasting failed: {str(e)}")
