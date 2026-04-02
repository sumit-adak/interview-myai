const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const REPORT_MODEL_CANDIDATES = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
]

const RESUME_MODEL_CANDIDATES = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
]

const STOPWORDS = new Set([
    "the", "and", "for", "with", "from", "that", "this", "you", "your", "are", "job", "role", "have", "has",
    "will", "our", "their", "into", "about", "using", "use", "years", "year", "team", "work", "works", "working"
])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const normalizeError = (error) => (error?.message || "").toString()

const isQuotaError = (error) => {
    const msg = normalizeError(error)
    return msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")
}

const isModelNotFoundError = (error) => {
    const msg = normalizeError(error)
    return msg.includes("not found") || msg.includes("404") || msg.includes("MODEL_NOT_FOUND")
}

const escapeHtml = (value) => {
    if (!value) return ""
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

const clampScore = (value) => {
    const n = Number(value)
    if (!Number.isFinite(n)) return 0
    return Math.max(0, Math.min(100, Math.round(n)))
}

const minify = (value = "", limit = 6000) => String(value).trim().slice(0, limit)

const tokenize = (text = "") => {
    return String(text)
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/)
        .filter(Boolean)
        .filter((w) => w.length > 2)
        .filter((w) => !STOPWORDS.has(w))
}

const unique = (arr = []) => Array.from(new Set(arr.filter(Boolean)))

const extractKeywords = (text = "", max = 24) => unique(tokenize(text)).slice(0, max)

const titleFromJobDescription = (jobDescription = "") => {
    const line = String(jobDescription).split(/\r?\n/).find((l) => l.trim())
    if (!line) return "Interview Report"
    return line.trim().slice(0, 120)
}

const toSentence = (s) => {
    if (!s) return ""
    return String(s).charAt(0).toUpperCase() + String(s).slice(1)
}

const normalizeQuestions = (list, fallbackFactory, minCount) => {
    const safe = Array.isArray(list) ? list : []
    const normalized = safe
        .map((item) => ({
            question: String(item?.question || "").trim(),
            intention: String(item?.intention || "").trim(),
            answer: String(item?.answer || "").trim()
        }))
        .filter((x) => x.question && x.intention && x.answer)

    let idx = 0
    while (normalized.length < minCount) {
        normalized.push(fallbackFactory(idx))
        idx += 1
    }

    return normalized.slice(0, minCount)
}

const normalizeSkillGaps = (list, fallbackKeywords = []) => {
    const incoming = Array.isArray(list) ? list : []
    const validSeverity = new Set(["low", "medium", "high"])

    const normalized = incoming
        .map((item) => ({
            skill: String(item?.skill || "").trim(),
            severity: String(item?.severity || "medium").trim().toLowerCase()
        }))
        .filter((x) => x.skill)
        .map((x) => ({
            skill: x.skill,
            severity: validSeverity.has(x.severity) ? x.severity : "medium"
        }))

    for (const kw of fallbackKeywords) {
        if (normalized.length >= 6) break
        if (!normalized.some((x) => x.skill.toLowerCase() === kw.toLowerCase())) {
            normalized.push({ skill: toSentence(kw), severity: "medium" })
        }
    }

    if (!normalized.length) {
        normalized.push({ skill: "Role-specific domain depth", severity: "medium" })
        normalized.push({ skill: "Advanced system design communication", severity: "medium" })
    }

    return normalized.slice(0, 6)
}

