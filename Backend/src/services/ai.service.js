const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}



// Removed internal generatePdfFromHtml because cloud hosts like Render lack Chromium libs

const escapeHtml = (str) => {
    if (!str) return ""
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const candidateData = [
        jobDescription && `Job Description:\n${jobDescription}`,
        resume && `Resume Text:\n${resume}`,
        selfDescription && `Self Description:\n${selfDescription}`
    ].filter(Boolean).join("\n\n") || "No input data provided."

    const prompt = `Generate a professional, ATS-friendly resume in HTML from the following candidate data. Use inline CSS only, and avoid external stylesheets.
- Require sections: Name, Title, Summary, Skills, Experience, Education, Certifications, Projects, Contact.
- Prefer a concise 1-2 page layout.
- If values are missing, infer naturally from the candidate data but don't invent unrelated experiences.
- Use the resume text and self-description as source of truth.
- Preserve key dates, tech stack, achievements.
- Output must be JSON with a single field named \"html\" containing the full resume HTML.

Candidate input data:\n${candidateData}`

    let htmlOutput = ""

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })

        const jsonContent = JSON.parse(response.text)
        htmlOutput = jsonContent?.html || ""

    } catch (error) {
        console.error("Error generating resume HTML from AI response:", error)
        // fall through to a safe basic template
    }

    if (!htmlOutput || typeof htmlOutput !== 'string' || !htmlOutput.trim()) {
        // Fallback HTML in case AI did not return valid html
        const fallbackText = resume || selfDescription || jobDescription || "No candidate data available"
        htmlOutput = `<!doctype html><html><head><meta charset='utf-8'><style>body{font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.4;padding:20px}pre{white-space:pre-wrap;word-break:break-word}</style></head><body><h1>Candidate Resume</h1><pre>${escapeHtml(fallbackText)}</pre></body></html>`
    }

    return htmlOutput

}

module.exports = { generateInterviewReport, generateResumePdf }