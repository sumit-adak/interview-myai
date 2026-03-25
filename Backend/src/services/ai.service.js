const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe(
        "A precise evaluation score ranging from 0 to 100 that measures how effectively the candidate’s profile aligns with the job description. This score should consider technical expertise, relevant experience, project exposure, problem-solving ability, and overall job readiness."
    ),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A well-crafted, role-specific technical interview question designed to assess the candidate’s understanding of core concepts, practical implementation skills, and problem-solving capability."
            ),
            intention: z.string().describe(
                "A clear and detailed explanation of the interviewer’s objective behind asking this question, such as evaluating conceptual clarity, coding proficiency, analytical thinking, or real-world application of knowledge."
            ),
            answer: z.string().describe(
                "A structured and comprehensive guide on how the candidate should answer the question, including key concepts, logical approach, step-by-step explanation, and best practices to demonstrate strong technical understanding."
            )
        })
    ).describe(
        "A curated set of relevant technical interview questions tailored to the job role, along with their underlying purpose and ideal answering approach to help the candidate prepare effectively."
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A professional behavioral or situational interview question aimed at evaluating the candidate’s communication skills, teamwork, adaptability, leadership qualities, and decision-making ability."
            ),
            intention: z.string().describe(
                "A detailed explanation of what the interviewer intends to assess regarding the candidate’s personality, work ethic, past experiences, and ability to handle real-world workplace situations."
            ),
            answer: z.string().describe(
                "A well-structured guideline for answering the question effectively, ideally using frameworks like the STAR method (Situation, Task, Action, Result), highlighting clarity, impact, and relevance."
            )
        })
    ).describe(
        "A set of behavioral interview questions designed to assess the candidate’s soft skills, interpersonal abilities, and overall cultural fit within the organization."
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe(
                "The specific skill, technology, or knowledge area where the candidate shows a gap or lacks sufficient proficiency in relation to the job requirements."
            ),
            severity: z.enum(["low", "medium", "high"]).describe(
                "The level of importance of this skill gap, indicating how significantly it may impact the candidate’s chances of selection for the role."
            )
        })
    ).describe(
        "A detailed identification of missing or weak skills in the candidate’s profile, categorized by their impact level on overall job suitability."
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number().describe(
                "The sequential day number in the preparation schedule, starting from Day 1, representing a structured learning timeline."
            ),
            focus: z.string().describe(
                "The primary topic or area of concentration for the day, such as data structures, system design, core fundamentals, or interview practice."
            ),
            tasks: z.array(z.string()).describe(
                "A list of clearly defined, actionable tasks to be completed on the given day, such as studying concepts, solving problems, or practicing mock interviews."
            )
        })
    ).describe(
        "A structured, day-wise preparation roadmap designed to systematically improve the candidate’s knowledge, skills, and interview readiness."
    ),

    title: z.string().describe(
        "The exact job title or role for which this interview report and analysis is being generated."
    ),
});

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