import React from 'react'
import { Award, Zap, RefreshCw, Info, CheckCircle2, ChevronRight, ShieldAlert, Sparkles } from 'lucide-react'

export default function PredictionResult({ result, previewUrl, t, onReset }) {
  if (!result) return null

  const { prediction, displayName, confidence_percent, top_predictions, inference_time_ms } = result

  // Determine confidence badge color & tier
  let confidenceTier = t.results.highConfidence
  let tierColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (confidence_percent < 50) {
    confidenceTier = t.results.lowConfidence
    tierColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  } else if (confidence_percent < 75) {
    confidenceTier = t.results.mediumConfidence
    tierColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  }

  // Get breed description info
  const breedInfo = t.breeds[prediction] || {
    name: displayName,
    origin: 'Bilinmiyor / Unknown',
    temperament: 'Dost canlısı ve enerjik aile köpeği.',
  }

  return (
    <section id="results" className="py-12 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Glow wrapper */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/40 to-purple-500/30 shadow-2xl shadow-indigo-950/70">
          <div className="rounded-[22px] bg-slate-950/90 backdrop-blur-2xl p-6 sm:p-10 border border-slate-800">
            
            {/* Top header with latency & status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Award className="w-5 h-5 text-cyan-400" />
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                  {t.results.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-cyan-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{inference_time_ms} ms</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {t.results.device}
                </span>
              </div>
            </div>

            {/* Main Result Display Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Photo Preview Column */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-xl group">
                  <img
                    src={previewUrl}
                    alt="Analyzed Dog"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.results.analyzedBadge}</span>
                  </div>
                </div>
              </div>

              {/* Prediction Details Column */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Primary Match */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {t.results.primaryMatch}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tierColor}`}>
                      {confidenceTier}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                      {breedInfo.name || displayName}
                    </span>
                  </h3>
                </div>

                {/* Main Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">{t.results.confidence}</span>
                    <span className="font-extrabold text-cyan-300 font-mono text-base">
                      %{confidence_percent}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 border border-slate-700/80">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      style={{ width: `${Math.min(100, Math.max(5, confidence_percent))}%` }}
                    />
                  </div>
                </div>

                {/* Educational Breed Profile */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t.results.breedInfoTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {breedInfo.temperament}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                    <span className="font-semibold text-slate-300">{t.results.originLabel}:</span>
                    <span className="text-cyan-300">{breedInfo.origin}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Top 3 Breakdown Section */}
            <div className="mt-10 pt-8 border-t border-slate-800/80">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                <span>{t.results.topPredictions}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {top_predictions.map((item, index) => {
                  const itemInfo = t.breeds[item.breed]
                  const titleName = itemInfo?.name || item.displayName
                  const isTop = index === 0

                  return (
                    <div
                      key={item.breed}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isTop
                          ? 'bg-indigo-950/40 border-cyan-500/40 shadow-md shadow-indigo-950/50'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isTop ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                          #{index + 1}
                        </span>
                        <span className="font-mono text-sm font-bold text-white">
                          %{item.confidence_percent}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white truncate mb-2">
                        {titleName}
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isTop
                              ? 'bg-gradient-to-r from-indigo-400 to-cyan-400'
                              : 'bg-slate-600'
                          }`}
                          style={{ width: `${Math.min(100, item.confidence_percent)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Disclaimer & Transparency Box */}
            <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {t.results.disclaimerTitle}
                </span>
                {t.results.disclaimerText}
              </div>
            </div>

            {/* Try Another Button */}
            <div className="mt-8 text-center">
              <button
                onClick={onReset}
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>{t.results.tryAnother}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
