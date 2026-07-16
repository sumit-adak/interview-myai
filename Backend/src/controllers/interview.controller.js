const interviewService = require("../services/interview.service")

async function generateInterViewReportController(req, res) {
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
}

async function getInterviewReportByIdController(req, res) {
    const interviewReport = await interviewService.getInterviewReport({
        userId: req.user.id,
        interviewId: req.params.interviewId
    })

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res) {
    const { page, limit } = req.query
    const result = await interviewService.listInterviewReports(req.user.id, { page, limit })

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports: result.reports,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
        }
    })
}

async function deleteInterviewReportController(req, res) {
    await interviewService.deleteInterviewReport({
        userId: req.user.id,
        interviewId: req.params.interviewId
    })

    res.status(200).json({ message: "Report deleted successfully" })
}

async function generateResumePdfController(req, res) {
    const htmlString = await interviewService.buildResumeHtml({
        userId: req.user.id,
        interviewReportId: req.params.interviewReportId
    })

    res.set({ "Content-Type": "text/html; charset=utf-8" })
    res.send(htmlString)
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    generateResumePdfController
}
