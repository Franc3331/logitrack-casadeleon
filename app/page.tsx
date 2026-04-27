'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package, ArrowRight, Truck, FileText, BarChart3 } from 'lucide-react'

const FEATURES = [
  {
    icon: Search,
    title: 'Seguimiento en Tiempo Real',
    description: 'Ingresá tu número de seguimiento y consultá el estado actualizado de tu envío en segundos.',
  },
  {
    icon: FileText,
    title: 'Documentación Digital',
    description: 'Descargá remitos conformados y facturas directamente desde el portal, sin papeles.',
  },
  {
    icon: BarChart3,
    title: 'Línea de Tiempo Completa',
    description: 'Revisá cada movimiento de tu paquete con fecha, hora y ubicación exacta.',
  },
]

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = trackingNumber.trim().toUpperCase()
    if (!clean) return
    setIsLoading(true)
    router.push(`/track/${clean}`)
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-60 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between glass border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100">LogiTrack</span>
        </div>
        <a
          href="/admin/login"
          className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5"
        >
          Acceso Administrativo
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs text-blue-400 font-medium mb-6 border border-blue-500/20">
            <Package className="w-3.5 h-3.5" />
            Portal de Seguimiento Logístico
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-slate-100 via-blue-100 to-violet-200 bg-clip-text text-transparent leading-tight">
            ¿Dónde está<br />tu envío?
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Ingresá tu número de seguimiento para ver el estado actualizado, la línea de tiempo y descargar tus documentos.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-lg mx-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
              <input
                id="tracking-input"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="LOG-2026-0001"
                autoComplete="off"
                spellCheck={false}
                className="
                  w-full pl-11 pr-4 py-3.5 rounded-xl
                  bg-slate-800/80 border border-slate-700/60
                  text-slate-100 placeholder-slate-500 text-sm font-mono
                  focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60
                  transition-all duration-200
                "
              />
            </div>
            <button
              id="tracking-search-btn"
              type="submit"
              disabled={!trackingNumber.trim() || isLoading}
              className="
                flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                text-white shadow-lg shadow-blue-500/25
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 hover:scale-105 active:scale-95
              "
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Rastrear <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full animate-slide-up px-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass rounded-2xl p-5 text-left hover:border-slate-600/60 transition-all duration-300 group">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:bg-blue-500/25 transition-colors">
                <Icon className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-xs text-slate-600 border-t border-slate-800/40">
        © {new Date().getFullYear()} LogiTrack · Todos los derechos reservados.
      </footer>
    </main>
  )
}
