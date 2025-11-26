// server/utils/jwt.ts
import jwt from 'jsonwebtoken'

export interface DecodedToken {
  userId: number
  role: string
  asignaturaId?: number
  iat: number
  exp: number
}

const jwtSecret = process.env.JWT_SECRET || 'fallback_secret'

export const verifyToken = (token: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err: Error | null, decoded: unknown) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded as DecodedToken)
      }
    })
  })
}