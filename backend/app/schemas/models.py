"""Pydantic models for request/response validation."""
from pydantic import BaseModel
from typing import Optional


class MLTrainRequest(BaseModel):
    session_id: str
    target_column: str


class ForecastRequest(BaseModel):
    session_id: str
    date_column: str
    value_column: str
    period: int = 30


class ChatRequest(BaseModel):
    session_id: str
    message: str


class InsightsRequest(BaseModel):
    session_id: str
