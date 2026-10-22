from pathlib import Path
from backend.app.model_service import model_service
from backend.app.preprocessing import validate_and_preprocess_image

def test_samples():
    model_service.load_model()
    samples_dir = Path("frontend/public/samples")
    
    for img_path in sorted(samples_dir.glob("*.jpg")):
        with open(img_path, "rb") as f:
            bytes_data = f.read()
        tensor = validate_and_preprocess_image(bytes_data)
        res = model_service.predict(tensor)
        print(f"\n==============================")
        print(f"File: {img_path.name}")
        print(f"Prediction: {res['displayName']} ({res['confidence_percent']}%) in {res['inference_time_ms']}ms")
        print("Top 3:")
        for rank, p in enumerate(res['top_predictions'], 1):
            print(f"  #{rank}: {p['displayName']} - {p['confidence_percent']}%")

if __name__ == "__main__":
    test_samples()
