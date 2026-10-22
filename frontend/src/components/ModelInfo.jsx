import React, { useState } from 'react'
import { Cpu, Database, CheckCircle, Sliders, Layers, Dog, ExternalLink } from 'lucide-react'

const IMAGEWOOF_CLASSES = [
  'australian_terrier',
  'beagle',
  'border_terrier',
  'dingo',
  'english_foxhound',
  'golden_retriever',
  'old_english_sheepdog',
  'rhodesian_ridgeback',
  'samoyed',
  'shih_tzu'
]

export default function ModelInfo({ t }) {
  const [selectedBreed, setSelectedBreed] = useState('golden_retriever')

  const specsList = [
    { label: t.aboutModel.specsLabels.architecture, val: t.aboutModel.specs.architecture, icon: Layers },
    { label: t.aboutModel.specsLabels.framework, val: t.aboutModel.specs.framework, icon: Cpu },
    { label: t.aboutModel.specsLabels.runtime, val: t.aboutModel.specs.runtime, icon: Sliders },
    { label: t.aboutModel.specsLabels.weights, val: t.aboutModel.specs.weights, icon: Database },
    { label: t.aboutModel.specsLabels.dataset, val: t.aboutModel.specs.dataset, icon: Dog },
    { label: t.aboutModel.specsLabels.inputTensor, val: t.aboutModel.specs.inputTensor, icon: Layers },
    { label: t.aboutModel.specsLabels.transforms, val: t.aboutModel.specs.transforms, icon: Sliders },
    { label: t.aboutModel.specsLabels.accuracy, val: t.aboutModel.specs.accuracy, icon: CheckCircle },
  ]

  const currentBreedDetails = t.breeds[selectedBreed] || {}

  return (
    <section id="about-model" className="py-16 md:py-24 scroll-mt-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.aboutModel.title}
          </h2>
          <p className="mt-3 text-base text-slate-400">
            {t.aboutModel.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
            <a
              href="https://www.kaggle.com/code/onursvm/pawsense-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
            >
              <span>Kaggle Notebook: onursvm/pawsense-ai</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.kaggle.com/datasets/atilsamancioglu/imagewoof200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all shadow-sm"
            >
              <span>ImageWoof Dataset (Kaggle)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Technical Specs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {specsList.map((spec, i) => {
            const Icon = spec.icon
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all backdrop-blur-sm flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{spec.label}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-snug break-words">
                  {spec.val}
                </div>
              </div>
            )
          })}
        </div>

        {/* Supported 10 Breeds Interactive Catalog */}
        <div className="rounded-3xl p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20">
          <div className="rounded-[22px] bg-slate-950/90 p-6 sm:p-10 border border-slate-800">
            
            <div className="max-w-2xl mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {t.aboutModel.breedsTitle}
              </h3>
              <p className="text-sm text-slate-400">
                {t.aboutModel.breedsSubtitle}
              </p>
            </div>

            {/* Breeds Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
              {IMAGEWOOF_CLASSES.map((code) => {
                const info = t.breeds[code] || {}
                const isSelected = selectedBreed === code
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedBreed(code)}
                    className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-cyan-400 shadow-md shadow-indigo-500/30'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate">{info.name || code}</span>
                  </button>
                )
              })}
            </div>

            {/* Selected Breed Detail Spotlight */}
            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
              <div>
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  {t.aboutModel.selectedBreedBadge}
                </span>
                <h4 className="text-2xl font-extrabold text-white mt-1">
                  {currentBreedDetails.name}
                </h4>
                <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {currentBreedDetails.temperament}
                </p>
              </div>

              <div className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">{t.aboutModel.originLabel}:</span>
                <span className="font-bold text-cyan-300 text-sm">
                  {currentBreedDetails.origin}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
