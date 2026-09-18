import { VercelRequest, VercelResponse } from '@vercel/node'
import app from './index'

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res)
}
