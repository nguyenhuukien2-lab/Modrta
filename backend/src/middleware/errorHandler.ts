import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  status?: number
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  })

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
