import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import html2pdf from "html2pdf.js"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            throw error
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
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }, [setLoading, setReports])

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

            // Sometimes AI wraps the HTML string in markdown ```html ... ``` blocks. Strip them.
            const cleanHtml = rawHtml.replace(/```html\n?/gi, "").replace(/```\n?/g, "").trim();

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
            console.log(error)
            alert("Failed to download resume. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId, getReportById, getReports ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}