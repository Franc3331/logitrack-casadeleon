import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Shipment from '@/models/Shipment'
import { SHIPMENT_STATUSES } from '@/models/Shipment'

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const query: Record<string, unknown> = {}
    if (status && SHIPMENT_STATUSES.includes(status as never)) query.currentStatus = status
    if (clientId) query.clientId = clientId

    const total = await Shipment.countDocuments(query)
    const shipments = await Shipment.find(query)
      .populate('clientId', 'businessName cuit_dni contactEmail')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return Response.json({ shipments, total, page, limit })
  } catch (err) {
    console.error('[GET /api/shipments]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const body = await request.json()
    const { trackingNumber, clientId, originAddress, destinationAddress } = body

    if (!trackingNumber || !clientId || !originAddress || !destinationAddress) {
      return Response.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const shipment = await Shipment.create({
      trackingNumber,
      clientId,
      originAddress,
      destinationAddress,
      currentStatus: 'PREPARANDO',
      history: [{ status: 'PREPARANDO', location: 'Origen', notes: 'Envío creado' }],
    })

    return Response.json({ shipment }, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/shipments]', err)
    if (err instanceof Error && 'code' in err && (err as unknown as { code: number }).code === 11000) {
      return Response.json({ error: 'El número de seguimiento ya existe' }, { status: 409 })
    }
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
