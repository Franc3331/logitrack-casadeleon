import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Shipment from '@/models/Shipment'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { id } = await params
    const shipment = await Shipment.findById(id).populate('clientId', 'businessName cuit_dni contactEmail contactPhone address')
    if (!shipment) return Response.json({ error: 'Envío no encontrado' }, { status: 404 })
    return Response.json({ shipment })
  } catch (err) {
    console.error('[GET /api/shipments/[id]]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { id } = await params
    const deleted = await Shipment.findByIdAndDelete(id)
    if (!deleted) return Response.json({ error: 'Envío no encontrado' }, { status: 404 })
    return Response.json({ message: 'Envío eliminado correctamente' })
  } catch (err) {
    console.error('[DELETE /api/shipments/[id]]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
