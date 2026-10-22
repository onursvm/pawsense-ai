import React from 'react'
import { UploadCloud, Cpu, PieChart } from 'lucide-react'

export default function HowItWorks({ t }) {
  const steps = [
    {
      icon: UploadCloud,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-indigo-400',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
      iconColor: 'text-purple-400',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      icon: PieChart,
      color: 'from-cyan-400 to-teal-500',
      iconColor: 'text-cyan-400',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 scroll-mt-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 group backdrop-blur-sm flex flex-col items-center text-center"
              >
                {/* Step number badge */}
                <span className="absolute top-4 right-5 text-4xl font-black text-slate-800 group-hover:text-indigo-900/60 transition-colors pointer-events-none">
                  0{idx + 1}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
