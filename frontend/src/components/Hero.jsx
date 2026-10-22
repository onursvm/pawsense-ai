import React from 'react'
import { Sparkles, ArrowRight, Zap, Target, Cpu, ShieldCheck } from 'lucide-react'

export default function Hero({ t, onStartClick }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-400/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t.hero.badge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {t.hero.titleStart}{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            {t.hero.titleGradient}
          </span>{' '}
          {t.hero.titleEnd}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {t.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{t.hero.ctaUpload}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#about-model"
            className="w-full sm:w-auto px-7 py-4 rounded-xl border border-slate-700/80 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800/60 text-slate-200 font-semibold text-base backdrop-blur-sm transition-all"
          >
            {t.hero.ctaExplore}
          </a>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">~6 ms</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.hero.stats.latency}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">91.67%</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.hero.stats.accuracy}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white">MobileNetV3</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.hero.stats.model}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{t.hero.stats.dataset}</div>
            <div className="text-xs text-slate-400 mt-0.5">ImageWoof</div>
          </div>

        </div>

      </div>
    </section>
  )
}
