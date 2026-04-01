const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

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

    const minify = (value = "") => value.toString().trim().slice(0, 5000)

    const prompt = `Generate an interview report for the candidate. Format output strictly as JSON matching the schema:
- matchScore (number 0-100)
- technicalQuestions (array)
- behavioralQuestions (array)
- skillGaps (array)
- preparationPlan (array)
- title (string)

Use the following data:
Resume: ${minify(resume)}
Self Description: ${minify(selfDescription)}
Job Description: ${minify(jobDescription)}

The report should be concise, action-oriented, and ready to use for interview preparation.`

    let response
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
                maxOutputTokens: 4096
            }
        })
    } catch (aiError) {
        const msg = aiError?.message || ""
        if (msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
            throw new Error("AI quota exceeded. Please try again later or check your Google AI API plan.")
        }
        if (msg.includes("not found") || msg.includes("404") || msg.includes("MODEL_NOT_FOUND")) {
            throw new Error("AI model not found. Please contact support.")
        }
        throw aiError
    }

    if (!response?.text) {
        throw new Error("AI returned an empty response. Please try again.")
    }

    let parsed
    try {
        parsed = JSON.parse(response.text)
    } catch (parseErr) {
        console.error("Failed to parse AI JSON response:", response.text?.slice(0, 500))
        throw new Error("AI returned malformed data. Please try again.")
    }

    return parsed


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

const generateFallbackResumeHtml = ({ resume, selfDescription, jobDescription }) => {
    const summary = (selfDescription || resume || "").trim().slice(0, 600) || "Experienced professional with strong interview preparation and industry knowledge."

    const extractSection = (text, label) => {
        if (!text) return []
        const regex = new RegExp(`${label}[:\\n]+([\\s\\S]*?)(?:\\n{2,}|$)`, "i")
        const match = text.match(regex)
        if (!match) return []
        return match[1].split(/[\\n,]+/).map(item => item.replace(/-|•/g, '').trim()).filter(Boolean).slice(0, 10)
    }

    const skills = extractSection(resume || selfDescription, "skills")
    const experience = extractSection(resume || selfDescription, "experience")
    const education = extractSection(resume || selfDescription, "education")

    return `<!doctype html><html><head><meta charset='utf-8'><style>
        :root { --primary: #2563eb; --text-main: #1f2937; --text-muted: #6b7280; --border: #e5e7eb; --bg: #ffffff; }
        body { margin: 0; background: #f3f4f6; }
        .resume-wrapper { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--text-main); background: var(--bg); line-height: 1.6; padding: 48px; max-width: 850px; margin: 40px auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .resume-wrapper header { border-bottom: 2px solid var(--primary); padding-bottom: 24px; margin-bottom: 32px; text-align: center; }
        .resume-wrapper header h1 { font-size: 36px; margin: 0 0 8px 0; color: #111827; letter-spacing: -0.5px; }
        .resume-wrapper header p { color: var(--text-muted); font-size: 15px; margin: 0; }
        .resume-wrapper section { margin-bottom: 32px; }
        .resume-wrapper section h2 { font-size: 20px; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        .resume-wrapper .summary { font-size: 16px; color: #4b5563; }
        .resume-wrapper ul.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .resume-wrapper ul.list li { position: relative; padding-left: 20px; color: #374151; }
        .resume-wrapper ul.list li::before { content: "•"; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
        .resume-wrapper .skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .resume-wrapper .skills-grid span { background: #eff6ff; color: var(--primary); padding: 6px 14px; border-radius: 99px; font-size: 14px; font-weight: 500; border: 1px solid #bfdbfe; }
    </style></head><body>
    <div class="resume-wrapper">
        <header>
            <h1>Candidate Resume</h1>
            <p>Auto-generated from candidate input</p>
        </header>

        <section>
            <h2>Professional Summary</h2>
            <div class="summary">${escapeHtml(summary)}</div>
        </section>

        <section>
            <h2>Top Skills</h2>
            <div class="skills-grid">
                ${(skills.length ? skills : ["Communication", "Problem Solving"]).map(s => `<span>${escapeHtml(s)}</span>`).join("")}
            </div>
        </section>

        <section>
            <h2>Experience Highlights</h2>
            <ul class="list">
                ${(experience.length ? experience : ["Demonstrated strong capability in relevant field.", "Worked effectively in team environments."]).map(s => `<li>${escapeHtml(s)}</li>`).join("")}
            </ul>
        </section>

        <section>
            <h2>Education Details</h2>
            <ul class="list">
                ${(education.length ? education : ["Degree / Certification details to be verified."]).map(s => `<li>${escapeHtml(s)}</li>`).join("")}
            </ul>
        </section>

        <section>
            <h2>Target Role</h2>
            <p class="summary">${escapeHtml(jobDescription || "General Application")}</p>
        </section>
    </div>
</body></html>`
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

    const prompt = `Generate a professional, highly aesthetic, ATS-friendly resume in HTML from the following candidate data. Use inline CSS only, and avoid external stylesheets.
- Require sections: Name, Title, Summary, Skills, Experience, Education, Certifications, Projects, Contact.
- Ensure the design is modern, clean, and uses a visually appealing color palette (e.g., dark slate/navy text, soft grey backgrounds, subtle borders).
- Prefer a concise 1-2 page layout. Use flexbox/grid for structuring layout internally.
- If values are missing, infer naturally from the candidate data but don't invent unrelated experiences.
- Use the resume text and self-description as the primary source of truth.
- Preserve key dates, tech stack, achievements.
- Output must be JSON with a single field named "html" containing the full, valid template HTML.

Candidate input data:\n${candidateData}`

    let htmlOutput = ""

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
                maxOutputTokens: 4096
            }
        })

        // Attempt JSON parse of official schema response
        let jsonContent
        try {
            jsonContent = JSON.parse(response.text)
        } catch (parseError) {
            console.warn("Resume generation response parse failed, trying to salvage HTML from body", parseError)
        }

        if (jsonContent?.html) {
            htmlOutput = jsonContent.html
        } else {
            // Look for markdown fenced html or raw html in string
            const codeBlockMatch = response.text.match(/```(?:html\n)?([\s\S]*?)```/i)
            const rawHtmlMatch = response.text.match(/<html[\s\S]*<\/html>/i)

            if (codeBlockMatch && codeBlockMatch[1]) htmlOutput = codeBlockMatch[1]
            else if (rawHtmlMatch && rawHtmlMatch[0]) htmlOutput = rawHtmlMatch[0]
            else if (typeof response.text === 'string') htmlOutput = response.text
        }

    } catch (error) {
        console.error("Error generating resume HTML from AI response:", error)
    }

    if (!htmlOutput || typeof htmlOutput !== 'string' || !htmlOutput.trim()) {
        htmlOutput = generateFallbackResumeHtml({ resume, selfDescription, jobDescription })
    }

    return htmlOutput

}

module.exports = { generateInterviewReport, generateResumePdf }