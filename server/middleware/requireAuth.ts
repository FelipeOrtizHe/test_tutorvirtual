import type { NextFunction, Request, Response } from 'express'
import { verifyToken, type DecodedToken } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = await verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
