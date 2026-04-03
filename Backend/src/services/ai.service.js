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

const CATEGORY_KEYWORDS = {
    languages: ["javascript", "typescript", "java", "python", "c++", "c#", "go", "php", "ruby", "html", "css", "sql"],
    frontend: ["react", "next.js", "next", "redux", "tailwind", "scss", "sass", "bootstrap", "vite", "webpack"],
    backend: ["node", "node.js", "express", "nestjs", "rest api", "graphql", "microservices", "jwt", "spring", "django"],
    database: ["mongodb", "mysql", "postgresql", "postgres", "redis", "firebase", "dynamodb", "sqlite"],
    tools: ["git", "github", "gitlab", "postman", "docker", "aws", "vercel", "render", "netlify", "jest", "ci/cd"]
}

const includesKeyword = (value = "", keyword = "") => value.toLowerCase().includes(keyword.toLowerCase())

const categorizeSkills = (skills = [], jobDescription = "") => {
    const normalizedSkills = unique([...skills, ...extractKeywords(jobDescription, 20).map(toSentence)])
    const buckets = {
        languages: [],
        frontend: [],
        backend: [],
        database: [],
        tools: []
    }

    for (const skill of normalizedSkills) {
        const normalized = String(skill || "").trim()
        if (!normalized) continue

        let matchedCategory = null
        for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
            if (keywords.some((keyword) => includesKeyword(normalized, keyword))) {
                matchedCategory = category
                break
            }
        }

        if (matchedCategory) {
            buckets[matchedCategory].push(normalized)
        } else {
            buckets.tools.push(normalized)
        }
    }

    return Object.fromEntries(
        Object.entries(buckets).map(([category, values]) => [category, unique(values).slice(0, 8)])
    )
}

const summarizeToBullets = (text = "", max = 4) => {
    return splitLines(text)
        .filter((line) => line.length > 20)
        .slice(0, max)
        .map((line) => {
            const normalized = line.replace(/^[•\-\d.)\s]+/, "").trim()
            if (!normalized) return ""
            return /^[A-Z][a-z]+ed\b/.test(normalized)
                ? normalized
                : `Built ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`
        })
        .filter(Boolean)
}

const extractEducationEntries = (lines = []) => {
    return lines
        .filter((line) => /\b(B\.Tech|M\.Tech|BCA|MCA|Bachelor|Master|University|College|Institute|School|Degree)\b/i.test(line))
        .slice(0, 3)
}

const extractAchievementEntries = (lines = []) => {
    return lines
        .filter((line) => /\b(certified|certification|award|achievement|winner|rank|scholarship)\b/i.test(line))
        .slice(0, 4)
}

const inferLocation = (source = "") => {
    const locationMatch = source.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/)
    return locationMatch?.[1] || "India"
}

const parseProfile = ({ resume = "", selfDescription = "", jobDescription = "" }) => {
    const source = `${resume}\n${selfDescription}`
    const lines = splitLines(source)

    const name = lines[0] || "Candidate Name"
    const roleHint = titleFromJobDescription(jobDescription)

    const email = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0] || "email@example.com"
    const phone = source.match(/(\+?\d[\d\s\-()]{7,}\d)/)?.[0] || "+91 00000 00000"

    const github = source.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+/i)?.[0] || "github.com/username"
    const linkedin = source.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w\/-]+/i)?.[0] || "linkedin.com/in/username"
    const location = inferLocation(source)

    const skillsFromSource = unique(
        source
            .split(/[\n,|]+/)
            .map((x) => x.trim())
            .filter((x) => x.length >= 2 && x.length <= 40)
            .filter((x) => /[a-zA-Z]/.test(x))
    ).slice(0, 14)

    const jdSkills = extractKeywords(jobDescription, 18).map(toSentence)

    const skills = unique([...skillsFromSource, ...jdSkills]).slice(0, 14)
    const categorizedSkills = categorizeSkills(skills, jobDescription)

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

    const educationLines = extractEducationEntries(lines)

    const education = educationLines.length ? educationLines : ["Bachelor's degree details to be added"]
    const achievements = extractAchievementEntries(lines)
    const experience = summarizeToBullets(selfDescription || resume, 4)

    return {
        name,
        roleHint,
        location,
        email,
        phone,
        github,
        linkedin,
        summary,
        skills,
        categorizedSkills,
        projects,
        education,
        experience,
        achievements
    }
}

