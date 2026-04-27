import { NextRequest } from 'next/server'
import { verifyToken, JwtPayload } from './auth'

export function getAuthUser(request: NextRequest): JwtPayload | null {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    const token = authHeader.slice(7)
    return verifyToken(token)
  } catch {
    return null
  }
}

export function requireAuth(request: NextRequest): JwtPayload | Response {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return user
}
