import "dotenv/config"

import cookieParser from "cookie-parser"
import cors, { CorsOptions } from "cors"
import express, { Request, Response } from "express"

import { authMiddleware } from "./middlewares/auth-middleware"
import authRouter from "./routes/auth-router"
import bookmarkRouter from "./routes/bookmark-router"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\/$/, "")),
)

const corsOptions: CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true)

    const normalized = origin.replace(/\/$/, "")
    if (allowedOrigins.has(normalized)) return cb(null, true)

    return cb(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Bookmark Manager!")
})

app.use("/auth", authRouter)
app.use("/bookmark", authMiddleware, bookmarkRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
