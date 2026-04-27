import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Client from '@/models/Client'

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { searchParams } = request.nextUrl
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const query: Record<string, unknown> = {}
    if (isActive !== null) query.isActive = isActive === 'true'
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { cuit_dni: { $regex: search, $options: 'i' } },
      ]
    }

    const clients = await Client.find(query).sort({ createdAt: -1 })
    return Response.json({ clients })
  } catch (err) {
    console.error('[GET /api/clients]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const body = await request.json()
    const { businessName, cuit_dni, contactEmail, contactPhone, address } = body

    if (!businessName || !cuit_dni) {
      return Response.json({ error: 'businessName y cuit_dni son requeridos' }, { status: 400 })
    }

    const existing = await Client.findOne({ cuit_dni })
    if (existing) {
      return Response.json({ error: 'Ya existe un cliente con ese CUIT/DNI' }, { status: 409 })
    }

    const client = await Client.create({ businessName, cuit_dni, contactEmail, contactPhone, address })
    return Response.json({ client }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/clients]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