const buildAtsFallbackResumeHtml = ({ resume, selfDescription, jobDescription }) => {
    const profile = parseProfile({ resume, selfDescription, jobDescription })
    const skillSections = [
        ["Languages", profile.categorizedSkills.languages],
        ["Frontend", profile.categorizedSkills.frontend],
        ["Backend", profile.categorizedSkills.backend],
        ["Database", profile.categorizedSkills.database],
        ["Tools", profile.categorizedSkills.tools]
    ].filter(([, items]) => items.length)

    const projectItems = profile.projects.slice(0, 4).map((item, index) => ({
        title: index === 0 ? "AI Interview Preparation System" : `Project ${index + 1}`,
        bullets: [
            item,
            `Implemented ${profile.roleHint.toLowerCase()} workflows with ATS-friendly formatting and reliable API integration.`,
            `Optimized usability with clean UI structure, concise content hierarchy, and measurable delivery focus.`
        ].slice(0, 3)
    }))

    const experienceItems = profile.experience.length
        ? [{
            title: profile.roleHint,
            company: "Independent / Academic Experience",
            bullets: profile.experience
        }]
        : []

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(profile.name)} Resume</title>
  <style>
    :root {
      --text: #1f2937;
      --muted: #4b5563;
      --line: #d1d5db;
      --heading: #111827;
      --accent: #374151;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
      background: #ffffff;
      font-size: 11pt;
    }
    .resume-document {
      width: 190mm;
      margin: 0 auto;
      padding: 10mm 0 8mm;
      background: #fff;
    }
    .header {
      border-bottom: 1.5px solid var(--heading);
      padding-bottom: 8mm;
      margin-bottom: 7mm;
    }
    .name {
      font-size: 24pt;
      font-weight: 700;
      letter-spacing: 0.2px;
      color: var(--heading);
      margin: 0;
      line-height: 1.15;
    }
    .title {
      font-size: 12.5pt;
      font-weight: 600;
      color: var(--accent);
      margin: 3mm 0 4mm 0;
    }
    .contact-line {
      margin: 0 0 2mm 0;
      font-size: 10pt;
      color: var(--muted);
    }
    .section {
      margin-top: 0;
      padding-top: 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section + .section {
      margin-top: 6mm;
    }
    h2.section-title {
      font-size: 11.5pt;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      margin: 0 0 2.5mm 0;
      color: var(--heading);
      border-bottom: 1px solid var(--line);
      padding-bottom: 1.6mm;
    }
    p {
      margin: 0;
      color: var(--text);
      line-height: 1.5;
      white-space: pre-wrap;
    }
    ul {
      margin: 2.5mm 0 0 4.5mm;
      padding: 0;
    }
    li {
      margin: 0 0 1.6mm 0;
      color: var(--text);
      line-height: 1.45;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .skills-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1mm;
    }
    .skills-table td {
      vertical-align: top;
      padding: 1.4mm 0;
      border-bottom: 1px solid #eceff3;
    }
    .skills-table tr:last-child td {
      border-bottom: 0;
    }
    .skill-label {
      width: 34mm;
      font-weight: 700;
      color: var(--heading);
      padding-right: 4mm;
    }
    .entry {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 4mm;
    }
    .entry:last-child {
      margin-bottom: 0;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      gap: 8mm;
      align-items: baseline;
      margin-bottom: 1mm;
    }
    .entry-title {
      font-weight: 700;
      color: var(--heading);
    }
    .entry-subtitle {
      font-size: 10pt;
      color: var(--muted);
    }
    .summary {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      .resume-document {
        width: auto;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <main class="resume-document">
    <header class="header">
      <h1 class="name">${escapeHtml(profile.name)}</h1>
      <p class="title">${escapeHtml(profile.roleHint)}</p>
      <p class="contact-line">${escapeHtml(profile.location)} | ${escapeHtml(profile.email)} | ${escapeHtml(profile.phone)}</p>
      <p class="contact-line">GitHub: ${escapeHtml(profile.github)} | LinkedIn: ${escapeHtml(profile.linkedin)}</p>
    </header>

    <section class="section summary">
      <h2 class="section-title">Professional Summary</h2>
      <p>${escapeHtml(profile.summary)}</p>
    </section>

    <section class="section">
      <h2 class="section-title">Technical Skills</h2>
      <table class="skills-table">
        <tbody>
          ${skillSections.map(([label, items]) => `
            <tr>
              <td class="skill-label">${escapeHtml(label)}</td>
              <td>${escapeHtml(items.join(", "))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>

    ${experienceItems.length ? `
      <section class="section">
        <h2 class="section-title">Experience</h2>
        ${experienceItems.map((item) => `
          <article class="entry">
            <div class="entry-header">
              <div class="entry-title">${escapeHtml(item.title)}</div>
              <div class="entry-subtitle">${escapeHtml(item.company)}</div>
            </div>
            <ul>
              ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </section>
    ` : ""}

    <section class="section">
      <h2 class="section-title">Projects</h2>
      ${projectItems.map((project) => `
        <article class="entry">
          <div class="entry-header">
            <div class="entry-title">${escapeHtml(project.title)}</div>
            <div class="entry-subtitle">${escapeHtml(profile.roleHint)}</div>
          </div>
          <ul>
            ${project.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}
    </section>

    <section class="section">
      <h2 class="section-title">Education</h2>
      ${profile.education.map((item) => `
        <article class="entry">
          <div class="entry-title">${escapeHtml(item)}</div>
        </article>
      `).join("")}
    </section>

    ${profile.achievements.length ? `
      <section class="section">
        <h2 class="section-title">Achievements & Certifications</h2>
        <ul>
          ${profile.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    ` : ""}
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
- Use a professional, readable, ATS-compliant layout with Arial, Helvetica, or Calibri.
- Include sections only when they have real content: Header, Professional Summary, Technical Skills, Projects, Education, Experience, Achievements/Certifications.
- Use concise bullet points with action verbs and role-relevant keywords.
- Fit cleanly on A4 pages with natural multi-page flow when needed.
- Do not use fixed page heights, oversized containers, or styles that can create blank pages.
- Prevent awkward splits by using CSS rules like page-break-inside: avoid / break-inside: avoid for sections and entries.
- Keep margins, spacing, and heading styles consistent across all pages.
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
