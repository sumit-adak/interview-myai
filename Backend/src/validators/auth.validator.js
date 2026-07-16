const { z } = require("zod")

const password = z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

const registerSchema = z.object({
    body: z.object({
        username: z.string().trim().min(2).max(80),
        email: z.string().trim().email().toLowerCase(),
        password
    })
})

const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email().toLowerCase(),
        password: z.string().min(1).max(128)
    })
})

module.exports = { registerSchema, loginSchema }
