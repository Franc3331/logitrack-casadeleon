import { connectDB } from '@/lib/db'
import User from '@/models/User'

/**
 * POST /api/setup
 * Body: { secret, name, email, password }
 *
 * Creates the first ADMIN user.
 * Disable or delete this route once the admin is created.
 */
export async function POST(request: Request) {
  const { secret, name, email, password } = await request.json()

  // Basic guard: require a secret that matches the env var
  const SETUP_SECRET = process.env.SETUP_SECRET
  if (!SETUP_SECRET || secret !== SETUP_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!name || !email || !password) {
    return Response.json({ error: 'name, email y password son requeridos' }, { status: 400 })
  }

  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    return Response.json({ error: 'Ya existe un usuario con ese email' }, { status: 409 })
  }

  const user = await User.create({ name, email, password, role: 'ADMIN' })

  return Response.json({
    message: '✅ Admin creado correctamente. Eliminá o deshabilitá esta ruta.',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  }, { status: 201 })
}
