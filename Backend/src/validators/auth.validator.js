const { z } = require("zod")

const email = z.string().trim().email().toLowerCase()
const password = z.string().min(8).max(128)

const registerSchema = z.object({
    body: z.object({
        username: z.string().trim().min(2).max(80),
        email,
        password
    })
})

const loginSchema = z.object({
    body: z.object({
        email,
        password: z.string().min(1).max(128)
    })
})

module.exports = { registerSchema, loginSchema }
