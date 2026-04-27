import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Shipment from '@/models/Shipment'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const { title, fileUrl } = body

    if (!title || !fileUrl) {
      return Response.json({ error: 'title y fileUrl son requeridos' }, { status: 400 })
    }

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { $push: { documents: { title, fileUrl, uploadedAt: new Date() } } },
      { new: true }
    )

    if (!shipment) return Response.json({ error: 'Envío no encontrado' }, { status: 404 })
    return Response.json({ shipment }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/shipments/[id]/documents]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
