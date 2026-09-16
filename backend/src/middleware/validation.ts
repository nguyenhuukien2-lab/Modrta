import { Request, Response, NextFunction } from 'express'

export function validateQuery(req: Request, res: Response, next: NextFunction) {
  // Add validation middleware here if needed
  next()
}
