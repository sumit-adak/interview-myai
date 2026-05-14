const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

// ── Single AI client ────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })

// ── Shared model fallback chain (single source of truth) ────────────
const MODEL_CANDIDATES = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
]

// ── Utility helpers ─────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const normalizeError = (err) => String(err?.message || "")

const isQuotaError = (err) => {
    const m = normalizeError(err)
    return m.includes("quota") || m.includes("429") || m.includes("RESOURCE_EXHAUSTED")
}

const isModelNotFoundError = (err) => {
    const m = normalizeError(err)
    return m.includes("not found") || m.includes("404") || m.includes("MODEL_NOT_FOUND")
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)))

const trim = (v, limit = 6000) => String(v || "").trim().slice(0, limit)

const escapeHtml = (v) => {
    if (!v) return ""
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

const unique = (arr) => [...new Set((arr || []).filter(Boolean))]

const titleFromJD = (jd = "") => {
    const line = String(jd).split(/\r?\n/).find((l) => l.trim())
    return line ? line.trim().slice(0, 120) : "Interview Report"
}

const toSentence = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : "")

// ── Unified retry runner ────────────────────────────────────────────
// Eliminates the duplicated retry+fallback loop from both generators
async function callWithFallback({ prompt, schema, maxTokens, temperature, onFallback }) {
    let lastError

    for (const model of MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const res = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(schema),
                        maxOutputTokens: maxTokens,
                        temperature
                    }
                })

                if (!res?.text) throw new Error("AI returned empty response")
                return JSON.parse(res.text)
            } catch (err) {
                lastError = err
                if (isQuotaError(err) && attempt < 2) { await sleep(1200 * attempt); continue }
                if (isModelNotFoundError(err) || !isQuotaError(err)) break
            }
        }
    }

    // If all models exhausted, use deterministic fallback
    if (isQuotaError(lastError) || !lastError) return onFallback()
    if (isModelNotFoundError(lastError)) throw new Error("AI model not found. Please contact support.")
    throw lastError
}

// ── Keyword extraction (lightweight, no stopword list needed) ───────
const extractKeywords = (text = "", max = 20) => {
    return unique(
        String(text).toLowerCase()
            .split(/[^a-z0-9+#.]+/)
            .filter((w) => w.length > 2)
    ).slice(0, max)
}

// ══════════════════════════════════════════════════════════════════════
//  INTERVIEW REPORT
// ══════════════════════════════════════════════════════════════════════

const reportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
    behavioralQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
    skillGaps: z.array(z.object({ skill: z.string(), severity: z.enum(["low", "medium", "high"]) })),
    preparationPlan: z.array(z.object({ day: z.number(), focus: z.string(), tasks: z.array(z.string()) })),
    title: z.string()
})

// ── Normalizers ─────────────────────────────────────────────────────
function normalizeQuestions(list, fallbackFn, count) {
    const out = (Array.isArray(list) ? list : [])
        .map((i) => ({
            question: String(i?.question || "").trim(),
            intention: String(i?.intention || "").trim(),
            answer: String(i?.answer || "").trim()
        }))
        .filter((x) => x.question && x.intention && x.answer)

    for (let idx = 0; out.length < count; idx++) out.push(fallbackFn(idx))
    return out.slice(0, count)
}

function normalizeSkillGaps(list, fallbackKws = []) {
    const valid = new Set(["low", "medium", "high"])
    const out = (Array.isArray(list) ? list : [])
        .map((i) => ({ skill: String(i?.skill || "").trim(), severity: String(i?.severity || "medium").toLowerCase() }))
        .filter((x) => x.skill)
        .map((x) => ({ skill: x.skill, severity: valid.has(x.severity) ? x.severity : "medium" }))

    for (const kw of fallbackKws) {
        if (out.length >= 6) break
        if (!out.some((x) => x.skill.toLowerCase() === kw.toLowerCase())) {
            out.push({ skill: toSentence(kw), severity: "medium" })
        }
    }
    if (!out.length) out.push({ skill: "Role-specific domain depth", severity: "medium" })
    return out.slice(0, 6)
}

