import os
from pathlib import Path
from typing import List

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "PawSense AI API"
    PROJECT_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Model configuration
    MODEL_PATH: Path = Path(os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "mobilenetv3_imagewoof.onnx")))
    CLASS_NAMES_PATH: Path = Path(os.getenv("CLASS_NAMES_PATH", str(BASE_DIR / "models" / "class_names.json")))
    
    # Security & Upload constraints
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]
    
    # CORS
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,*"
    ).split(",")
    
    # Rate Limiting: max requests per minute per IP
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))

settings = Settings()
