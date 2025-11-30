import type { NextFunction, Request, Response } from 'express'
import { fromNodeMiddleware } from 'h3'
import type { NodeMiddleware } from 'h3'
import { verifyToken, type DecodedToken } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken
}

const requireAuthMiddleware: NodeMiddleware = async (req, res, next) => {
  const request = req as unknown as AuthenticatedRequest
  const response = res as unknown as Response
  const nextFn = next as NextFunction

  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response
      .status(401)
      .json({ message: 'Authorization token is missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = await verifyToken(token)
    request.user = decoded
    nextFn()
  } catch (error) {
    response.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const requireAuth = requireAuthMiddleware

export default fromNodeMiddleware(requireAuthMiddleware)
