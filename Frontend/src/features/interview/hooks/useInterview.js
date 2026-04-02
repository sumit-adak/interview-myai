import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext } from "react"
import { InterviewContext } from "../interview.context"
import html2pdf from "html2pdf.js"


export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setReport(null) // clear any old report
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to generate report. Please try again."
            throw new Error(msg)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport

    }, [setLoading, setReport])

    const getReportById = useCallback(async (reportId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(reportId)
            setReport(response.interviewReport)
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to fetch report."
            throw new Error(msg)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        // Use a separate loading state indicator so it does NOT block the whole page
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.error("Failed to fetch reports list:", error)
            setReports([])
        }

        return response?.interviewReports
    }, [setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)

        try {
            const htmlResponse = await generateResumePdf({ interviewReportId })

            let rawHtml = ""
            if (htmlResponse && typeof htmlResponse === 'object' && htmlResponse.html) {
                rawHtml = htmlResponse.html
            } else if (typeof htmlResponse === 'string') {
                rawHtml = htmlResponse
            } else {
                rawHtml = "<p>Unable to construct resume content.</p>"
            }

            // Sometimes backend/model returns JSON string like {"html":"..."} as text.
            if (typeof rawHtml === "string") {
                const trimmed = rawHtml.trim()
                if (trimmed.startsWith("{") && trimmed.includes("\"html\"")) {
                    try {
                        const parsed = JSON.parse(trimmed)
                        if (parsed?.html && typeof parsed.html === "string") {
                            rawHtml = parsed.html
                        }
                    } catch {
                        const match = trimmed.match(/"html"\\s*:\\s*"([\\s\\S]*?)"\\s*\\}?$/i)
                        if (match?.[1]) {
                            try {
                                rawHtml = JSON.parse(`"${match[1]}"`)
                            } catch {
                                // keep original rawHtml
                            }
                        }
                    }
                }
            }

            // Sometimes AI wraps the HTML string in markdown ```html ... ``` blocks. Strip them.
            let cleanHtml = rawHtml.replace(/```html\n?/gi, "").replace(/```\n?/g, "").trim();

            const htmlStartIdx = cleanHtml.search(/<!doctype html|<html/i)
            if (htmlStartIdx >= 0) {
                cleanHtml = cleanHtml.slice(htmlStartIdx)
            }

            const opt = {
                margin:       10,
                filename:     `resume_${interviewReportId}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // html2pdf has issues with full HTML documents because it sets innerHTML which strips <html> and <body>. 
            // We replace body with div to keep any inline styles the AI put on the body tag!
            let safeHtml = cleanHtml.replace(/<body/gi, "<div id='resume-body-wrapper'").replace(/<\/body>/gi, "</div>");

            const wrapperHtml = `
                <div style="background-color: white !important; color: black !important; text-align: left; width: 100%; min-height: 100vh;">
                    ${safeHtml}
                </div>
            `;

            // html2pdf accepts a raw HTML string.
            await html2pdf().set(opt).from(wrapperHtml).save();

        } catch (error) {
            console.error("Resume PDF generation error:", error)
            const msg = error?.response?.data?.message || error?.message || "Failed to download resume. Please try again."
            alert(msg)
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
