const pdfParse = require("pdf-parse/lib/pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate Interview Report
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "jobDescription is required"
            });
        }

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Either a Resume file or selfDescription is required"
            });
        }

        // ✅ Parse PDF
        let resumeText = "";
        if (req.file) {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        }

        // ✅ Generate AI report
        const aiResponse = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        // ✅ Save to DB
        const interviewReport = await interviewReportModel.create({
            user: req.user?.id || null, // safe optional
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...aiResponse
        });

        // ✅ Response
        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

/**
 * @description Get Interview Report by ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user?.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

/**
 * @description Get All Interview Reports
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user?.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

/**
 * @description Generate Resume PDF
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const htmlString = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "text/html"
        });

        return res.send(htmlString);

    } catch (error) {
        console.error("Error in generateResumePdfController:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};