import React, { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, X, Sparkles, AlertTriangle, RefreshCw, Check } from 'lucide-react'

const SAMPLE_DOGS = [
  { id: 'golden_retriever', name: 'Golden Retriever', file: '/samples/golden_retriever.jpg' },
  { id: 'beagle', name: 'Beagle', file: '/samples/beagle.jpg' },
  { id: 'samoyed', name: 'Samoyed', file: '/samples/samoyed.jpg' },
  { id: 'shih_tzu', name: 'Shih Tzu', file: '/samples/shih_tzu.jpg' },
]

export default function UploadSection({
  t,
  onAnalyze,
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  isAnalyzing,
  analysisStep,
  error,
  setError,
  onSelectSample,
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file) => {
    setError(null)

    // Allowed types: jpeg, png, webp
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError(t.upload.errors.invalidType)
      return
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError(t.upload.errors.fileTooLarge)
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <section id="analyzer" className="py-12 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.upload.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            {t.upload.subtitle}
          </p>
        </div>

        {/* Main Upload Box */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-cyan-500/20 shadow-2xl shadow-indigo-950/50">
          <div className="rounded-[22px] bg-slate-950/85 backdrop-blur-xl p-6 sm:p-10 border border-slate-800/80">
            
            {/* Error banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Dropzone or Preview */}
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                    : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/70'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                </div>

                <p className="text-base sm:text-lg font-bold text-white mb-1">
                  {isDragOver ? t.upload.dropPrompt : t.upload.dragPrompt}
                </p>
                <p className="text-indigo-400 hover:text-cyan-300 font-semibold text-sm underline underline-offset-4 mb-3">
                  {t.upload.browseBtn}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {t.upload.maxSize} • JPG, PNG, WebP
                </p>
              </div>
            ) : (
              /* Image Selected Preview */
              <div className="space-y-6">
                <div className="relative mx-auto max-w-md aspect-square rounded-2xl overflow-hidden border border-indigo-500/30 bg-slate-900 shadow-xl group">
                  <img
                    src={previewUrl}
                    alt="Dog preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Scanning line animation during analysis */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
                      {/* Scanning laser line */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan" />
                    </div>
                  )}

                  {/* Clear / Replace floating button */}
                  {!isAnalyzing && (
                    <button
                      onClick={handleClear}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-red-500/80 text-white border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                      title={t.upload.removePhoto}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Analysis Status or Action Button */}
                {isAnalyzing ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-base">
                      <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                      <span>{t.upload.analyzing}</span>
                    </div>
                    <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full animate-shimmer w-full" />
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {t.upload.steps[analysisStep % t.upload.steps.length]}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={onAnalyze}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-cyan-300" />
                      <span>{t.upload.analyzeBtn}</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/60 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
                    >
                      {t.upload.changePhoto}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                  </div>
                )}

              </div>
            )}

            {/* Quick Sample Dogs Selector */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 font-medium text-center mb-4">
                {t.upload.samplePrompt}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_DOGS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 text-left transition-all duration-200 group cursor-pointer disabled:opacity-50"
                  >
                    <img
                      src={sample.file}
                      alt={sample.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700/60 group-hover:border-cyan-400 transition-colors"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {t.breeds[sample.id]?.name || sample.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{t.upload.sampleBadge}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
