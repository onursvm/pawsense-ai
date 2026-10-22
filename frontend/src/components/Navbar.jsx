import React, { useState } from 'react'
import { Dog, Globe, Moon, Sun, Menu, X } from 'lucide-react'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export default function Navbar({ lang, setLang, theme, setTheme, t }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleLang = () => {
    setLang(prev => (prev === 'tr' ? 'en' : 'tr'))
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-indigo-500/10 bg-slate-950/70 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Dog className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                {t.brand}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {t.slogan}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-cyan-400 transition-colors">
            {t.nav.home}
          </a>
          <a href="#analyzer" className="hover:text-cyan-400 transition-colors">
            {t.nav.analyzer}
          </a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            {t.nav.howItWorks}
          </a>
          <a href="#about-model" className="hover:text-cyan-400 transition-colors">
            {t.nav.aboutModel}
          </a>
        </nav>

        {/* Actions & Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 hover:border-indigo-500/50 bg-slate-900/60 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Switch Language / Dil Değiştir"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-700/60 hover:border-indigo-500/50 bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-300" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/onursvm/pawsense-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-700/60 hover:border-indigo-500/50 bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded border border-slate-700 text-xs font-bold text-slate-300"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-cyan-400 font-medium"
          >
            {t.nav.home}
          </a>
          <a
            href="#analyzer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-cyan-400 font-medium"
          >
            {t.nav.analyzer}
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-cyan-400 font-medium"
          >
            {t.nav.howItWorks}
          </a>
          <a
            href="#about-model"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-cyan-400 font-medium"
          >
            {t.nav.aboutModel}
          </a>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded border border-slate-800 bg-slate-900 text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
