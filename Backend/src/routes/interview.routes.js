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
    resumeIdSchema
} = require("../validators/interview.validator")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
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
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    validate(interviewIdSchema),
    interviewController.getInterviewReportByIdController
)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    aiLimiter,
    validate(resumeIdSchema),
    interviewController.generateResumePdfController
)



module.exports = interviewRouter
