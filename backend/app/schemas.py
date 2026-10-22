from pydantic import BaseModel, Field
from typing import List

class PredictionItem(BaseModel):
    breed: str = Field(..., description="Raw class name from model training")
    displayName: str = Field(..., description="Formatted display name for UI")
    confidence: float = Field(..., description="Confidence probability between 0 and 1")
    confidence_percent: float = Field(..., description="Confidence as rounded percentage (0-100)")

class PredictionResponse(BaseModel):
    prediction: str = Field(..., description="Top predicted breed identifier")
    displayName: str = Field(..., description="Top predicted breed display name")
    confidence: float = Field(..., description="Top prediction confidence (0-1)")
    confidence_percent: float = Field(..., description="Top prediction percentage")
    top_predictions: List[PredictionItem] = Field(..., description="Top 3 predictions ranked by probability")
    inference_time_ms: float = Field(..., description="Inference execution time in milliseconds")
    disclaimer: str = Field(
        default="This AI model is trained specifically on the 10 dog breeds of the ImageWoof dataset and is intended for informational/educational demonstration only.",
        description="Disclaimer note explaining model scope"
    )

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    num_classes: int
    classes: List[str]
    device: str
    version: str

class ErrorResponse(BaseModel):
    detail: str
    error_code: str
