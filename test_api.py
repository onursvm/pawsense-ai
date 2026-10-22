import io
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app

def test_api():
    print("Testing FastAPI app lifespan and endpoints with TestClient...")
    with TestClient(app) as client:
        # 1. Test root (should serve HTML since frontend/dist exists)
        r = client.get("/")
        assert r.status_code == 200
        assert "html" in r.headers.get("content-type", "")
        print("GET / successfully serves Frontend index.html!")

        # 2. Test health
        r = client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data["model_loaded"] is True
        assert data["num_classes"] == 10
        print("GET /health -> healthy, 10 classes")

        # 3. Test classes
        r = client.get("/classes")
        assert r.status_code == 200
        assert len(r.json()["classes"]) == 10
        print("GET /classes -> 10 classes OK")

        # 4. Test predict with valid image
        img = Image.new("RGB", (300, 300), color=(220, 180, 120))
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format="JPEG")
        img_bytes = img_byte_arr.getvalue()

        r = client.post(
            "/predict",
            files={"file": ("test_dog.jpg", img_bytes, "image/jpeg")}
        )
        assert r.status_code == 200
        res = r.json()
        assert "prediction" in res
        assert "top_predictions" in res
        assert len(res["top_predictions"]) == 3
        print(f"Prediction: {res['displayName']} ({res['confidence_percent']}%) in {res['inference_time_ms']}ms")

    print("ALL ALL-IN-ONE MONOLITHIC API TESTS PASSED!")

if __name__ == "__main__":
    test_api()
