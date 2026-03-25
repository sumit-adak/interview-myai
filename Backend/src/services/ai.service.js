const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    title: z.string().describe(
        "The exact job role/title for which the interview analysis is being generated. It should clearly reflect the position (e.g., 'MERN Stack Developer', 'Software Engineer', etc.)."
    ),

    matchScore: z.number().min(0).max(100).describe(
        "An in-depth evaluation score (0–100) representing how well the candidate matches the job requirements. This should consider technical skills, practical experience, project relevance, problem-solving ability, and overall readiness for the role."
    ),

    summary: z.string().describe(
        "A detailed professional summary of the candidate’s overall profile evaluation. It should highlight strengths, key observations, and a final judgment on readiness for the interview in a concise but impactful paragraph."
    ),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A highly relevant and role-specific technical interview question designed to test core concepts, coding ability, or system design knowledge."
            ),
            difficulty: z.enum(["easy", "medium", "hard"]).describe(
                "The difficulty level of the question based on industry interview standards."
            ),
            intention: z.string().describe(
                "A clear explanation of what the interviewer intends to assess, such as fundamentals, real-world application, optimization skills, or debugging ability."
            ),
            expectedAnswer: z.string().describe(
                "A structured and high-quality answer explaining key concepts, step-by-step approach, examples, and best practices that the candidate should include."
            ),
            tips: z.array(z.string()).describe(
                "Practical tips and strategies to help the candidate answer this question confidently and effectively during the interview."
            )
        })
    ).min(3).max(8).describe(
        "A carefully selected list of technical interview questions tailored to the job role, covering a mix of fundamentals, practical problems, and advanced concepts."
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A professional behavioral or situational question aimed at evaluating communication, teamwork, leadership, and decision-making skills."
            ),
            intention: z.string().describe(
                "What the interviewer is trying to understand about the candidate’s personality, mindset, and work behavior."
            ),
            sampleAnswer: z.string().describe(
                "A well-structured sample response using frameworks like STAR (Situation, Task, Action, Result) to guide the candidate."
            ),
            tips: z.array(z.string()).describe(
                "Helpful tips on how to present the answer confidently, including tone, structure, and key points to highlight."
            )
        })
    ).min(2).max(5).describe(
        "A set of behavioral questions designed to assess the candidate’s soft skills and cultural fit within the organization."
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe(
                "The specific missing or weak skill identified in the candidate’s profile."
            ),
            reason: z.string().describe(
                "Explanation of why this skill is important for the job and why the candidate currently lacks it."
            ),
            severity: z.enum(["low", "medium", "high"]).describe(
                "The impact level of this gap on the candidate’s chances of selection."
            ),
            improvementPlan: z.string().describe(
                "A clear and actionable suggestion on how the candidate can improve this skill."
            )
        })
    ).describe(
        "A detailed analysis of gaps between the candidate’s current skills and job requirements, along with actionable improvement guidance."
    ),

    strengths: z.array(z.string()).describe(
        "Key strengths of the candidate that align well with the job role, such as technical expertise, project experience, or problem-solving ability."
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number().describe(
                "Day number in the preparation schedule, starting from Day 1."
            ),
            focus: z.string().describe(
                "The primary topic or area to focus on for the day (e.g., DSA, system design, core concepts, mock interviews)."
            ),
            tasks: z.array(z.string()).describe(
                "A list of clear, actionable tasks for the day, such as solving problems, revising concepts, or practicing interviews."
            ),
            outcome: z.string().describe(
                "The expected result or learning outcome after completing the day’s tasks."
            )
        })
    ).min(5).max(14).describe(
        "A structured, day-by-day preparation roadmap designed to systematically improve the candidate’s chances of cracking the interview."
    ),

    resources: z.array(
        z.object({
            title: z.string().describe("Name of the resource (e.g., article, course, video)."),
            type: z.enum(["article", "video", "course", "practice"]).describe(
                "Type of resource to help categorize learning material."
            ),
            purpose: z.string().describe(
                "Why this resource is useful and what the candidate will learn from it."
            )
        })
    ).optional().describe(
        "Optional but highly recommended learning resources to accelerate preparation."
    )
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