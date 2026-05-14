const pdfParse = require("pdf-parse/lib/pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReport, generateResumePdf } = require("./ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const AppError = require("../utils/AppError")

function inferTitleFromJobDescription(jobDescription = "") {
    const firstLine = String(jobDescription).split("\n").find(Boolean)?.trim()
    if (!firstLine) return "Interview Report"
    return firstLine.slice(0, 120)
}

async function extractResumeText(file) {
    if (!file) return ""

    try {
        if (file.mimetype === "application/pdf") {
            const pdfData = await pdfParse(file.buffer)
            return pdfData.text || ""
        }

        if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const docxResult = await mammoth.extractRawText({ buffer: file.buffer })
            return docxResult.value || ""
        }
    } catch (error) {
        console.warn("Resume parsing failed, continuing without resume text:", error.message)
    }

    return ""
}

function normalizeAiResponse(aiResponse, jobDescription) {
    return {
        matchScore: Number.isFinite(aiResponse?.matchScore)
            ? Math.max(0, Math.min(100, aiResponse.matchScore))
            : 0,
        technicalQuestions: Array.isArray(aiResponse?.technicalQuestions) ? aiResponse.technicalQuestions : [],
        behavioralQuestions: Array.isArray(aiResponse?.behavioralQuestions) ? aiResponse.behavioralQuestions : [],
        skillGaps: Array.isArray(aiResponse?.skillGaps) ? aiResponse.skillGaps : [],
        preparationPlan: Array.isArray(aiResponse?.preparationPlan) ? aiResponse.preparationPlan : [],
        title: (aiResponse?.title || "").trim() || inferTitleFromJobDescription(jobDescription)
    }
}

async function createInterviewReport({ userId, file, selfDescription, jobDescription }) {
    const resumeText = await extractResumeText(file)

    const aiResponse = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: userId,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...normalizeAiResponse(aiResponse, jobDescription)
    })

    return interviewReport
}

async function getInterviewReport({ userId, interviewId }) {
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: userId
    })

    if (!interviewReport) {
        throw new AppError("Interview report not found", 404)
    }

    return interviewReport
}

async function listInterviewReports(userId) {
    return interviewReportModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        .lean()
}

async function buildResumeHtml({ userId, interviewReportId }) {
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: userId
    })

    if (!interviewReport) {
        throw new AppError("Interview report not found", 404)
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    return generateResumePdf({ resume, jobDescription, selfDescription })
}

module.exports = {
    createInterviewReport,
    getInterviewReport,
    listInterviewReports,
    buildResumeHtml
}
