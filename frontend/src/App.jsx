import React, { useState, useEffect } from 'react'
import { translations } from './locales/translations'
import { checkHealth, predictDogBreed, loadSampleAsFile } from './services/api'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import UploadSection from './components/UploadSection'
import PredictionResult from './components/PredictionResult'
import HowItWorks from './components/HowItWorks'
import ModelInfo from './components/ModelInfo'
import Footer from './components/Footer'

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('pawsense_lang') || 'tr')
  const [theme, setTheme] = useState(() => localStorage.getItem('pawsense_theme') || 'dark')
  const [apiStatus, setApiStatus] = useState('checking')
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [predictionResult, setPredictionResult] = useState(null)
  const [error, setError] = useState(null)

  const t = translations[lang] || translations.tr

  // Persist language
  useEffect(() => {
    localStorage.setItem('pawsense_lang', lang)
  }, [lang])

  // Persist theme and update HTML root
  useEffect(() => {
    localStorage.setItem('pawsense_theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  // Check backend health on mount and periodically
  useEffect(() => {
    let isMounted = true
    const verifyHealth = async () => {
      try {
        const health = await checkHealth()
        if (isMounted) {
          setApiStatus(health.model_loaded ? 'online' : 'offline')
        }
      } catch (err) {
        if (isMounted) {
          setApiStatus('offline')
        }
      }
    }

    verifyHealth()
    const timer = setInterval(verifyHealth, 25000)
    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [])

  // Handle sample dog click
  const handleSelectSample = async (sample) => {
    try {
      setError(null)
      setPredictionResult(null)
      setPreviewUrl(sample.file)
      const file = await loadSampleAsFile(sample.file, `${sample.id}.jpg`)
      setSelectedFile(file)
    } catch (err) {
      console.error('Error loading sample:', err)
      setError('Örnek görsel yüklenemedi / Could not load sample image.')
    }
  }

  // Handle Predict
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError(t.upload.errors.emptyFile)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisStep(0)
    setPredictionResult(null)

    // Progress stepper interval
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => prev + 1)
    }, 400)

    try {
      const data = await predictDogBreed(selectedFile)
      setPredictionResult(data)

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results')
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    } catch (err) {
      console.error('Prediction error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError(t.upload.errors.connectionError)
      }
    } finally {
      clearInterval(stepInterval)
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setPredictionResult(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    const analyzerEl = document.getElementById('analyzer')
    if (analyzerEl) {
      analyzerEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStartClick = () => {
    const analyzerEl = document.getElementById('analyzer')
    if (analyzerEl) {
      analyzerEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#070913] text-slate-100'
    } selection:bg-cyan-500 selection:text-slate-950`}>
      
      {/* Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        t={t}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero t={t} onStartClick={handleStartClick} />

        {/* Upload & Analyzer Section */}
        <UploadSection
          t={t}
          onAnalyze={handleAnalyze}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          isAnalyzing={isAnalyzing}
          analysisStep={analysisStep}
          error={error}
          setError={setError}
          onSelectSample={handleSelectSample}
        />

        {/* Prediction Results Section (Conditional) */}
        {predictionResult && (
          <PredictionResult
            result={predictionResult}
            previewUrl={previewUrl}
            t={t}
            onReset={handleReset}
          />
        )}

        {/* How It Works Section */}
        <HowItWorks t={t} />

        {/* About Model & 10 Breeds Section */}
        <ModelInfo t={t} />

      </main>

      {/* Footer */}
      <Footer t={t} />

    </div>
  )
}
