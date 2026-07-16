const test = require("node:test")
const assert = require("node:assert/strict")
const { registerSchema } = require("../src/validators/auth.validator")
const { generateInterviewSchema, interviewIdSchema } = require("../src/validators/interview.validator")

test("register validation accepts a strong payload", () => {
    const result = registerSchema.safeParse({
        body: {
            username: "Sumit Adak",
            email: "SUMIT@example.com",
            password: "SuperSecret123!"
        }
    })

    assert.equal(result.success, true)
    assert.equal(result.data.body.email, "sumit@example.com")
})

test("register validation rejects weak passwords", () => {
    const result = registerSchema.safeParse({
        body: {
            username: "Sumit",
            email: "sumit@example.com",
            password: "123"
        }
    })

    assert.equal(result.success, false)
})

test("interview validation rejects short prompts", () => {
    const result = generateInterviewSchema.safeParse({
        body: {
            jobDescription: "React",
            selfDescription: "Node"
        }
    })

    assert.equal(result.success, false)
})

test("interview id validation accepts Mongo object ids", () => {
    const result = interviewIdSchema.safeParse({
        params: {
            interviewId: "507f1f77bcf86cd799439011"
        }
    })

    assert.equal(result.success, true)
})
