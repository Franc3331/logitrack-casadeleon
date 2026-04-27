'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, FileText, Clock } from 'lucide-react'
import Timeline from '@/components/Timeline'
import type { IHistoryEntry, ShipmentStatus } from '@/models/Shipment'

const STATUSES: { value: ShipmentStatus; label: string }[] = [
  { value: 'PREPARANDO', label: 'Preparando' },
  { value: 'RECOGIDO', label: 'Recogido' },
  { value: 'EN_TRANSITO', label: 'En Tránsito' },
  { value: 'EN_SUCURSAL', label: 'En Sucursal' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'DEMORADO', label: 'Demorado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('logitrack_token') || ''
}

interface ShipmentDetail {
  _id: string
  trackingNumber: string
  currentStatus: ShipmentStatus
  originAddress: string
  destinationAddress: string
  history: IHistoryEntry[]
  documents: { title: string; fileUrl: string; uploadedAt: Date }[]
  clientId?: { businessName?: string }
}

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Use React.use() to unwrap the promise in a Client Component
  const { id } = use(params)

  const [shipment, setShipment] = useState<ShipmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Status update form
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('PREPARANDO')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  // Document form
  const [docTitle, setDocTitle] = useState('')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [isAddingDoc, setIsAddingDoc] = useState(false)
  const [docError, setDocError] = useState('')

  const fetchShipment = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      setShipment(data.shipment)
      setNewStatus(data.shipment?.currentStatus ?? 'PREPARANDO')
    } catch { /* ignore */ }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchShipment() }, [id])

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateError('')
    try {
      const res = await fetch(`/api/shipments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus, location, notes }),
      })
      const data = await res.json()
      if (!res.ok) { setUpdateError(data.error); return }
      setShipment(data.shipment)
      setLocation('')
      setNotes('')
    } catch { setUpdateError('Error de conexión') }
    finally { setIsUpdating(false) }
  }

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docFile) {
      setDocError('Por favor selecciona un archivo')
      return
    }

    setIsAddingDoc(true)
    setDocError('')
    
    try {
      // 1. Upload file to Cloudinary via our API route
      const formData = new FormData()
      formData.append('file', docFile)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      })
      
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setDocError(uploadData.error || 'Error al subir el archivo')
        setIsAddingDoc(false)
        return
      }

      const fileUrl = uploadData.url

      // 2. Save document record to shipment
      const res = await fetch(`/api/shipments/${id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ title: docTitle, fileUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setDocError(data.error); return }
      
      setShipment(data.shipment)
      setDocTitle('')
      setDocFile(null)
      // Reset file input
      const fileInput = document.getElementById('doc-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch { setDocError('Error de conexión') }
    finally { setIsAddingDoc(false) }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Envío no encontrado.</p>
        <Link href="/admin/dashboard" className="text-blue-400 text-sm mt-3 inline-block">← Volver</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-mono">{shipment.trackingNumber}</h1>
          <p className="text-sm text-slate-500">{shipment.clientId?.businessName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Status update */}
        <div className="space-y-5">
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <Save className="w-4 h-4 text-blue-400" />
              Actualizar Estado
            </h2>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div>
                <label htmlFor="status-select" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Nuevo Estado
                </label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className={inputCls}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location-input" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Ubicación (opcional)
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Centro de Distribución Norte"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="notes-input" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Visita sin respuesta, se reprograma..."
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              </div>

              {updateError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {updateError}
                </p>
              )}

              <button
                id="update-status-btn"
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Guardando...' : 'Guardar Estado'}
              </button>
            </form>
          </section>

          {/* Add document */}
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <Upload className="w-4 h-4 text-blue-400" />
              Agregar Documento
            </h2>
            <form onSubmit={handleAddDocument} className="space-y-3">
              <div>
                <label htmlFor="doc-title" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Título
                </label>
                <input
                  id="doc-title"
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Remito Conformado"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="doc-file" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Archivo (PDF o Imagen)
                </label>
                <input
                  id="doc-file"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  required
                  className={inputCls + ' file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30'}
                />
              </div>

              {docError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {docError}
                </p>
              )}

              <button
                id="add-doc-btn"
                type="submit"
                disabled={isAddingDoc}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 transition-all"
              >
                {isAddingDoc ? 'Agregando...' : 'Agregar Documento'}
              </button>
            </form>

            {/* Documents list */}
            {shipment.documents.length > 0 && (
              <ul className="mt-4 space-y-2">
                {shipment.documents.map((doc, idx) => (
                  <li key={idx}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: Timeline */}
        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-5">
            <Clock className="w-4 h-4 text-blue-400" />
            Historial
          </h2>
          <Timeline history={shipment.history} />
        </section>
      </div>
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
