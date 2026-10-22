# 🐾 PawSense AI — AI-Powered Canine Breed Identification Platform

> **"Every Paw Has a Story"**  
> *A production-grade, real-time canine breed classification web application powered by MobileNetV3 Large and optimized with ONNX Runtime.*

[![GitHub Repo](https://img.shields.io/badge/GitHub-onursvm%2Fpawsense--ai-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/onursvm/pawsense-ai)
[![Kaggle Notebook](https://img.shields.io/badge/Kaggle-Notebook-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/code/onursvm/pawsense-ai)
[![Kaggle Dataset](https://img.shields.io/badge/Kaggle-ImageWoof_Dataset-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/atilsamancioglu/imagewoof200)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-CPU-005CED?style=for-the-badge&logo=onnx&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-MobileNetV3-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 📌 Project Overview

**PawSense AI** is a full-stack, deep learning-powered web platform designed to classify dog breeds from uploaded photographs with millisecond latency.

The model was trained on the challenging **ImageWoof** benchmark (a subset of 10 dog breeds from ImageNet) using **PyTorch Transfer Learning**, and subsequently exported to **ONNX Runtime (CPUExecutionProvider)** to enable low-latency, zero-GPU server deployment.

The complete training and export workflow is documented in [`pawsense-ai.ipynb`](./pawsense-ai.ipynb) and published on [Kaggle](https://www.kaggle.com/code/onursvm/pawsense-ai).

### 🔗 Key Links
- **GitHub Repository:** [https://github.com/onursvm/pawsense-ai](https://github.com/onursvm/pawsense-ai)
- **Kaggle Training Notebook:** [https://www.kaggle.com/code/onursvm/pawsense-ai](https://www.kaggle.com/code/onursvm/pawsense-ai)
- **ImageWoof Dataset on Kaggle:** [https://www.kaggle.com/datasets/atilsamancioglu/imagewoof200](https://www.kaggle.com/datasets/atilsamancioglu/imagewoof200)

---

## ✨ Key Features

- ⚡ **Ultra-Fast Inference:** Average ONNX model execution latency of **~5 to 10 ms** on standard CPU.
- 🎯 **High Accuracy:** Achieved **91.67% test accuracy** on the ImageWoof validation set in the final training epoch.
- 🔒 **Privacy-First & Secure:** User photographs are processed strictly in-memory and immediately discarded—never saved to disk or database.
- 🎨 **Modern SaaS UI/UX:** Built with dark midnight navy (`#070913`), subtle glassmorphism, radar laser scanning animations, and mobile-first responsiveness.
- 🌐 **Bilingual (TR / EN):** Instant language switching between English and Turkish with fully localized breed profiles.
- 🌓 **Dark & Light Mode:** Seamless theme toggle with preferences persisted in `localStorage`.
- 🧪 **1-Click Test Samples:** Built-in curated sample images (Golden Retriever, Beagle, Samoyed, Shih Tzu) for immediate one-click testing.

---

## 🧠 AI Model & Preprocessing Pipeline

The neural network utilizes `torchvision.models.mobilenet_v3_large(weights=MobileNet_V3_Large_Weights.DEFAULT)` with a custom classification head (`nn.Linear(1280, 10)`).

### Exact torchvision Preprocessing Pipeline
To guarantee inference accuracy, the FastAPI backend implements the exact transformations from `weight_1.transforms()` using Pillow and NumPy:

1. **EXIF Correction & RGB Conversion:** Normalizes smartphone camera orientation tags and converts color space to standard RGB.
2. **Resize (Shorter Edge = 232 px):** Aspect ratio-preserving bilinear interpolation (`InterpolationMode.BILINEAR`).
3. **CenterCrop (224 × 224 px):** Crops the central 224×224 patch.
4. **ToTensor:** Scales pixel intensity `[0, 255] -> [0.0, 1.0]` as `float32` and reorders dimensions from `(H, W, C)` to `(C, H, W)`.
5. **ImageNet Normalization:**
   - Mean: `[0.485, 0.456, 0.406]`
   - Std: `[0.229, 0.224, 0.225]`
6. **Input Tensor:** Fed to ONNX Runtime as `[1, 3, 224, 224]` float32 tensor.
7. **Softmax:** Raw logits are converted to normalized class probabilities using numerically stable softmax (`shift_logits = logits - max(logits)`).

### Supported 10 ImageWoof Breeds
1. `australian_terrier` (Australian Terrier)
2. `beagle` (Beagle)
3. `border_terrier` (Border Terrier)
4. `dingo` (Dingo)
5. `english_foxhound` (English Foxhound)
6. `golden_retriever` (Golden Retriever)
7. `old_english_sheepdog` (Old English Sheepdog)
8. `rhodesian_ridgeback` (Rhodesian Ridgeback)
9. `samoyed` (Samoyed)
10. `shih_tzu` (Shih Tzu)

---

## 🏗️ Architecture & Directory Structure

```
pawsense-ai/
├── pawsense-ai.ipynb             # Kaggle training, transfer learning & ONNX export notebook
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py             # Environment settings, rate limiting, CORS
│   │   ├── main.py               # FastAPI application, lifespan, routing
│   │   ├── model_service.py      # ONNX Runtime session, Softmax, Singleton
│   │   ├── preprocessing.py      # Resize(232), CenterCrop(224), Normalization
│   │   └── schemas.py            # Pydantic v2 request/response schemas
│   ├── models/
│   │   ├── class_names.json      # Ordered 10 breed classes
│   │   ├── mobilenetv3_imagewoof.onnx        # ONNX computation graph
│   │   └── mobilenetv3_imagewoof.onnx.data   # Model weight tensors
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── samples/              # 1-click curated test images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Branding, navigation, language & theme toggles, GitHub link
│   │   │   ├── Hero.jsx          # Header, CTA, model metrics
│   │   │   ├── UploadSection.jsx # Drag & drop, preview, laser scanning animation
│   │   │   ├── PredictionResult.jsx # Top-3 probability breakdown, breed profile, disclaimer
│   │   │   ├── HowItWorks.jsx    # 3-step workflow cards
│   │   │   ├── ModelInfo.jsx     # Technical specs & 10-breed interactive encyclopedia
│   │   │   └── Footer.jsx        # Footer with GitHub & Kaggle links
│   │   ├── locales/
│   │   │   └── translations.js   # Complete EN and TR translations & breed profiles
│   │   ├── services/
│   │   │   └── api.js            # Axios client, health check & prediction service
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind v4, themes & animations
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # SPA routing configuration
├── Dockerfile                    # Production container configuration
├── render.yaml                   # 1-click Render blueprint specification
├── test_api.py                   # FastAPI integration test suite
├── test_onnx.py                  # ONNX Runtime verification test
├── test_real_samples.py          # Real image verification test
└── README.md
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Python 3.10+ (or 3.11 / 3.12 / 3.14)
- Node.js v18+ and npm

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/onursvm/pawsense-ai.git
cd pawsense-ai

# Create and activate virtual environment
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will run on `http://127.0.0.1:8000`.  
Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

In a separate terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The web application will open on `http://localhost:5173`.

---

## 📡 API Endpoints

### `GET /health`
Returns API health status and verifies that the ONNX model is loaded in memory.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "num_classes": 10,
  "classes": ["australian_terrier", "beagle", "..."],
  "device": "CPUExecutionProvider",
  "version": "1.0.0"
}
```

### `POST /predict`
Accepts an image via `multipart/form-data` and returns the top 3 predicted breeds.
- **Allowed formats:** `image/jpeg`, `image/png`, `image/webp`
- **Max file size:** 10 MB

**Example Response:**
```json
{
  "prediction": "golden_retriever",
  "displayName": "Golden Retriever",
  "confidence": 0.9961,
  "confidence_percent": 99.6,
  "top_predictions": [
    {
      "breed": "golden_retriever",
      "displayName": "Golden Retriever",
      "confidence": 0.9961,
      "confidence_percent": 99.6
    },
    {
      "breed": "rhodesian_ridgeback",
      "displayName": "Rhodesian Ridgeback",
      "confidence": 0.0028,
      "confidence_percent": 0.3
    },
    {
      "breed": "border_terrier",
      "displayName": "Border Terrier",
      "confidence": 0.0011,
      "confidence_percent": 0.1
    }
  ],
  "inference_time_ms": 5.76,
  "disclaimer": "This AI model is trained specifically on the 10 dog breeds of the ImageWoof dataset (MobileNetV3 Large) and is intended for informational/educational demonstration only."
}
```

---

## ☁️ Deployment Strategy

### Frontend: Vercel
The React + Vite application is pre-configured for seamless Vercel deployment:
1. Connect your repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Add the backend URL as an Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
4. The included `frontend/vercel.json` automatically manages client-side SPA routing.

### Backend: Persistent Container (Render / Railway / Docker)
- **Serverless Limitations:** Vercel Python Functions impose a **50 MB** uncompressed package size limit. With `onnxruntime` C++ shared libraries, `numpy`, `pillow`, and model weights (`mobilenetv3_imagewoof.onnx.data` 16.8 MB), the total bundle exceeds **140 MB+**, and cold starts introduce 2–4 second latency.
- **Recommended Solution:** Deploying via the included `Dockerfile` and `render.yaml` to Render, Railway, or Fly.io ensures the ONNX model is loaded once in memory, delivering consistent **5–8 ms response times**.

---

## 🛡️ Security & Performance Highlights

- **Magic Byte & Integrity Verification:** Validates actual image headers with Pillow to block malformed or malicious payloads.
- **Sliding-Window Rate Limiting:** Enforces a 60 requests/minute limit per client IP to prevent abuse and denial-of-service.
- **Configurable CORS:** Origin whitelisting managed via environment variables.
- **Zero Disk Footprint:** Uploaded files are processed strictly in RAM and cleared by the garbage collector immediately after prediction.

---

## 📄 License & Author

This project is developed as an open-source machine learning portfolio showcase under the **MIT License**.

- **Author:** Onur S. ([@onursvm](https://github.com/onursvm))
- **GitHub:** [https://github.com/onursvm/pawsense-ai](https://github.com/onursvm/pawsense-ai)
- **Kaggle:** [https://www.kaggle.com/onursvm](https://www.kaggle.com/onursvm)
