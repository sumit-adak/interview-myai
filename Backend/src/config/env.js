const { z } = require("zod")

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters"),
    GOOGLE_GENAI_API_KEY: z.string().min(1, "GOOGLE_GENAI_API_KEY is required"),
    CORS_ORIGIN: z.string().default("http://localhost:5175,http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:3000"),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    AI_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(12),
    TRUST_PROXY: z.string().default("1")
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    const details = parsed.error.errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
    throw new Error(`Invalid environment configuration: ${details}`)
}

const env = parsed.data

env.corsOrigins = env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

module.exports = env
