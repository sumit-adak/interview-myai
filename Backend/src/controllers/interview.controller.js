const interviewService = require("../services/interview.service")
const catchAsync = require("../utils/catchAsync")

const generateInterViewReportController = catchAsync(async (req, res) => {
    const interviewReport = await interviewService.createInterviewReport({
        userId: req.user.id,
        file: req.file,
        selfDescription: req.body.selfDescription,
        jobDescription: req.body.jobDescription
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
})

const getInterviewReportByIdController = catchAsync(async (req, res) => {
    const interviewReport = await interviewService.getInterviewReport({
        userId: req.user.id,
        interviewId: req.params.interviewId
    })

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
})

const getAllInterviewReportsController = catchAsync(async (req, res) => {
    const interviewReports = await interviewService.listInterviewReports(req.user.id)

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
})

const generateResumePdfController = catchAsync(async (req, res) => {
    const htmlString = await interviewService.buildResumeHtml({
        userId: req.user.id,
        interviewReportId: req.params.interviewReportId
    })

    res.set({ "Content-Type": "text/html; charset=utf-8" })
    res.send(htmlString)
})

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
