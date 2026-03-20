import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


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
        // Open window synchronously to avoid popup blockers
        const newWindow = window.open("", "_blank", "width=800,height=900");
        if (newWindow) {
            newWindow.document.write("<h2>Generating Resume PDF, please wait...</h2>");
        } else {
            alert("Please allow popups to download the resume.");
        }

        try {
            const htmlResponse = await generateResumePdf({ interviewReportId })
            
            if (newWindow) {
                newWindow.document.open();
                newWindow.document.write(htmlResponse);
                newWindow.document.close();
                
                // Wait for any styling to load before prompting print dialog
                setTimeout(() => {
                    newWindow.print();
                }, 1000);
            }
        } catch (error) {
            console.log(error)
            if (newWindow) {
                newWindow.document.body.innerHTML = "<h2 style='color:red;'>Failed to generate resume. Please try again.</h2>";
            }
            throw error
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