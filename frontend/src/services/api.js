import axios from 'axios'

// Prefer explicit environment variable, fallback to localhost in dev or /api in prod
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

/**
 * Checks API status and whether the ONNX model is loaded
 */
export async function checkHealth() {
  const response = await apiClient.get('/health')
  return response.data
}

/**
 * Fetches the supported ImageWoof classes
 */
export async function fetchClasses() {
  const response = await apiClient.get('/classes')
  return response.data
}

/**
 * Sends image file to FastAPI /predict endpoint via multipart/form-data
 * @param {File|Blob} file 
 */
export async function predictDogBreed(file) {
  const formData = new FormData()
  // Ensure a filename is provided if it's a blob
  const filename = file.name || 'image.jpg'
  formData.append('file', file, filename)

  const response = await apiClient.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Loads a local sample image URL as a real File object for prediction
 * @param {string} samplePath 
 * @param {string} filename 
 */
export async function loadSampleAsFile(samplePath, filename = 'sample.jpg') {
  const res = await fetch(samplePath)
  if (!res.ok) {
    throw new Error(`Failed to load sample image: ${samplePath}`)
  }
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}
