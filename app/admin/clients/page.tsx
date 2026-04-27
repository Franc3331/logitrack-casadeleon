'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Search, ToggleLeft, ToggleRight, Mail, Phone, MapPin, Trash2 } from 'lucide-react'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('logitrack_token') || ''
}

interface Client {
  _id: string
  businessName: string
  cuit_dni: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  isActive: boolean
}

const inputCls = `
  w-full px-3 py-2.5 rounded-xl text-sm
  bg-slate-800/60 border border-slate-700/60
  text-slate-100 placeholder-slate-600
  focus:outline-none focus:ring-2 focus:ring-blue-500/50
  transition-all duration-200
`

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    cuit_dni: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      setClients(data.clients ?? [])
    } catch { setClients([]) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchClients() }, [])

  const filtered = clients.filter(c =>
    c.businessName.toLowerCase().includes(search.toLowerCase()) ||
    c.cuit_dni.includes(search)
  )

  const handleToggleActive = async (client: Client) => {
    // We can still keep the toggle logic if we want, or just leave it for the "isActive" patch, 
    // but the API DELETE now does a hard delete. Wait, the API DELETE does hard delete. We should patch for toggle.
    await fetch(`/api/clients/${client._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ isActive: !client.isActive }),
    })
    fetchClients()
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente por completo?')) return
    await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    fetchClients()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setShowModal(false)
      setForm({ businessName: '', cuit_dni: '', contactEmail: '', contactPhone: '', address: '' })
      fetchClients()
    } catch { setError('Error de conexión') }
    finally { setIsSaving(false) }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clients.length} clientes registrados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              id="client-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente o CUIT..."
              className="pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-52 transition-all"
            />
          </div>
          <button
            id="new-client-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <div key={client._id} className={`glass rounded-2xl p-5 border transition-all duration-200 ${client.isActive ? 'border-slate-700/40' : 'border-slate-800/30 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 text-sm truncate">{client.businessName}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{client.cuit_dni}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id={`toggle-client-${client._id}`}
                    onClick={() => handleToggleActive(client)}
                    className="text-slate-500 hover:text-blue-400 transition-colors shrink-0"
                    title={client.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {client.isActive
                      ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                      : <ToggleLeft className="w-5 h-5" />
                    }
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                    title="Eliminar Cliente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {client.contactEmail && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                    {client.contactEmail}
                  </p>
                )}
                {client.contactPhone && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                    {client.contactPhone}
                  </p>
                )}
                {client.address && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                    {client.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md glass rounded-2xl p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-5">Nuevo Cliente</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              {([
                { id: 'client-name', label: 'Razón Social', key: 'businessName', placeholder: 'Empresa S.R.L.', required: true },
                { id: 'client-cuit', label: 'CUIT / DNI', key: 'cuit_dni', placeholder: '30-12345678-9', required: true },
                { id: 'client-email', label: 'Email de Contacto', key: 'contactEmail', placeholder: 'contacto@empresa.com', required: false },
                { id: 'client-phone', label: 'Teléfono', key: 'contactPhone', placeholder: '+54 11 1234-5678', required: false },
                { id: 'client-address', label: 'Dirección', key: 'address', placeholder: 'Av. Corrientes 1234, CABA', required: false },
              ] as const).map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                  <input
                    id={f.id}
                    type="text"
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required={f.required}
                    className={inputCls}
                  />
                </div>
              ))}

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200 transition-all">
                  Cancelar
                </button>
                <button
                  id="create-client-submit"
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                >
                  {isSaving ? 'Guardando...' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
