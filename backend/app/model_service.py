import json
import logging
import time
from pathlib import Path
from typing import List, Tuple, Dict, Any
import numpy as np
import onnxruntime as ort

from .config import settings

logger = logging.getLogger("pawsense.model")

BREED_DISPLAY_NAMES: Dict[str, str] = {
    "australian_terrier": "Australian Terrier",
    "beagle": "Beagle",
    "border_terrier": "Border Terrier",
    "dingo": "Dingo",
    "english_foxhound": "English Foxhound",
    "golden_retriever": "Golden Retriever",
    "old_english_sheepdog": "Old English Sheepdog",
    "rhodesian_ridgeback": "Rhodesian Ridgeback",
    "samoyed": "Samoyed",
    "shih_tzu": "Shih Tzu"
}

class ModelService:
    def __init__(self):
        self.session: ort.InferenceSession | None = None
        self.input_name: str | None = None
        self.output_name: str | None = None
        self.classes: List[str] = []
        self._is_loaded: bool = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded and self.session is not None

    def load_model(self) -> None:
        """Loads ONNX model session and class names into memory once."""
        if self._is_loaded:
            logger.info("ONNX Model already loaded into memory.")
            return

        model_path = Path(settings.MODEL_PATH).resolve()
        class_path = Path(settings.CLASS_NAMES_PATH).resolve()

        if not model_path.exists():
            raise FileNotFoundError(f"ONNX Model file not found at: {model_path}")
        if not class_path.exists():
            raise FileNotFoundError(f"Class names file not found at: {class_path}")

        logger.info(f"Loading class names from {class_path}...")
        with open(class_path, "r", encoding="utf-8") as f:
            self.classes = json.load(f)
        logger.info(f"Loaded {len(self.classes)} classes: {self.classes}")

        logger.info(f"Initializing ONNX Runtime session for {model_path}...")
        sess_options = ort.SessionOptions()
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        sess_options.intra_op_num_threads = 2
        sess_options.inter_op_num_threads = 2

        self.session = ort.InferenceSession(
            str(model_path),
            sess_options=sess_options,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
        self._is_loaded = True
        logger.info(f"Model successfully loaded! Input: {self.input_name}, Output: {self.output_name}")

    def predict(self, input_tensor: np.ndarray) -> Dict[str, Any]:
        """
        Executes ONNX model inference and calculates softmax probabilities.
        Returns top 3 predictions and execution latency.
        """
        if not self.is_loaded or self.session is None:
            raise RuntimeError("Model session is not loaded.")

        start_time = time.perf_counter()

        # Run inference on CPU
        raw_outputs = self.session.run([self.output_name], {self.input_name: input_tensor})
        logits = raw_outputs[0][0]  # shape: (10,)

        # Numerically stable Softmax
        shift_logits = logits - np.max(logits)
        exps = np.exp(shift_logits)
        probabilities = exps / np.sum(exps)

        # Measure latency
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Get top 3 indices
        top_indices = np.argsort(probabilities)[::-1][:3]

        top_predictions = []
        for idx in top_indices:
            breed_code = self.classes[idx]
            display_name = BREED_DISPLAY_NAMES.get(breed_code, breed_code.replace("_", " ").title())
            confidence_val = float(probabilities[idx])
            top_predictions.append({
                "breed": breed_code,
                "displayName": display_name,
                "confidence": round(confidence_val, 4),
                "confidence_percent": round(confidence_val * 100, 1)
            })

        best_item = top_predictions[0]

        return {
            "prediction": best_item["breed"],
            "displayName": best_item["displayName"],
            "confidence": best_item["confidence"],
            "confidence_percent": best_item["confidence_percent"],
            "top_predictions": top_predictions,
            "inference_time_ms": inference_time_ms,
            "disclaimer": "This AI model is trained specifically on the 10 dog breeds of the ImageWoof dataset (MobileNetV3 Large) and is intended for informational/educational demonstration only."
        }

# Global singleton
model_service = ModelService()