const normalizePreparationPlan = (list) => {
    const incoming = Array.isArray(list) ? list : []
    const normalized = incoming
        .map((item, index) => ({
            day: Number.isFinite(Number(item?.day)) ? Number(item.day) : index + 1,
            focus: String(item?.focus || "").trim(),
            tasks: Array.isArray(item?.tasks)
                ? item.tasks.map((t) => String(t || "").trim()).filter(Boolean)
                : []
        }))
        .filter((x) => x.focus && x.tasks.length)

    const fallback = [
        {
            day: 1,
            focus: "Role mapping and narrative",
            tasks: [
                "Map each JD requirement to one project example",
                "Prepare quantified impact statements"
            ]
        },
        {
            day: 2,
            focus: "Core technical rehearsal",
            tasks: [
                "Revise key frameworks, architecture, and tradeoffs",
                "Practice whiteboard or coding explanations"
            ]
        },
        {
            day: 3,
            focus: "Behavioral and stakeholder communication",
            tasks: [
                "Write STAR stories for ownership, conflict, and leadership",
                "Practice concise communication for cross-functional teams"
            ]
        },
        {
            day: 4,
            focus: "Mock interview",
            tasks: [
                "Run one full mock round",
                "Capture weak points and targeted revision list"
            ]
        }
    ]

    if (!normalized.length) return fallback

    normalized.sort((a, b) => a.day - b.day)
    return normalized.slice(0, 7)
}

const buildFallbackInterviewReport = ({ resume = "", selfDescription = "", jobDescription = "" }) => {
    const jobKeywords = extractKeywords(jobDescription, 28)
    const profileText = `${resume}\n${selfDescription}`.toLowerCase()

    const matched = jobKeywords.filter((kw) => profileText.includes(kw)).length
    const scoreBase = jobKeywords.length ? Math.round((matched / jobKeywords.length) * 100) : 60
    const matchScore = clampScore(Math.max(45, scoreBase))

    const missingKeywords = jobKeywords.filter((kw) => !profileText.includes(kw)).slice(0, 6)

    const title = titleFromJobDescription(jobDescription)

    const technicalQuestions = [
        {
            question: `Explain a production-grade project relevant to ${title} and justify your architecture decisions.`,
            intention: "Assess depth in system design, tradeoff analysis, and ownership.",
            answer: "Walk through requirements, design choices, bottlenecks, scaling strategy, and measurable business impact."
        },
        {
            question: "How do you ensure reliability, observability, and maintainability in your backend/frontend services?",
            intention: "Evaluate engineering maturity and operational thinking.",
            answer: "Discuss monitoring, logging, error handling, testing strategy, deployment safeguards, and rollback plans."
        },
        {
            question: "Describe your approach to performance optimization for an API or UI flow with real user traffic.",
            intention: "Measure practical optimization skills and data-driven decision making.",
            answer: "Mention profiling, root-cause analysis, prioritized fixes, and before/after metrics."
        },
        {
            question: "How do you design secure APIs and handle authentication/authorization at scale?",
            intention: "Assess security fundamentals and real-world implementation strength.",
            answer: "Cover token strategy, validation, encryption, access controls, and abuse prevention."
        },
        {
            question: `Which ${missingKeywords[0] || "advanced"} capability do you plan to strengthen for this role, and how?`,
            intention: "Evaluate learning plan quality and ownership over skill gaps.",
            answer: "Present a concrete upskilling roadmap with timeline, resources, and measurable checkpoints."
        }
    ]

    const behavioralQuestions = [
        {
            question: "Tell me about a time you handled a high-pressure deadline without sacrificing quality.",
            intention: "Assess execution discipline, communication, and prioritization.",
            answer: "Use STAR with clear constraints, decisions, stakeholder communication, and outcome metrics."
        },
        {
            question: "Describe a disagreement with a teammate on technical direction and how you resolved it.",
            intention: "Assess collaboration, conflict resolution, and influence without authority.",
            answer: "Explain context, options considered, evidence used, and final team outcome."
        },
        {
            question: "Share an example where you took ownership beyond your formal role.",
            intention: "Assess leadership potential and initiative.",
            answer: "Highlight problem discovery, proactive action, and measurable business/engineering impact."
        },
        {
            question: "How do you communicate technical tradeoffs to non-technical stakeholders?",
            intention: "Assess clarity and cross-functional communication.",
            answer: "Demonstrate concise framing, risks, alternatives, and decision rationale in plain language."
        }
    ]

    return {
        title,
        matchScore,
        technicalQuestions,
        behavioralQuestions,
        skillGaps: normalizeSkillGaps([], missingKeywords),
        preparationPlan: normalizePreparationPlan([])
    }
}

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),
    title: z.string()
})

