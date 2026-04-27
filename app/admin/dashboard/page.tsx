'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Package, Plus, Filter, RefreshCw, Search, ChevronRight, Trash2 } from 'lucide-react'

type Status = 'ALL' | 'PREPARANDO' | 'RECOGIDO' | 'EN_TRANSITO' | 'EN_SUCURSAL' | 'ENTREGADO' | 'DEMORADO' | 'CANCELADO'

const STATUS_FILTERS: { value: Status; label: string; color: string }[] = [
  { value: 'ALL', label: 'Todos', color: 'text-slate-400' },
  { value: 'PREPARANDO', label: 'Preparando', color: 'text-blue-400' },
  { value: 'RECOGIDO', label: 'Recogido', color: 'text-cyan-400' },
  { value: 'EN_TRANSITO', label: 'En Tránsito', color: 'text-indigo-400' },
  { value: 'EN_SUCURSAL', label: 'En Sucursal', color: 'text-violet-400' },
  { value: 'ENTREGADO', label: 'Entregado', color: 'text-emerald-400' },
  { value: 'DEMORADO', label: 'Demorado', color: 'text-amber-400' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'text-red-400' },
]

const STATUS_BADGE: Record<string, string> = {
  PREPARANDO: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  RECOGIDO: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  EN_TRANSITO: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
  EN_SUCURSAL: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
  ENTREGADO: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  DEMORADO: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  CANCELADO: 'text-red-400 bg-red-500/15 border-red-500/30',
}

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('logitrack_token') || ''
}

interface Shipment {
  _id: string
  trackingNumber: string
  currentStatus: string
  originAddress: string
  destinationAddress: string
  createdAt: string
  clientId?: { businessName?: string }
}

export default function DashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<Status>('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)

  const fetchShipments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (filter !== 'ALL') params.set('status', filter)
      const res = await fetch(`/api/shipments?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      setShipments(data.shipments ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setShipments([])
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchShipments() }, [fetchShipments])

  const handleDeleteShipment = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este envío por completo?')) return
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        fetchShipments()
      } else {
        alert('Error al eliminar el envío')
      }
    } catch {
      alert('Error de conexión')
    }
  }

  const filtered = shipments.filter((s) =>
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    (s.clientId?.businessName ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} envíos en total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="refresh-btn"
            onClick={fetchShipments}
            className="p-2.5 rounded-xl glass border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="new-shipment-btn"
            onClick={() => setShowNewModal(true)}
            className="
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
              text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 active:scale-95
            "
          >
            <Plus className="w-4 h-4" />
            Nuevo Envío
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {STATUS_FILTERS.map(({ value, label, color }) => (
          <button
            key={value}
            id={`filter-${value.toLowerCase()}`}
            onClick={() => setFilter(value)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
              ${filter === value
                ? `${color} bg-slate-800 border-slate-600`
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/60'
              }
            `}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            id="shipment-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar envío o cliente..."
            className="
              pl-8 pr-3 py-1.5 rounded-lg text-xs
              bg-slate-800/60 border border-slate-700/60
              text-slate-200 placeholder-slate-600
              focus:outline-none focus:ring-1 focus:ring-blue-500/50
              transition-all duration-200 w-48
            "
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/80">
              {['N° Seguimiento', 'Cliente', 'Origen → Destino', 'Estado', 'Creado', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-sm">Cargando envíos...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Package className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-600 text-sm">No hay envíos que coincidan.</p>
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-blue-400 text-xs font-semibold">{s.trackingNumber}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs">
                    {s.clientId?.businessName ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <p className="text-xs text-slate-400 truncate">{s.originAddress}</p>
                    <p className="text-xs text-slate-500 truncate">→ {s.destinationAddress}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE[s.currentStatus] ?? ''}`}>
                      {STATUS_FILTERS.find(f => f.value === s.currentStatus)?.label ?? s.currentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {new Date(s.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-5 py-3.5 text-right flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleDeleteShipment(s._id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      title="Eliminar Envío"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      id={`view-shipment-${s._id}`}
                      href={`/admin/shipments/${s._id}`}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      Ver detalle
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Shipment Modal */}
      {showNewModal && (
        <NewShipmentModal
          onClose={() => setShowNewModal(false)}
          onCreated={() => { setShowNewModal(false); fetchShipments() }}
        />
      )}
    </div>
  )
}

// ── New Shipment Modal ──────────────────────────────────────────────────────

function NewShipmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    trackingNumber: `LOG-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    clientId: '',
    originAddress: '',
    destinationAddress: '',
  })
  const [clients, setClients] = useState<{ _id: string; businessName: string }[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/clients?isActive=true', {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => setClients(d.clients ?? []))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al crear envío'); return }
      onCreated()
    } catch { setError('Error de conexión') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md glass rounded-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-100 mb-5">Nuevo Envío</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="N° de Seguimiento" id="new-tracking">
            <input
              id="new-tracking"
              value={form.trackingNumber}
              onChange={(e) => setForm(f => ({ ...f, trackingNumber: e.target.value.toUpperCase() }))}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Cliente" id="new-client">
            <select
              id="new-client"
              value={form.clientId}
              onChange={(e) => setForm(f => ({ ...f, clientId: e.target.value }))}
              required
              className={inputCls}
            >
              <option value="">Seleccioná un cliente</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.businessName}</option>
              ))}
            </select>
          </Field>

          <Field label="Dirección de Origen" id="new-origin">
            <input
              id="new-origin"
              value={form.originAddress}
              onChange={(e) => setForm(f => ({ ...f, originAddress: e.target.value }))}
              required
              placeholder="Av. Corrientes 1234, Buenos Aires"
              className={inputCls}
            />
          </Field>

          <Field label="Dirección de Destino" id="new-dest">
            <input
              id="new-dest"
              value={form.destinationAddress}
              onChange={(e) => setForm(f => ({ ...f, destinationAddress: e.target.value }))}
              required
              placeholder="Rivadavia 5678, Córdoba"
              className={inputCls}
            />
          </Field>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              id="create-shipment-submit"
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {isLoading ? 'Creando...' : 'Crear Envío'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = `
  w-full px-3 py-2.5 rounded-xl text-sm
  bg-slate-800/60 border border-slate-700/60
  text-slate-100 placeholder-slate-600
  focus:outline-none focus:ring-2 focus:ring-blue-500/50
  transition-all duration-200
`
