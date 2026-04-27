import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Shipment, { SHIPMENT_STATUSES, ShipmentStatus } from '@/models/Shipment'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const { status, location, notes } = body

    if (!status || !SHIPMENT_STATUSES.includes(status as ShipmentStatus)) {
      return Response.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      {
        $set: { currentStatus: status },
        $push: {
          history: {
            status,
            location: location || '',
            notes: notes || '',
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    )

    if (!shipment) return Response.json({ error: 'Envío no encontrado' }, { status: 404 })
    return Response.json({ shipment })
  } catch (err) {
    console.error('[PATCH /api/shipments/[id]/status]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
