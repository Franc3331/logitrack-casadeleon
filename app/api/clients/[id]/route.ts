import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'
import Client from '@/models/Client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if (auth instanceof Response) return auth

  try {
    await connectDB()
    const { id } = await params
    const client = await Client.findById(id)
    if (!client) return Response.json({ error: 'Cliente no encontrado' }, { status: 404 })
    return Response.json({ client })
  } catch (err) {
    console.error('[GET /api/clients/[id]]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

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

    const client = await Client.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!client) return Response.json({ error: 'Cliente no encontrado' }, { status: 404 })
    return Response.json({ client })
  } catch (err) {
    console.error('[PATCH /api/clients/[id]]', err)
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
    await Client.findByIdAndDelete(id)
    return Response.json({ message: 'Cliente eliminado correctamente' })
  } catch (err) {
    console.error('[DELETE /api/clients/[id]]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
