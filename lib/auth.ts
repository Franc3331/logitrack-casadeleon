import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export interface JwtPayload {
  id: string
  role: 'ADMIN' | 'OPERATOR'
}

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) throw new Error('Please define the JWT_SECRET environment variable')
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string): JwtPayload {
  if (!JWT_SECRET) throw new Error('Please define the JWT_SECRET environment variable')
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
