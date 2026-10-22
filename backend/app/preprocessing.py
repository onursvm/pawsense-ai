import io
from typing import Tuple
import numpy as np
from PIL import Image, ImageOps

# ImageNet normalization statistics
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)

TARGET_RESIZE_MIN_EDGE = 232
TARGET_CROP_SIZE = 224

def validate_and_preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Validates and preprocesses an input image exactly matching torchvision's
    MobileNetV3 Large DEFAULT weight transforms:
      - RGB conversion (and EXIF orientation fix)
      - Resize smaller edge to 232 (bilinear interpolation, aspect ratio preserved)
      - CenterCrop to 224x224
      - ToTensor (scale [0, 255] -> [0.0, 1.0], HWC -> CHW)
      - ImageNet Normalize (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
      - Return float32 tensor of shape [1, 3, 224, 224]
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Uploaded file is empty.")

    # 1. Integrity check
    try:
        with Image.open(io.BytesIO(image_bytes)) as test_img:
            test_img.verify()
    except Exception as e:
        raise ValueError(f"Uploaded file is not a valid or readable image: {str(e)}")

    # 2. Open for processing
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            # Fix EXIF orientation if present (common in smartphone photos)
            img = ImageOps.exif_transpose(img)

            # Convert to RGB (handles RGBA, CMYK, P, L, etc.)
            if img.mode != "RGB":
                img = img.convert("RGB")

            # 3. Resize smaller edge to 232 maintaining aspect ratio
            w, h = img.size
            if w <= 0 or h <= 0:
                raise ValueError("Image dimensions must be positive.")

            if w < h:
                new_w = TARGET_RESIZE_MIN_EDGE
                new_h = int(round(TARGET_RESIZE_MIN_EDGE * h / w))
            else:
                new_h = TARGET_RESIZE_MIN_EDGE
                new_w = int(round(TARGET_RESIZE_MIN_EDGE * w / h))

            # Resample with Bilinear interpolation matching torchvision BILINEAR
            resized_img = img.resize((new_w, new_h), resample=Image.Resampling.BILINEAR)

            # 4. Center Crop to 224x224
            crop_left = int(round((new_w - TARGET_CROP_SIZE) / 2.0))
            crop_top = int(round((new_h - TARGET_CROP_SIZE) / 2.0))
            crop_right = crop_left + TARGET_CROP_SIZE
            crop_bottom = crop_top + TARGET_CROP_SIZE

            cropped_img = resized_img.crop((crop_left, crop_top, crop_right, crop_bottom))

            # 5. Convert to float32 NumPy array in range [0.0, 1.0]
            img_array = np.asarray(cropped_img, dtype=np.float32) / 255.0

            # 6. Transpose from (H, W, C) to (C, H, W)
            img_chw = np.transpose(img_array, (2, 0, 1))

            # 7. Normalize with ImageNet mean and std
            normalized = (img_chw - IMAGENET_MEAN) / IMAGENET_STD

            # 8. Add batch dimension -> [1, 3, 224, 224]
            tensor = np.expand_dims(normalized, axis=0).astype(np.float32)

            return tensor

    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Error occurred while processing image: {str(e)}")
