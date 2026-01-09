import type { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

const SECRET_KEY = process.env.SECRET

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." })

  if (!SECRET_KEY)
    return res.status(500).json({ message: "Server misconfigured (missing SECRET)." })

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload
    const userId = decoded?.id as string | undefined
    if (!userId) return res.status(401).json({ message: "Invalid token payload." })

    res.locals.userId = userId
    return next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." })
  }
}
