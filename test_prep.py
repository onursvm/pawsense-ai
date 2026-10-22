import numpy as np
from PIL import Image
from test_onnx import test

def test_preprocess():
    # Create a 400x300 RGB test image
    img = Image.new("RGB", (400, 300), color=(200, 150, 100))
    
    # Preprocessing
    w, h = img.size
    if w < h:
        new_w = 232
        new_h = int(round(232 * h / w))
    else:
        new_h = 232
        new_w = int(round(232 * w / h))
    
    resized = img.resize((new_w, new_h), resample=Image.Resampling.BILINEAR)
    print(f"Resized dimensions: {resized.size}")
    
    left = int(round((new_w - 224) / 2.0))
    top = int(round((new_h - 224) / 2.0))
    cropped = resized.crop((left, top, left + 224, top + 224))
    print(f"Cropped dimensions: {cropped.size}")
    assert cropped.size == (224, 224)
    
    arr = np.asarray(cropped, dtype=np.float32) / 255.0
    arr = np.transpose(arr, (2, 0, 1))
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)
    arr = (arr - mean) / std
    tensor = np.expand_dims(arr, axis=0)
    print(f"Tensor shape: {tensor.shape}, dtype: {tensor.dtype}")
    assert tensor.shape == (1, 3, 224, 224)
    print("Preprocessing test passed!")

if __name__ == "__main__":
    test_preprocess()