function normalizePrepPlan(list) {
    const out = (Array.isArray(list) ? list : [])
        .map((i, idx) => ({
            day: Number.isFinite(Number(i?.day)) ? Number(i.day) : idx + 1,
            focus: String(i?.focus || "").trim(),
            tasks: Array.isArray(i?.tasks) ? i.tasks.map((t) => String(t || "").trim()).filter(Boolean) : []
        }))
        .filter((x) => x.focus && x.tasks.length)

    if (!out.length) {
        return [
            { day: 1, focus: "Role mapping and narrative", tasks: ["Map JD requirements to project examples", "Prepare quantified impact statements"] },
            { day: 2, focus: "Core technical rehearsal", tasks: ["Revise key frameworks and architecture tradeoffs", "Practice coding explanations"] },
            { day: 3, focus: "Behavioral preparation", tasks: ["Write STAR stories for ownership, conflict, leadership", "Practice concise stakeholder communication"] },
            { day: 4, focus: "Mock interview", tasks: ["Run one full mock round", "Capture weak points and revision list"] }
        ]
    }
    return out.sort((a, b) => a.day - b.day).slice(0, 7)
}

function normalizeReport(raw, ctx) {
    const kws = extractKeywords(ctx.jobDescription, 20)
    const title = String(raw?.title || "").trim() || titleFromJD(ctx.jobDescription)
    return {
        title,
        matchScore: clamp(raw?.matchScore, 0, 100),
        technicalQuestions: normalizeQuestions(
            raw?.technicalQuestions,
            (i) => ({ question: `Technical question ${i + 1} for ${title}`, intention: "Assess practical strength.", answer: "Answer with architecture, tradeoffs, and impact." }),
            10
        ),
        behavioralQuestions: normalizeQuestions(
            raw?.behavioralQuestions,
            (i) => ({ question: `Behavioral question ${i + 1}`, intention: "Assess communication and execution.", answer: "Use STAR format with measurable outcome." }),
            8
        ),
        skillGaps: normalizeSkillGaps(raw?.skillGaps, kws),
        preparationPlan: normalizePrepPlan(raw?.preparationPlan)
    }
}

// ── Fallback (deterministic, no AI) ─────────────────────────────────
function buildFallbackReport({ resume = "", selfDescription = "", jobDescription = "" }) {
    const kws = extractKeywords(jobDescription, 28)
    const profile = `${resume}\n${selfDescription}`.toLowerCase()
    const matched = kws.filter((k) => profile.includes(k)).length
    const score = clamp(kws.length ? Math.max(45, Math.round((matched / kws.length) * 100)) : 60, 0, 100)
    const missing = kws.filter((k) => !profile.includes(k)).slice(0, 6)
    const title = titleFromJD(jobDescription)

    return {
        title,
        matchScore: score,
        technicalQuestions: [
            { question: `Explain a production project relevant to ${title} and justify architecture decisions.`, intention: "Assess system design depth.", answer: "Walk through requirements, design choices, bottlenecks, and measurable impact." },
            { question: "How do you ensure reliability and observability in your services?", intention: "Evaluate engineering maturity.", answer: "Discuss monitoring, logging, error handling, testing, deployment safeguards." },
            { question: "Describe your approach to performance optimization with real traffic.", intention: "Measure optimization skills.", answer: "Mention profiling, root-cause analysis, prioritized fixes, before/after metrics." },
            { question: "How do you design secure APIs and handle auth at scale?", intention: "Assess security fundamentals.", answer: "Cover token strategy, validation, encryption, access controls." },
            { question: `Which ${missing[0] || "advanced"} capability do you plan to strengthen?`, intention: "Evaluate learning plan quality.", answer: "Present a concrete upskilling roadmap with timeline and checkpoints." },
            { question: "Walk me through scalable database schema design.", intention: "Assess data modeling skills.", answer: "Discuss relationships, indexing, sharding, and schema migrations." },
            { question: "How do you approach a comprehensive test suite?", intention: "Evaluate testing philosophy.", answer: "Cover unit, integration, E2E tests, mocking, and CI/CD integration." },
            { question: "Describe debugging a prod issue affecting 10% of users.", intention: "Assess debugging methodology.", answer: "Explain log analysis, tracing, feature flags, and stakeholder communication." },
            { question: "How do you handle state management in complex frontends?", intention: "Evaluate frontend architecture.", answer: "Discuss local vs global state, caching, optimistic updates." },
            { question: "Explain your CI/CD pipeline for zero-downtime deployments.", intention: "Assess DevOps maturity.", answer: "Cover automated testing, blue-green deployments, rollback strategies." }
        ],
        behavioralQuestions: [
            { question: "Tell me about handling a high-pressure deadline without sacrificing quality.", intention: "Assess prioritization.", answer: "Use STAR with constraints, decisions, and outcome metrics." },
            { question: "Describe a technical disagreement and how you resolved it.", intention: "Assess conflict resolution.", answer: "Explain context, options, evidence, and outcome." },
            { question: "Share an example of taking ownership beyond your role.", intention: "Assess leadership potential.", answer: "Highlight discovery, proactive action, and impact." },
            { question: "How do you communicate tradeoffs to non-technical stakeholders?", intention: "Assess clarity.", answer: "Demonstrate concise framing with risks and alternatives." },
            { question: "Tell me about a project that failed. What did you learn?", intention: "Assess growth mindset.", answer: "Describe what went wrong, lessons learned, and how you applied them." },
            { question: "Describe quickly learning a new technology to deliver a project.", intention: "Assess adaptability.", answer: "Explain your learning approach and successful outcome." },
            { question: "How do you prioritize competing deadlines?", intention: "Assess time management.", answer: "Describe your framework and a specific success example." },
            { question: "Tell me about mentoring a junior developer.", intention: "Assess team growth ability.", answer: "Describe your approach and measurable growth achieved." }
        ],
        skillGaps: normalizeSkillGaps([], missing),
        preparationPlan: normalizePrepPlan([])
    }
}

