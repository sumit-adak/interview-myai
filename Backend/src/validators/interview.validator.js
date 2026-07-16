const { z } = require("zod")

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id")

const generateInterviewSchema = z.object({
    body: z.object({
        jobDescription: z.string().trim().min(30).max(12000),
        selfDescription: z.string().trim().min(20).max(8000)
    })
})

const interviewIdSchema = z.object({
    params: z.object({
        interviewId: objectId
    })
})

const resumeIdSchema = z.object({
    params: z.object({
        interviewReportId: objectId
    })
})

const deleteReportSchema = z.object({
    params: z.object({
        interviewId: objectId
    })
})

const paginationSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10)
    })
})

module.exports = {
    generateInterviewSchema,
    interviewIdSchema,
    resumeIdSchema,
    deleteReportSchema,
    paginationSchema
}
