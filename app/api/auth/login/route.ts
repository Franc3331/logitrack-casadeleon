import { connectDB } from '@/lib/db'
import { signToken } from '@/lib/auth'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    // Explicitly select the password field back (it's excluded by default)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = signToken({ id: user._id.toString(), role: user.role })

    return Response.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[POST /api/auth/login]', err)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