// ── Main export ─────────────────────────────────────────────────────
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are a world-class technical interview coach with 15+ years of hiring experience at top tech companies.
Create an extremely detailed interview preparation report in strict JSON.

Rules:
- Return ONLY valid JSON matching the schema.
- technicalQuestions: exactly 10 items covering system design, coding, debugging, architecture, scalability, security, databases, APIs, testing, DevOps. Each answer: 3-5 sentences with concrete examples and metrics.
- behavioralQuestions: exactly 8 items covering leadership, conflict, failure, teamwork, communication, prioritization, ownership, adaptability. Answers in STAR format.
- skillGaps: 4-6 items with severity low|medium|high.
- preparationPlan: 5-7 day-wise items with 3-4 concrete tasks each.
- matchScore: realistic honest assessment.

Candidate Inputs:
Resume: ${trim(resume, 8000)}
Self Description: ${trim(selfDescription, 4000)}
Job Description: ${trim(jobDescription, 8000)}`

    const raw = await callWithFallback({
        prompt,
        schema: reportSchema,
        maxTokens: 8000,
        temperature: 0.6,
        onFallback: () => buildFallbackReport({ resume, selfDescription, jobDescription })
    })

    return normalizeReport(raw, { resume, selfDescription, jobDescription })
}

// ══════════════════════════════════════════════════════════════════════
//  RESUME PDF (HTML generation)
// ══════════════════════════════════════════════════════════════════════

const resumeSchema = z.object({ html: z.string() })

// ── Profile parser for fallback template ────────────────────────────
function parseProfile({ resume = "", selfDescription = "", jobDescription = "" }) {
    const src = `${resume}\n${selfDescription}`
    const lines = src.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

    const name = lines[0] || "Candidate Name"
    const roleHint = titleFromJD(jobDescription)
    const email = src.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0] || "email@example.com"
    const phone = src.match(/(\+?\d[\d\s\-()]{7,}\d)/)?.[0] || "+91 00000 00000"
    const github = src.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+/i)?.[0] || "github.com/username"
    const linkedin = src.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w\/-]+/i)?.[0] || "linkedin.com/in/username"
    const locMatch = src.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/)
    const location = locMatch?.[1] || "India"

    // Skills: extract from source + JD keywords
    const srcSkills = unique(src.split(/[\n,|]+/).map((x) => x.trim()).filter((x) => x.length >= 2 && x.length <= 40 && /[a-zA-Z]/.test(x))).slice(0, 14)
    const jdSkills = extractKeywords(jobDescription, 18).map(toSentence)
    const skills = unique([...srcSkills, ...jdSkills]).slice(0, 14)

    // Categorize skills
    const CATS = {
        languages: ["javascript", "typescript", "java", "python", "c++", "c#", "go", "php", "ruby", "html", "css", "sql"],
        frontend: ["react", "next.js", "next", "redux", "tailwind", "scss", "bootstrap", "vite", "webpack"],
        backend: ["node", "node.js", "express", "nestjs", "rest api", "graphql", "microservices", "jwt", "spring", "django"],
        database: ["mongodb", "mysql", "postgresql", "postgres", "redis", "firebase", "dynamodb"],
        tools: ["git", "github", "docker", "aws", "vercel", "render", "jest", "ci/cd"]
    }
    const categorized = { languages: [], frontend: [], backend: [], database: [], tools: [] }
    for (const skill of skills) {
        const lc = skill.toLowerCase()
        const cat = Object.entries(CATS).find(([, kws]) => kws.some((k) => lc.includes(k)))?.[0] || "tools"
        categorized[cat].push(skill)
    }
    for (const key of Object.keys(categorized)) categorized[key] = unique(categorized[key]).slice(0, 8)

    const summary = trim(selfDescription || resume || `Professional with strong interest in ${roleHint}.`, 700)

    const experience = lines
        .filter((l) => /\b(built|developed|implemented|improved|optimized|led|designed|created|deployed|reduced|increased)\b/i.test(l))
        .slice(0, 4)
        .map((l) => {
            const clean = l.replace(/^[•\-\d.)\s]+/, "").trim()
            return /^[A-Z]/.test(clean) ? clean : `Built ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`
        })

    const education = lines
        .filter((l) => /\b(B\.Tech|M\.Tech|BCA|MCA|Bachelor|Master|University|College|Institute|Degree)\b/i.test(l))
        .slice(0, 3)
    if (!education.length) education.push("Bachelor's degree details to be added")

    const achievements = lines
        .filter((l) => /\b(certified|certification|award|achievement|winner|rank|scholarship)\b/i.test(l))
        .slice(0, 4)

    return { name, roleHint, location, email, phone, github, linkedin, summary, categorized, experience, education, achievements }
}

// ── Fallback ATS resume HTML ────────────────────────────────────────
function buildFallbackResumeHtml(inputs) {
    const p = parseProfile(inputs)
    const e = escapeHtml

    const skillRows = Object.entries(p.categorized)
        .filter(([, items]) => items.length)
        .map(([label, items]) => `<tr><td class="sl">${e(label)}</td><td>${e(items.join(", "))}</td></tr>`)
        .join("")

    const expHtml = p.experience.length
        ? `<section class="s"><h2 class="st">Experience</h2><article class="en"><div class="eh"><div class="et">${e(p.roleHint)}</div><div class="es">Independent / Academic</div></div><ul>${p.experience.map((b) => `<li>${e(b)}</li>`).join("")}</ul></article></section>`
        : ""

    const achHtml = p.achievements.length
        ? `<section class="s"><h2 class="st">Achievements & Certifications</h2><ul>${p.achievements.map((a) => `<li>${e(a)}</li>`).join("")}</ul></section>`
        : ""

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${e(p.name)} Resume</title>
  <style>
    :root{--h:#111827;--t:#1f2937;--m:#4b5563;--l:#d1d5db}
    *{box-sizing:border-box}
    body{margin:0;color:var(--t);font-family:Arial,Helvetica,sans-serif;line-height:1.45;background:#fff;font-size:11pt}
    .rd{width:190mm;margin:0 auto;padding:10mm 0 8mm}
    .hd{border-bottom:1.5px solid var(--h);padding-bottom:8mm;margin-bottom:7mm}
    .nm{font-size:24pt;font-weight:700;color:var(--h);margin:0;line-height:1.15}
    .tl{font-size:12.5pt;font-weight:600;color:#374151;margin:3mm 0 4mm}
    .cl{margin:0 0 2mm;font-size:10pt;color:var(--m)}
    .s{margin-top:0;padding-top:0;page-break-inside:avoid;break-inside:avoid}
    .s+.s{margin-top:6mm}
    .st{font-size:11.5pt;text-transform:uppercase;letter-spacing:.9px;margin:0 0 2.5mm;color:var(--h);border-bottom:1px solid var(--l);padding-bottom:1.6mm}
    p{margin:0;color:var(--t);line-height:1.5;white-space:pre-wrap}
    ul{margin:2.5mm 0 0 4.5mm;padding:0}
    li{margin:0 0 1.6mm;line-height:1.45;page-break-inside:avoid}
    .sk{width:100%;border-collapse:collapse;margin-top:1mm}
    .sk td{vertical-align:top;padding:1.4mm 0;border-bottom:1px solid #eceff3}
    .sk tr:last-child td{border-bottom:0}
    .sl{width:34mm;font-weight:700;color:var(--h);padding-right:4mm}
    .en{page-break-inside:avoid;margin-bottom:4mm}
    .en:last-child{margin-bottom:0}
    .eh{display:flex;justify-content:space-between;gap:8mm;align-items:baseline;margin-bottom:1mm}
    .et{font-weight:700;color:var(--h)}
    .es{font-size:10pt;color:var(--m)}
    @page{size:A4;margin:10mm}
    @media print{.rd{width:auto;padding:0}}
  </style>
</head>
<body>
  <main class="rd">
    <header class="hd">
      <h1 class="nm">${e(p.name)}</h1>
      <p class="tl">${e(p.roleHint)}</p>
      <p class="cl">${e(p.location)} | ${e(p.email)} | ${e(p.phone)}</p>
      <p class="cl">GitHub: ${e(p.github)} | LinkedIn: ${e(p.linkedin)}</p>
    </header>
    <section class="s"><h2 class="st">Professional Summary</h2><p>${e(p.summary)}</p></section>
    <section class="s"><h2 class="st">Technical Skills</h2><table class="sk"><tbody>${skillRows}</tbody></table></section>
    ${expHtml}
    <section class="s">
      <h2 class="st">Education</h2>
      ${p.education.map((ed) => `<article class="en"><div class="et">${e(ed)}</div></article>`).join("")}
    </section>
    ${achHtml}
  </main>
</body>
</html>`
}

