import { VercelRequest, VercelResponse } from '@vercel/node'
import app from './index'

export default async (req: VercelRequest, res: VercelResponse) => {
  // Remove trailing slash for consistency
  if (req.url?.endsWith('/') && req.url.length > 1) {
    req.url = req.url.slice(0, -1)
  }

  return app(req, res)
}