const normalizeReportPayload = (raw, context) => {
    const jobKeywords = extractKeywords(context.jobDescription || "", 20)

    const title = String(raw?.title || "").trim() || titleFromJobDescription(context.jobDescription)
    const matchScore = clampScore(raw?.matchScore)

    const technicalQuestions = normalizeQuestions(
        raw?.technicalQuestions,
        (idx) => ({
            question: `Technical deep-dive question ${idx + 1} for ${title}`,
            intention: "Assess practical technical strength for this role.",
            answer: "Answer with architecture, tradeoffs, and measurable impact."
        }),
        5
    )

    const behavioralQuestions = normalizeQuestions(
        raw?.behavioralQuestions,
        (idx) => ({
            question: `Behavioral ownership question ${idx + 1}`,
            intention: "Assess communication and execution behaviors.",
            answer: "Use STAR format with measurable outcome and lessons learned."
        }),
        4
    )

    const skillGaps = normalizeSkillGaps(raw?.skillGaps, jobKeywords)
    const preparationPlan = normalizePreparationPlan(raw?.preparationPlan)

    return {
        title,
        matchScore,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interview coach.
Create a high-quality interview preparation report in strict JSON.

Rules:
- Return ONLY valid JSON object matching schema.
- Keep language precise and professional.
- technicalQuestions must contain exactly 5 items.
- behavioralQuestions must contain exactly 4 items.
- skillGaps should contain 4 to 6 items with severity low|medium|high.
- preparationPlan should contain 4 to 7 day-wise items.
- title should be specific to the target role.

Candidate Inputs:
Resume: ${minify(resume)}
Self Description: ${minify(selfDescription)}
Job Description: ${minify(jobDescription)}
`

    let lastError

    for (const model of REPORT_MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt += 1) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(interviewReportSchema),
                        maxOutputTokens: 2500,
                        temperature: 0.5
                    }
                })

                if (!response?.text) {
                    throw new Error("AI returned an empty response")
                }

                const parsed = JSON.parse(response.text)
                return normalizeReportPayload(parsed, { resume, selfDescription, jobDescription })
            } catch (error) {
                lastError = error

                if (isQuotaError(error) && attempt < 2) {
                    await sleep(1200 * attempt)
                    continue
                }

                if (isModelNotFoundError(error)) {
                    break
                }

                if (!isQuotaError(error)) {
                    break
                }
            }
        }
    }

    if (isQuotaError(lastError)) {
        return buildFallbackInterviewReport({ resume, selfDescription, jobDescription })
    }

    if (isModelNotFoundError(lastError)) {
        throw new Error("AI model not found. Please contact support.")
    }

    if (lastError) {
        throw lastError
    }

    return buildFallbackInterviewReport({ resume, selfDescription, jobDescription })
}

const resumePdfSchema = z.object({
    html: z.string()
})

const splitLines = (text = "") => String(text).split(/\r?\n/).map((x) => x.trim()).filter(Boolean)

const parseProfile = ({ resume = "", selfDescription = "", jobDescription = "" }) => {
    const source = `${resume}\n${selfDescription}`
    const lines = splitLines(source)

    const name = lines[0] || "Candidate Name"
    const roleHint = titleFromJobDescription(jobDescription)

    const email = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0] || "email@example.com"
    const phone = source.match(/(\+?\d[\d\s\-()]{7,}\d)/)?.[0] || "+91 00000 00000"

    const github = source.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+/i)?.[0] || "github.com/username"
    const linkedin = source.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w\/-]+/i)?.[0] || "linkedin.com/in/username"

    const skillsFromSource = unique(
        source
            .split(/[\n,|]+/)
            .map((x) => x.trim())
            .filter((x) => x.length >= 2 && x.length <= 40)
            .filter((x) => /[a-zA-Z]/.test(x))
    ).slice(0, 14)

    const jdSkills = extractKeywords(jobDescription, 18).map(toSentence)

    const skills = unique([...skillsFromSource, ...jdSkills]).slice(0, 14)

    const summary = minify(
        selfDescription || resume || `Professional with strong interest in ${roleHint} and building reliable, scalable solutions.`,
        700
    )

    const achievementLines = lines
        .filter((line) => /\b(built|developed|implemented|improved|optimized|led|designed|created|deployed|reduced|increased)\b/i.test(line))
        .slice(0, 6)

    const projects = achievementLines.length
        ? achievementLines
        : [
            "Built and maintained production-ready features with clean architecture and measurable impact.",
            "Collaborated across teams to deliver reliable releases on deadlines."
        ]

    const educationLines = lines
        .filter((line) => /\b(B\.Tech|M\.Tech|BCA|MCA|Bachelor|Master|University|College|School|Degree)\b/i.test(line))
        .slice(0, 3)

    const education = educationLines.length ? educationLines : ["Bachelor's degree details to be added"]

    return {
        name,
        roleHint,
        email,
        phone,
        github,
        linkedin,
        summary,
        skills,
        projects,
        education
    }
}

const buildAtsFallbackResumeHtml = ({ resume, selfDescription, jobDescription }) => {
    const profile = parseProfile({ resume, selfDescription, jobDescription })

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(profile.name)} Resume</title>
  <style>
    :root {
      --text: #111827;
      --muted: #4b5563;
      --line: #cbd5e1;
      --soft: #f8fafc;
      --accent: #0f172a;
      --primary: #1e3a8a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--text);
      font-family: "Helvetica Neue", "Arial", sans-serif;
      line-height: 1.4;
      background: #ffffff;
      font-size: 11pt;
    }
    .page {
      width: 210mm;
      margin: 0 auto;
      padding: 12mm 13mm;
      border: 1px solid var(--line);
      min-height: 297mm;
      background: #fff;
    }
    .header {
      border-bottom: 2px solid var(--accent);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .name {
      font-size: 26pt;
      font-weight: 700;
      letter-spacing: 0.1px;
      color: var(--accent);
      margin: 0;
      line-height: 1.15;
    }
    .title {
      font-size: 12.5pt;
      font-weight: 600;
      color: var(--primary);
      margin: 4px 0 8px 0;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      font-size: 10pt;
      color: var(--muted);
    }
    .section {
      margin-top: 12px;
      border: 1px solid var(--line);
      padding: 8px 10px 9px;
      border-radius: 4px;
      background: var(--soft);
    }
    h2 {
      font-size: 10.5pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 6px 0;
      color: var(--accent);
      border-bottom: 1px solid var(--line);
      padding-bottom: 4px;
    }
    p {
      margin: 0;
      color: var(--text);
      line-height: 1.5;
      white-space: pre-wrap;
    }
    ul {
      margin: 4px 0 0 18px;
      padding: 0;
    }
    li {
      margin: 2px 0;
      color: var(--text);
      line-height: 1.45;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }
    .chip {
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      color: #1e3a8a;
      padding: 3px 7px;
      border-radius: 999px;
      font-size: 9.6pt;
      font-weight: 600;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 12px;
    }
    @media print {
      body { background: #fff; }
      .page { border: 1px solid var(--line); }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <h1 class="name">${escapeHtml(profile.name)}</h1>
      <p class="title">${escapeHtml(profile.roleHint)}</p>
      <div class="contact-grid">
        <div><strong>Email:</strong> ${escapeHtml(profile.email)}</div>
        <div><strong>Phone:</strong> ${escapeHtml(profile.phone)}</div>
        <div><strong>LinkedIn:</strong> ${escapeHtml(profile.linkedin)}</div>
        <div><strong>GitHub:</strong> ${escapeHtml(profile.github)}</div>
      </div>
    </header>

    <section class="section">
      <h2>Professional Summary</h2>
      <p>${escapeHtml(profile.summary)}</p>
    </section>

    <section class="section">
      <h2>Core Skills</h2>
      <div class="chips">
        ${profile.skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("")}
      </div>
    </section>

    <div class="two-col">
      <section class="section">
        <h2>Professional Experience</h2>
        <ul>
          ${profile.projects.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>

      <section class="section">
        <h2>Projects</h2>
        <ul>
          ${profile.projects.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    </div>

    <div class="two-col">
      <section class="section">
        <h2>Education</h2>
        <ul>
          ${profile.education.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>

      <section class="section">
        <h2>Certifications</h2>
        <ul>
          <li>Add certifications relevant to ${escapeHtml(profile.roleHint)} (cloud, backend, frontend, testing, security).</li>
        </ul>
      </section>
    </div>
  </main>
</body>
</html>`
}

const parseHtmlFromText = (text = "") => {
    if (!text || typeof text !== "string") return ""
    const trimmed = text.trim()

    const htmlStart = trimmed.search(/<!doctype html|<html/i)
    if (htmlStart >= 0) {
        const htmlChunk = trimmed.slice(htmlStart)
        const htmlEnd = htmlChunk.toLowerCase().lastIndexOf("</html>")
        if (htmlEnd >= 0) {
            return htmlChunk.slice(0, htmlEnd + 7)
        }
        return htmlChunk
    }

    if (trimmed.startsWith("```")) {
        const codeMatch = trimmed.match(/```(?:html|json)?\n?([\s\S]*?)```/i)
        if (codeMatch?.[1]) {
            return parseHtmlFromText(codeMatch[1])
        }
    }

    if (/<html[\s\S]*<\/html>/i.test(trimmed)) {
        return trimmed.match(/<html[\s\S]*<\/html>/i)?.[0] || ""
    }

    try {
        const asJson = JSON.parse(trimmed)
        if (typeof asJson?.html === "string") {
            return asJson.html
        }
    } catch (e) {
        // continue
    }

    const htmlFieldMatch = trimmed.match(/\"html\"\s*:\s*\"([\s\S]*?)\"\s*\}?$/i)
    if (htmlFieldMatch?.[1]) {
        try {
            return JSON.parse(`"${htmlFieldMatch[1]}"`)
        } catch (e) {
            return htmlFieldMatch[1]
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\\"/g, '"')
                .replace(/\\\\/g, "\\")
        }
    }

    return trimmed
}

const normalizeHtmlDocument = (html = "") => {
    const value = String(html || "").trim()
    if (!value) return ""

    if (/<html[\s\S]*<\/html>/i.test(value)) {
        return value
    }

    if (/<body[\s\S]*<\/body>/i.test(value)) {
        return `<!doctype html><html><head><meta charset="utf-8" /></head>${value}</html>`
    }

    return `<!doctype html><html><head><meta charset="utf-8" /></head><body>${value}</body></html>`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const candidateData = [
        jobDescription && `Job Description:\n${jobDescription}`,
        resume && `Resume Text:\n${resume}`,
        selfDescription && `Self Description:\n${selfDescription}`
    ].filter(Boolean).join("\n\n") || "No input data provided."

    const prompt = `You are a senior resume writer and ATS specialist.
Generate a polished ATS-friendly one-page resume in clean semantic HTML.

Rules:
- Return ONLY JSON with key: html
- html must be complete document: <!doctype html><html>...</html>
- Use a professional, readable, ATS-compliant layout.
- Include sections: Name, Title, Contact, Summary, Skills, Experience, Projects, Education, Certifications.
- Prefer concise bullet points with impact and relevant keywords.
- Do not wrap output in markdown fences.

Candidate input:\n${minify(candidateData, 9000)}
`

    let lastError

    for (const model of RESUME_MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt += 1) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(resumePdfSchema),
                        maxOutputTokens: 3500,
                        temperature: 0.4
                    }
                })

                const parsedHtml = parseHtmlFromText(response?.text || "")
                const normalized = normalizeHtmlDocument(parsedHtml)
                if (normalized && normalized.length > 120) {
                    return normalized
                }

                throw new Error("Invalid resume HTML generated")
            } catch (error) {
                lastError = error

                if (isQuotaError(error) && attempt < 2) {
                    await sleep(1000 * attempt)
                    continue
                }

                if (isModelNotFoundError(error)) {
                    break
                }

                if (!isQuotaError(error)) {
                    break
                }
            }
        }
    }

    if (lastError) {
        console.warn("Falling back to deterministic ATS resume template due to AI generation issue:", normalizeError(lastError))
    }

    return buildAtsFallbackResumeHtml({ resume, selfDescription, jobDescription })
}

module.exports = { generateInterviewReport, generateResumePdf }
