import { connectDB } from '@/lib/db'
import Shipment from '@/models/Shipment'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    await connectDB()
    const { trackingNumber } = await params

    const shipment = await Shipment.findOne({
      trackingNumber: trackingNumber.toUpperCase(),
    })
      .populate('clientId', 'businessName') // Only expose the business name publicly
      .lean()

    if (!shipment) {
      return Response.json({ error: 'Número de seguimiento no encontrado' }, { status: 404 })
    }

    // Sanitize: omit internal clientId details beyond businessName
    const { clientId, ...rest } = shipment as Record<string, unknown>
    const sanitized = {
      ...rest,
      clientBusinessName: (clientId as { businessName?: string })?.businessName ?? null,
      // Omit internal MongoDB _id fields from sub-documents if needed
    }

    return Response.json({ shipment: sanitized })
  } catch (err) {
    console.error('[GET /api/track/[trackingNumber]]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
