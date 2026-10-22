import React from 'react'
import { Dog, ExternalLink, Code2 } from 'lucide-react'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

function KaggleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.477 1.407v5.141c0 .188-.093.282-.281.282H5.281c-.187 0-.281-.094-.281-.282V.281c0-.187.094-.281.281-.281h2.696c.188 0 .281.094.281.281v14.475l6.326-6.425c.14-.14.304-.211.492-.211h3.326c.141 0 .235.047.281.141.047.117.024.21-.07.281l-6.841 6.776 7.286 8.243c.094.094.117.211.07.281z" />
    </svg>
  )
}

export default function Footer({ t }) {
  const techStack = [
    'PyTorch',
    'MobileNetV3',
    'ONNX Runtime',
    'FastAPI',
    'Python 3',
    'React 19',
    'Tailwind CSS',
    'Vite'
  ]

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Dog className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg text-white">
                {t.brand}
              </span>
              <p className="text-xs text-slate-400">
                {t.slogan}
              </p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links: GitHub & Kaggle */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/onursvm/pawsense-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:border-indigo-500/50"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.kaggle.com/code/onursvm/pawsense-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:border-cyan-500/50"
              title="Kaggle Notebook"
            >
              <KaggleIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kaggle Notebook</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.kaggle.com/datasets/atilsamancioglu/imagewoof200"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>ImageWoof Dataset</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.kaggle.com/code/onursvm/pawsense-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Kaggle Model Training</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
