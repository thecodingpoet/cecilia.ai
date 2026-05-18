"""API request/response models."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1)
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    reply: str


class ResetRequest(BaseModel):
    session_id: str = Field(min_length=1)


class HealthResponse(BaseModel):
    status: str = "ok"
