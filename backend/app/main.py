import time
import logging
from collections import defaultdict
from contextlib import asynccontextmanager
from typing import Dict, List

from fastapi import FastAPI, File, UploadFile, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .schemas import PredictionResponse, HealthResponse, ErrorResponse
from .preprocessing import validate_and_preprocess_image
from .model_service import model_service, BREED_DISPLAY_NAMES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pawsense.api")

# In-memory IP rate limiter: IP -> list of timestamps
ip_request_history: Dict[str, List[float]] = defaultdict(list)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ONNX model and classes once
    logger.info("Initializing PawSense AI Backend...")
    try:
        model_service.load_model()
        logger.info("Model loaded and ready for predictions.")
    except Exception as e:
        logger.error(f"Failed to load ONNX model on startup: {e}")
        # Let the app start so /health can report failure
    yield
    # Shutdown
    logger.info("Shutting down PawSense AI Backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="High-performance Dog Breed Identification API powered by MobileNetV3 Large (ImageWoof) and ONNX Runtime.",
    lifespan=lifespan
)

# CORS Middleware
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window = 60.0  # 1 minute window

    # Clean old timestamps
    history = [t for t in ip_request_history[client_ip] if now - t < window]
    
    if len(history) >= settings.RATE_LIMIT_PER_MINUTE:
        logger.warning(f"Rate limit exceeded for client IP: {client_ip}")
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Too many requests. Please wait a moment before trying again."}
        )

    history.append(now)
    ip_request_history[client_ip] = history

    response = await call_next(request)
    return response

@app.get("/", tags=["General"])
async def root():
    return {
        "service": "PawSense AI API",
        "status": "online",
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy" if model_service.is_loaded else "degraded",
        model_loaded=model_service.is_loaded,
        num_classes=len(model_service.classes),
        classes=model_service.classes,
        device="CPUExecutionProvider",
        version=settings.PROJECT_VERSION
    )

@app.get("/classes", tags=["Model"])
async def list_classes():
    """Returns the list of 10 supported ImageWoof dog breeds with display names."""
    breeds = []
    for code in model_service.classes:
        breeds.append({
            "code": code,
            "name": BREED_DISPLAY_NAMES.get(code, code.replace("_", " ").title())
        })
    return {
        "dataset": "ImageWoof (10 Dog Breeds)",
        "total_classes": len(breeds),
        "classes": breeds
    }

@app.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid image file or format"},
        413: {"model": ErrorResponse, "description": "File size exceeds limit"},
        415: {"model": ErrorResponse, "description": "Unsupported media type"},
        500: {"model": ErrorResponse, "description": "Model inference error"}
    },
    tags=["Prediction"]
)
async def predict_dog_breed(file: UploadFile = File(...)):
    """
    Accepts an uploaded dog image (JPEG, PNG, WebP) and predicts the dog breed
    among the 10 ImageWoof classes using ONNX Runtime.
    """
    # 1. Check if model is loaded
    if not model_service.is_loaded:
        logger.error("Predict called but ONNX model is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI inference engine is currently initializing or unavailable."
        )

    # 2. Validate Content-Type
    content_type = file.content_type or ""
    if content_type.lower() not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file format '{content_type}'. Please upload JPEG, PNG, or WebP."
        )

    # 3. Read image bytes and validate file size
    try:
        image_bytes = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read uploaded file content."
        )

    if len(image_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {settings.MAX_FILE_SIZE_MB}MB."
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # 4. Preprocess image
    try:
        tensor = validate_and_preprocess_image(image_bytes)
    except ValueError as ve:
        logger.warning(f"Image preprocessing validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error in preprocessing: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while preparing image for analysis."
        )

    # 5. Run ONNX Inference
    try:
        result = model_service.predict(tensor)
        logger.info(
            f"Prediction successful: {result['prediction']} "
            f"({result['confidence_percent']}%) in {result['inference_time_ms']}ms"
        )
        return PredictionResponse(**result)
    except Exception as e:
        logger.error(f"Inference execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI model inference failed to produce an output."
        )
