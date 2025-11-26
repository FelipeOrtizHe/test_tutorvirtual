import type { NextFunction, Request, Response } from 'express'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err)

  const status = (typeof err === 'object' && err !== null && 'statusCode' in err)
    ? Number((err as { statusCode?: number }).statusCode) || 500
    : 500

  const message = err instanceof Error ? err.message : 'Internal server error'

  res.status(status).json({ message })
}
