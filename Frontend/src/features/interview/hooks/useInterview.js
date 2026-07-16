import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
    deleteInterviewReport
} from "../services/interview.api"
import { useCallback, useContext, useState } from "react"
import { InterviewContext } from "../interview.context"
import { getApiErrorMessage } from "../../../lib/apiClient"

const FALLBACK_RESUME_HTML = `
    <div style="font-family: Arial, sans-serif; color: #111827; padding: 24px; background: #ffffff;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px;">Resume</h1>
        <p style="margin: 0; font-size: 14px;">Unable to parse generated resume content. Please regenerate the resume.</p>
    </div>
`

const extractResumeHtml = (htmlResponse) => {
    let rawHtml = ""

    if (htmlResponse && typeof htmlResponse === "object" && typeof htmlResponse.html === "string") {
        rawHtml = htmlResponse.html
    } else if (typeof htmlResponse === "string") {
        rawHtml = htmlResponse
    }

    if (!rawHtml.trim()) {
        return ""
    }

    const trimmed = rawHtml.trim()
    if (trimmed.startsWith("{") && trimmed.includes("\"html\"")) {
        try {
            const parsed = JSON.parse(trimmed)
            if (typeof parsed?.html === "string" && parsed.html.trim()) {
                rawHtml = parsed.html
            }
        } catch {
            const match = trimmed.match(/"html"\s*:\s*"([\s\S]*?)"\s*\}?$/i)
            if (match?.[1]) {
                try {
                    rawHtml = JSON.parse(`"${match[1]}"`)
                } catch {
                    rawHtml = match[1]
                }
            }
        }
    }

    return rawHtml.replace(/```html\s*/gi, "").replace(/```\s*/g, "").trim()
}

const toRenderableResumeHtml = (html) => {
    const text = String(html || "").trim()
    if (!text) return ""

    const htmlStartIdx = text.search(/<!doctype html|<html/i)
    const normalizedText = htmlStartIdx >= 0 ? text.slice(htmlStartIdx) : text
    const looksLikeDocument = /<!doctype html|<html|<head|<body/i.test(normalizedText)
    if (!looksLikeDocument) return normalizedText

    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(normalizedText, "text/html")
        const styleBlocks = Array.from(doc.querySelectorAll("style")).map((el) => el.outerHTML).join("\n")
        const bodyContent = doc.body?.innerHTML?.trim() || ""

        if (!bodyContent) return ""

        return `${styleBlocks}\n<div id="resume-render-root">${bodyContent}</div>`
    } catch {
        return normalizedText
    }
}

const waitForResumeLayout = async () => {
    if (document.fonts?.ready) {
        try {
            await document.fonts.ready
        } catch {
            // Ignore font readiness errors and continue with export.
        }
    }

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

const getExportDimensions = (element) => {
    if (!element) {
        return { width: 794, height: 1123 }
    }

    const rect = element.getBoundingClientRect()

    return {
        width: Math.max(Math.ceil(rect.width), Math.ceil(element.scrollWidth), Math.ceil(element.offsetWidth), 794),
        height: Math.max(Math.ceil(rect.height), Math.ceil(element.scrollHeight), Math.ceil(element.offsetHeight), 1123)
    }
}

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setReport(null)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            const msg = getApiErrorMessage(error, "Failed to generate report. Please try again.")
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
            const msg = getApiErrorMessage(error, "Failed to fetch report.")
            throw new Error(msg)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }, [setLoading, setReport])

    const getReports = useCallback(async ({ page = 1, limit = 10 } = {}) => {
        try {
            const response = await getAllInterviewReports({ page, limit })
            setReports(response.interviewReports || [])
            if (response.pagination) {
                setPagination(response.pagination)
            }
            return response.interviewReports
        } catch (error) {
            console.error("Failed to fetch reports list:", error)
            setReports([])
            return []
        }
    }, [setReports])

    const removeReport = useCallback(async (interviewId) => {
        try {
            await deleteInterviewReport(interviewId)
            setReports((prev) => prev.filter((r) => r._id !== interviewId))
            setPagination((prev) => ({
                ...prev,
                total: Math.max(0, prev.total - 1),
                totalPages: Math.max(1, Math.ceil((prev.total - 1) / prev.limit))
            }))
        } catch (error) {
            const msg = getApiErrorMessage(error, "Failed to delete report.")
            throw new Error(msg)
        }
    }, [setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)

        try {
            const htmlResponse = await generateResumePdf({ interviewReportId })
            const renderHtml = toRenderableResumeHtml(extractResumeHtml(htmlResponse)) || FALLBACK_RESUME_HTML

            const opt = {
                margin: [10, 10, 10, 10],
                filename: `resume_${interviewReportId}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: { mode: ["avoid-all", "css", "legacy"] }
            }

            const mount = document.createElement("div")
            mount.setAttribute("data-resume-export", "true")
            mount.style.position = "fixed"
            mount.style.left = "0"
            mount.style.top = "0"
            mount.style.pointerEvents = "none"
            mount.style.opacity = "0.01"
            mount.style.overflow = "visible"
            mount.style.width = "190mm"
            mount.style.maxWidth = "190mm"
            mount.style.minHeight = "1px"
            mount.style.background = "#ffffff"
            mount.style.color = "#111827"
            mount.style.zIndex = "-1"
            mount.innerHTML = `
                <div style="background:#fff; color:#111827; width:190mm; max-width:190mm; margin:0; padding:0; overflow:visible;">
                    ${renderHtml}
                </div>
            `
            document.body.appendChild(mount)

            try {
                await waitForResumeLayout()

                const exportRoot = mount.firstElementChild
                const exportText = exportRoot?.textContent?.replace(/\s+/g, " ").trim() || ""
                if (!exportRoot || !exportText) {
                    throw new Error("Generated resume content was empty.")
                }

                const { width, height } = getExportDimensions(exportRoot)
                exportRoot.style.width = `${width}px`
                exportRoot.style.maxWidth = `${width}px`
                exportRoot.style.minHeight = `${height}px`

                const { default: html2pdf } = await import("html2pdf.js")
                await html2pdf().set({
                    ...opt,
                    html2canvas: {
                        ...opt.html2canvas,
                        width,
                        height,
                        windowWidth: width,
                        windowHeight: height
                    }
                }).from(exportRoot).save()
            } finally {
                if (mount.parentNode) {
                    document.body.removeChild(mount)
                }
            }

        } catch (error) {
            console.error("Resume PDF generation error:", error)
            const msg = getApiErrorMessage(error, "Failed to download resume. Please try again.")
            throw new Error(msg)
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    return {
        loading, report, reports, pagination,
        generateReport, getReportById, getReports, getResumePdf, removeReport
    }
}
