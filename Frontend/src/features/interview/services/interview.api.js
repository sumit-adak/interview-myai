import { apiClient } from "../../../lib/apiClient"

/**
 * @description Generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription || "")
    formData.append("selfDescription", selfDescription || "")
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await apiClient.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}

/**
 * @description Get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await apiClient.get(`/api/interview/report/${interviewId}`)
    return response.data
}

/**
 * @description Get all interview reports of logged in user (paginated).
 */
export const getAllInterviewReports = async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get("/api/interview/", {
        params: { page, limit }
    })
    return response.data
}

/**
 * @description Delete an interview report.
 */
export const deleteInterviewReport = async (interviewId) => {
    const response = await apiClient.delete(`/api/interview/report/${interviewId}`)
    return response.data
}

/**
 * @description Generate resume HTML for PDF export.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await apiClient.post(`/api/interview/resume/pdf/${interviewReportId}`)
    return response.data
}
