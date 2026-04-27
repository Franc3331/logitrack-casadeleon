'use client'

import { CheckCircle2, Clock, MapPin, Package, Truck, AlertTriangle, XCircle, Warehouse } from 'lucide-react'
import type { ShipmentStatus, IHistoryEntry } from '@/models/Shipment'

const STATUS_CONFIG: Record<ShipmentStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  PREPARANDO: {
    label: 'Preparando',
    icon: Package,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20 border-blue-500/40',
  },
  RECOGIDO: {
    label: 'Recogido',
    icon: CheckCircle2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20 border-cyan-500/40',
  },
  EN_TRANSITO: {
    label: 'En Tránsito',
    icon: Truck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20 border-indigo-500/40',
  },
  EN_SUCURSAL: {
    label: 'En Sucursal',
    icon: Warehouse,
    color: 'text-violet-400',
    bg: 'bg-violet-500/20 border-violet-500/40',
  },
  ENTREGADO: {
    label: 'Entregado',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/40',
  },
  DEMORADO: {
    label: 'Demorado',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border-amber-500/40',
  },
  CANCELADO: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20 border-red-500/40',
  },
}

interface TimelineProps {
  history: IHistoryEntry[]
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Timeline({ history }: TimelineProps) {
  // Most recent first
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Clock className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Sin historial de eventos todavía.</p>
      </div>
    )
  }

  return (
    <ol className="relative flex flex-col gap-0" aria-label="Historial de envío">
      {sorted.map((entry, idx) => {
        const cfg = STATUS_CONFIG[entry.status as ShipmentStatus] ?? STATUS_CONFIG.PREPARANDO
        const Icon = cfg.icon
        const isFirst = idx === 0

        return (
          <li key={idx} className="flex gap-4 group animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
            {/* Vertical line + icon */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2
                  transition-all duration-300 group-hover:scale-110
                  ${isFirst ? cfg.bg + ' ' + cfg.color + ' shadow-lg' : 'bg-slate-800/60 border-slate-700 text-slate-500'}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              {/* connector */}
              {idx < sorted.length - 1 && (
                <div className="w-px flex-1 my-1 bg-gradient-to-b from-slate-600 to-transparent min-h-[32px]" />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 flex-1 ${idx < sorted.length - 1 ? '' : 'pb-0'}`}>
              <div
                className={`
                  rounded-xl p-4 border transition-all duration-200
                  ${isFirst ? cfg.bg : 'bg-slate-800/40 border-slate-700/40'}
                  hover:bg-slate-800/70
                `}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <span className={`font-semibold text-sm tracking-wide ${isFirst ? cfg.color : 'text-slate-300'}`}>
                    {cfg.label}
                    {isFirst && (
                      <span className="ml-2 text-xs font-normal bg-slate-900/50 px-2 py-0.5 rounded-full border border-current/30">
                        Actual
                      </span>
                    )}
                  </span>
                  <time className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(entry.timestamp)}
                  </time>
                </div>

                {entry.location && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {entry.location}
                  </p>
                )}

                {entry.notes && (
                  <p className="mt-2 text-xs text-slate-500 italic leading-relaxed border-t border-slate-700/50 pt-2">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
