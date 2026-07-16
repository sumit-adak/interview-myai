const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
const validate = require("../middlewares/validate.middleware")
const createRateLimiter = require("../middlewares/rateLimit.middleware")
const env = require("../config/env")
const {
    generateInterviewSchema,
    interviewIdSchema,
    resumeIdSchema,
    deleteReportSchema,
    paginationSchema
} = require("../validators/interview.validator")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report based on user self description, resume and job description
 * @access Private
 */
const aiLimiter = createRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AI_RATE_LIMIT_MAX,
    message: "Too many AI requests. Please wait a moment and try again."
})

interviewRouter.post(
    "/",
    authMiddleware.authUser,
    aiLimiter,
    upload.single("resume"),
    validate(generateInterviewSchema),
    interviewController.generateInterViewReportController
)

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user (paginated)
 * @access Private
 */
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    validate(paginationSchema),
    interviewController.getAllInterviewReportsController
)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access Private
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    validate(interviewIdSchema),
    interviewController.getInterviewReportByIdController
)

/**
 * @route DELETE /api/interview/report/:interviewId
 * @description Delete an interview report
 * @access Private
 */
interviewRouter.delete(
    "/report/:interviewId",
    authMiddleware.authUser,
    validate(deleteReportSchema),
    interviewController.deleteInterviewReportController
)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume HTML for PDF export
 * @access Private
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    aiLimiter,
    validate(resumeIdSchema),
    interviewController.generateResumePdfController
)

module.exports = interviewRouter
