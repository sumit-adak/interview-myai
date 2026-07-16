const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const env = require("./config/env")
const requestId = require("./middlewares/requestId.middleware")
const createRateLimiter = require("./middlewares/rateLimit.middleware")
const { securityHeaders, sanitizeBody } = require("./middlewares/security.middleware")
const { notFound, errorHandler } = require("./middlewares/error.middleware")

const app = express()

app.set("trust proxy", env.TRUST_PROXY)
app.use(helmet())
app.use(requestId)
app.use(securityHeaders)
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.use(cors({
    origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))
app.use(sanitizeBody)
app.use(createRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: "Too many requests. Please wait and try again."
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() })
})

app.get("/", (_req, res) => {
    res.json({ status: "ok", service: "AI Interview Report Generator API" })
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