// ── HTML extraction (simplified) ────────────────────────────────────
function extractHtml(text = "") {
    if (!text || typeof text !== "string") return ""
    const t = text.trim()

    // Direct HTML document
    const htmlStart = t.search(/<!doctype html|<html/i)
    if (htmlStart >= 0) {
        const chunk = t.slice(htmlStart)
        const end = chunk.toLowerCase().lastIndexOf("</html>")
        return end >= 0 ? chunk.slice(0, end + 7) : chunk
    }

    // JSON with html field
    try {
        const json = JSON.parse(t)
        if (typeof json?.html === "string") return json.html
    } catch { /* not JSON */ }

    // Markdown fenced block
    const fence = t.match(/```(?:html)?\n?([\s\S]*?)```/i)
    if (fence?.[1]) return extractHtml(fence[1])

    return t
}

function ensureFullHtml(html = "") {
    const v = String(html || "").trim()
    if (!v) return ""
    if (/<html[\s\S]*<\/html>/i.test(v)) return v
    if (/<body[\s\S]*<\/body>/i.test(v)) return `<!doctype html><html><head><meta charset="utf-8" /></head>${v}</html>`
    return `<!doctype html><html><head><meta charset="utf-8" /></head><body>${v}</body></html>`
}

// ── Main export ─────────────────────────────────────────────────────
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const inputs = [
        jobDescription && `Job Description:\n${jobDescription}`,
        resume && `Resume Text:\n${resume}`,
        selfDescription && `Self Description:\n${selfDescription}`
    ].filter(Boolean).join("\n\n") || "No input data provided."

    const prompt = `You are a world-class professional resume writer. Generate a premium, ATS-friendly resume as a complete HTML document.

RULES:
- Return JSON with key "html" containing a complete <!doctype html> document.
- Font: Calibri, Segoe UI, Arial, sans-serif.
- Color scheme: navy #1a2332 headers, accent #2563eb dividers.
- Header: name 28pt bold, role 14pt, contact on one line with pipe separators, 3px accent line below.
- Professional Summary: 3-4 tailored sentences.
- Technical Skills: categorized table (Languages, Frameworks, Databases, Tools, Cloud).
- Experience/Projects: bold titles, 3-5 bullets starting with strong action verbs, include metrics.
- Education, Achievements & Certifications sections.
- A4 paper, 15mm margins, page-break-inside: avoid on sections.
- Generate substantial content, not a skeleton.

Input:\n${trim(inputs, 12000)}`

    const raw = await callWithFallback({
        prompt,
        schema: resumeSchema,
        maxTokens: 16000,
        temperature: 0.5,
        onFallback: () => {
            console.warn("Falling back to deterministic ATS resume template")
            return { html: buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) }
        }
    })

    const html = ensureFullHtml(extractHtml(raw?.html || ""))
    if (html && html.length > 120) return html

    // If AI returned garbage, use deterministic fallback
    return buildFallbackResumeHtml({ resume, selfDescription, jobDescription })
}

module.exports = { generateInterviewReport, generateResumePdf }
