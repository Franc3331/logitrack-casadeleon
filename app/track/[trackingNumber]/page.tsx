import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, Truck, Package, FileText } from 'lucide-react'
import { connectDB } from '@/lib/db'
import Shipment from '@/models/Shipment'
import type { IHistoryEntry, IShipmentDocument } from '@/models/Shipment'
import Timeline from '@/components/Timeline'

interface LeanShipment {
  _id: unknown
  trackingNumber: string
  currentStatus: string
  originAddress: string
  destinationAddress: string
  createdAt: Date
  history: IHistoryEntry[]
  documents: IShipmentDocument[]
  clientId: unknown
}

interface Props {
  params: Promise<{ trackingNumber: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackingNumber } = await params
  return {
    title: `Seguimiento ${trackingNumber.toUpperCase()}`,
    description: `Consulta el estado de tu envío ${trackingNumber.toUpperCase()} en tiempo real.`,
  }
}

async function getShipment(trackingNumber: string): Promise<LeanShipment | null> {
  await connectDB()
  const shipment = await Shipment.findOne({ trackingNumber: trackingNumber.toUpperCase() })
    .populate('clientId', 'businessName')
    .lean()
  
  if (!shipment) return null
  return JSON.parse(JSON.stringify(shipment)) as LeanShipment
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PREPARANDO: { label: 'Preparando', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  RECOGIDO: { label: 'Recogido', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
  EN_TRANSITO: { label: 'En Tránsito', color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' },
  EN_SUCURSAL: { label: 'En Sucursal', color: 'text-violet-400 bg-violet-500/15 border-violet-500/30' },
  ENTREGADO: { label: 'Entregado', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  DEMORADO: { label: 'Demorado', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  CANCELADO: { label: 'Cancelado', color: 'text-red-400 bg-red-500/15 border-red-500/30' },
}

export default async function TrackingPage({ params }: Props) {
  const { trackingNumber } = await params
  const shipment = await getShipment(trackingNumber)

  if (!shipment) notFound()

  const statusCfg = STATUS_LABELS[shipment.currentStatus] ?? STATUS_LABELS.PREPARANDO
  const client = shipment.clientId as unknown as { businessName?: string }

  return (
    <main className="min-h-screen py-10 px-4">
      {/* BG blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Header card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shrink-0">
                <Truck className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">N° de Seguimiento</p>
                <h1 className="text-xl font-extrabold text-slate-100 tracking-tight font-mono">
                  {shipment.trackingNumber}
                </h1>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow label="Remitente" value={client?.businessName ?? '—'} />
            <InfoRow label="Origen" value={shipment.originAddress} />
            <InfoRow label="Destino" value={shipment.destinationAddress} />
            <InfoRow label="Fecha de creación" value={new Date(shipment.createdAt as Date).toLocaleDateString('es-AR')} />
          </div>
        </div>

        {/* Timeline */}
        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-5">
            <Package className="w-4 h-4 text-blue-400" />
            Línea de Tiempo
          </h2>
          <Timeline history={shipment.history as never} />
        </section>

        {/* Documents */}
        {shipment.documents.length > 0 && (
          <section className="glass rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <FileText className="w-4 h-4 text-blue-400" />
              Documentos Adjuntos
            </h2>
            <ul className="space-y-2">
              {shipment.documents.map((doc, idx) => (
                <li key={idx}>
                  <a
                    id={`doc-download-${idx}`}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-3 p-3 rounded-xl
                      bg-slate-800/50 border border-slate-700/40
                      hover:bg-slate-700/60 hover:border-slate-600/60
                      transition-all duration-200 group
                    "
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(doc.uploadedAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/40 rounded-lg px-3 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 font-medium mt-0.5 truncate">{value}</p>
    </div>
  )
}
