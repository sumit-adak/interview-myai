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

            // Convert full HTML documents into a render-safe fragment for html2pdf.
            const toRenderableResumeHtml = (html) => {
                const text = String(html || "").trim()
                if (!text) return ""

                const looksLikeDocument = /<!doctype html|<html|<head|<body/i.test(text)
                if (!looksLikeDocument) return text

                try {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(text, "text/html")
                    const styleBlocks = Array.from(doc.querySelectorAll("style")).map((el) => el.outerHTML).join("\n")
                    const bodyContent = doc.body?.innerHTML?.trim() || ""

                    if (!bodyContent) return ""

                    return `${styleBlocks}\n<div id="resume-render-root">${bodyContent}</div>`
                } catch {
                    return text
                }
            }

            const renderHtml = toRenderableResumeHtml(cleanHtml) || `
                <div style="font-family: Arial, sans-serif; color: #111827; padding: 24px;">
                    <h1 style="margin: 0 0 8px 0; font-size: 24px;">Resume</h1>
                    <p style="margin: 0; font-size: 14px;">Unable to parse generated HTML. Please regenerate the resume.</p>
                </div>
            `

            const opt = {
                margin:       10,
                filename:     `resume_${interviewReportId}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Render via an offscreen DOM node to avoid blank pages from document-level markup.
            const mount = document.createElement("div")
            mount.style.position = "fixed"
            mount.style.left = "-100000px"
            mount.style.top = "0"
            mount.style.width = "210mm"
            mount.style.background = "#ffffff"
            mount.style.color = "#111827"
            mount.style.zIndex = "-1"
            mount.innerHTML = `
                <div style="background:#fff; color:#111827; width:100%; min-height:297mm; padding:0;">
                    ${renderHtml}
                </div>
            `
            document.body.appendChild(mount)

            try {
                await html2pdf().set(opt).from(mount).save();
            } finally {
                document.body.removeChild(mount)
            }

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
