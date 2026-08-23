import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'
import { InterviewContext } from '../interview.context'

const SAMPLE_JOB_PRESETS = {
    'google-frontend': {
        title: 'Senior Frontend Engineer @ Google',
        company: 'Google',
        role: 'Frontend Developer',
        description: `We are looking for a Senior Frontend Engineer to build high-performance, accessible web applications at scale.
Key Requirements:
- 4+ years of experience with React, TypeScript, modern JavaScript (ES6+), and CSS architecture.
- Strong knowledge of Web Performance (Core Web Vitals), state management, and REST/GraphQL APIs.
- Experience with Docker containerization, CI/CD deployment workflows, and Cloud Infrastructure (AWS / GCP).
- Proven ability to lead System Design discussions for complex web architectures, micro-frontends, and distributed caching.`
    },
    'amazon-cloud': {
        title: 'Cloud Full Stack Engineer @ Amazon',
        company: 'Amazon',
        role: 'Full Stack Developer',
        description: `Amazon Web Services is seeking a Full Stack Cloud Engineer to design resilient cloud-native dashboards and backend services.
Key Requirements:
- Proficiency in React, Node.js, TypeScript, and distributed RESTful APIs.
- Deep expertise in AWS (Lambda, DynamoDB, S3, ECS, CloudFront).
- Strong background in Docker, Kubernetes container orchestration, and Infrastructure as Code.
- System Design expertise in event-driven architectures, rate limiting, and multi-region replication.`
    },
    'meta-fullstack': {
        title: 'Software Engineer (Product) @ Meta',
        company: 'Meta',
        role: 'Software Engineer',
        description: `Meta is hiring Software Engineers to build next-generation social experiences.
Key Requirements:
- Expert level React 19, JavaScript asynchronous execution, and modern component design.
- Experience collaborating on large distributed backends, GraphQL schema federation, and database indexing.
- Familiarity with CI/CD automation, testing frameworks (Jest/Playwright), and telemetry.
- High architectural competence in distributed state synchronization, web performance, and offline caching.`
    }
}

export const ResumeAnalyzer = () => {
    const navigate = useNavigate()
    const { updateSetup } = useContext(InterviewContext)

    const [selectedPresetKey, setSelectedPresetKey] = useState('google-frontend')
    const [jobDescriptionInput, setJobDescriptionInput] = useState(SAMPLE_JOB_PRESETS['google-frontend'].description)
    
    // Processing Animation State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisProgress, setAnalysisProgress] = useState(100)
    const [processingStep, setProcessingStep] = useState(5) // 1 to 5
    const [isResultsReady, setIsResultsReady] = useState(true)

    // Modal State for One-Click Mock Interview
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Resume Info
    const resumeInfo = {
        filename: 'Sumit_Adak_Senior_Engineer_2026.pdf',
        fileSize: '245 KB',
        detectedName: 'Sumit Adak',
        detectedRole: 'Senior Full Stack & Frontend Engineer',
        experienceYears: '4.5+ Years',
        education: 'B.Tech in Computer Science',
        detectedSkills: [
            'React', 'JavaScript', 'TypeScript', 'REST APIs', 'Node.js', 'Next.js',
            'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Git', 'Webpack', 'HTML5 / CSS3'
        ]
    }

    // Dynamic Skill Gap Data
    const skillGapAnalysis = {
        matchScore: 78,
        atsScore: 82,
        atsCategories: [
            { name: 'Formatting & Layout', score: 92, status: 'Clean Semantic Hierarchy', icon: 'format_align_left' },
            { name: 'Keyword Density', score: 78, status: 'Missing Cloud & Container Keywords', icon: 'key' },
            { name: 'Section Organization', score: 88, status: 'Standard Industry Flow', icon: 'view_agenda' },
            { name: 'Readability & Grammar', score: 85, status: 'Flesch Grade 10.4 • Action Verb Driven', icon: 'menu_book' },
            { name: 'Target Skill Relevance', score: 76, status: 'Frontend Strong • Infrastructure Gaps', icon: 'star' }
        ],
        matchedSkills: [
            { name: 'React & React 19', confidence: 96, context: 'Matched in 4 Experience Bullets' },
            { name: 'TypeScript / JavaScript', confidence: 94, context: 'Matched in Core Projects & Skills' },
            { name: 'REST & GraphQL APIs', confidence: 90, context: 'Matched in Backend Integration' },
            { name: 'Web Performance & Web Vitals', confidence: 88, context: 'Matched in Profiling Metrics' },
            { name: 'Node.js & Next.js', confidence: 89, context: 'Matched in Full Stack Projects' },
            { name: 'Jest & Unit Testing', confidence: 85, context: 'Matched in Quality Assurance' }
        ],
        missingSkills: [
            { name: 'System Design & Scalability', impact: 'High Priority', scoreGap: '-12%', icon: 'hub' },
            { name: 'Docker & Containerization', impact: 'High Priority', scoreGap: '-8%', icon: 'inventory_2' },
            { name: 'AWS Cloud Infrastructure', impact: 'High Priority', scoreGap: '-10%', icon: 'cloud' },
            { name: 'Kubernetes Orchestration', impact: 'Medium Priority', scoreGap: '-5%', icon: 'account_tree' },
            { name: 'CI/CD Pipeline Automation', impact: 'Medium Priority', scoreGap: '-4%', icon: 'sync_alt' }
        ]
    }

    const handleSelectPreset = (key) => {
        setSelectedPresetKey(key)
        setJobDescriptionInput(SAMPLE_JOB_PRESETS[key].description)
    }

    const handleRunAnalysis = () => {
        setIsAnalyzing(true)
        setIsResultsReady(false)
        setAnalysisProgress(0)
        setProcessingStep(1)

        const stepsInterval = setInterval(() => {
            setProcessingStep((prev) => {
                if (prev >= 5) {
                    clearInterval(stepsInterval)
                    return 5
                }
                return prev + 1
            })
            setAnalysisProgress((prev) => Math.min(prev + 25, 100))
        }, 400)

        setTimeout(() => {
            setIsAnalyzing(false)
            setIsResultsReady(true)
        }, 2200)
    }

    const handleLaunchMockInterview = () => {
        // Automatically prepare setup configuration with missing skills
        const missingSkillNames = skillGapAnalysis.missingSkills.slice(0, 3).map(s => s.name)
        
        updateSetup({
            role: SAMPLE_JOB_PRESETS[selectedPresetKey]?.role || 'Frontend Developer',
            focusAreas: ['System Design', 'Docker', 'AWS'],
            difficulty: 75,
            duration: 45,
            interviewType: 'Technical'
        })

        setShowConfirmModal(true)
    }

    const handleConfirmAndNavigate = () => {
        setShowConfirmModal(false)
        navigate('/interview/setup')
    }

    return (
        <div className="bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] antialiased overflow-x-hidden min-h-screen flex selection:bg-[#b8c8e0] selection:text-[#223144]">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#334155] shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#E2E8F0] cursor-pointer flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-500/30">
                        AI
                    </span>
                    Interview AI
                </div>
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="p-2 text-[#dae2fd] hover:text-[#b8c8e0] transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </button>
            </nav>

            {/* Desktop Slate Sidebar */}
            <SlateSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen flex flex-col relative pb-20 md:pb-12">
                <div className="scanline"></div>

                {/* Top Desktop Bar */}
                <header className="hidden md:flex justify-between items-center px-8 py-4 border-b border-[#334155] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                            AI Resume & ATS Semantic Analyzer
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                            ATS Engine v3.8 Active
                        </span>
                    </div>

                    <button
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing}
                        className="btn-primary rounded-lg px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                        Re-Analyze Resume
                    </button>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#818cf8] text-[18px]">document_scanner</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                    Career Intelligence & ATS Diagnostics
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Resume & Job Matcher
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-0.5">
                                Evaluate ATS formatting compatibility, discover keyword gaps against target job descriptions, and generate targeted interview drills.
                            </p>
                        </div>

                        {/* Resume Status Chip */}
                        <div className="flex items-center gap-3 bg-[#0F172A] border border-[#334155] px-4 py-2.5 rounded-xl shadow-sm self-start md:self-auto">
                            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                            </div>
                            <div className="text-left font-['JetBrains_Mono'] text-xs">
                                <div className="text-[#E2E8F0] font-bold truncate max-w-[180px]">{resumeInfo.filename}</div>
                                <div className="text-[#818cf8]">Parsed & Ready</div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        ANIMATED AI PROCESSING SEQUENCE (DURING ANALYSIS)
                    ========================================================= */}
                    {isAnalyzing && (
                        <div className="glass-modal rounded-2xl p-8 border border-indigo-500/40 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-[#818cf8]">
                                        <span className="material-symbols-outlined text-[22px] animate-spin">sync</span>
                                    </div>
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            AI Processing Sequence in Progress...
                                        </h3>
                                        <p className="font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                            Extracting entities, parsing AST structure, and generating semantic cosine matches
                                        </p>
                                    </div>
                                </div>
                                <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#818cf8]">
                                    {analysisProgress}%
                                </span>
                            </div>

                            {/* Overall Progress Bar */}
                            <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden border border-[#334155]/60">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                                    style={{ width: `${analysisProgress}%` }}
                                />
                            </div>

                            {/* Processing Checklist Sequence */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 font-['JetBrains_Mono'] text-xs">
                                {[
                                    { step: 1, label: 'Reading Resume', sub: 'AST Tokenization' },
                                    { step: 2, label: 'Detecting Skills', sub: 'Entity Extraction' },
                                    { step: 3, label: 'Analyzing Experience', sub: 'Quantified Impact' },
                                    { step: 4, label: 'Comparing Job Match', sub: 'Cosine Similarity' },
                                    { step: 5, label: 'Generating Insights', sub: 'Interview Synthesis' }
                                ].map((item) => {
                                    const isDone = processingStep > item.step
                                    const isCurrent = processingStep === item.step
                                    return (
                                        <div
                                            key={item.step}
                                            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                                                isDone
                                                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                                                    : isCurrent
                                                    ? 'bg-indigo-950/40 border-indigo-500 text-[#818cf8] shadow-md shadow-indigo-500/20'
                                                    : 'bg-[#0F172A]/50 border-[#334155]/40 text-[#c4c6cd]/50'
                                            }`}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${
                                                isDone ? 'text-emerald-400' : isCurrent ? 'text-[#818cf8] animate-pulse' : 'text-[#c4c6cd]/40'
                                            }`}>
                                                {isDone ? 'check_circle' : isCurrent ? 'radio_button_checked' : 'radio_button_unchecked'}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{item.label}</span>
                                                <span className="text-[10px] opacity-70">{item.sub}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* =========================================================
                        SECTION 1: ATS COMPATIBILITY GAUGE & BREAKDOWN
                    ========================================================= */}
                    {isResultsReady && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-up duration-300">
                            
                            {/* Large ATS Gauge Card (5 cols) */}
                            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 lg:p-7 border border-[#334155] shadow-lg flex flex-col justify-between items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="w-full flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#818cf8] text-[20px]">speed</span>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            ATS Compatibility Score
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-['JetBrains_Mono'] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Passed ATS Filter
                                    </span>
                                </div>

                                {/* Radial Semi-Circle Gauge Visual */}
                                <div className="relative w-64 h-36 flex items-end justify-center my-4">
                                    <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 110">
                                        {/* Background Arc */}
                                        <path
                                            d="M 20 100 A 80 80 0 0 1 180 100"
                                            fill="none"
                                            stroke="#1E293B"
                                            strokeWidth="16"
                                            strokeLinecap="round"
                                        />
                                        {/* Colored Progress Arc (82%) */}
                                        <path
                                            d="M 20 100 A 80 80 0 0 1 180 100"
                                            fill="none"
                                            stroke="url(#atsGradient)"
                                            strokeWidth="16"
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 * (1 - 0.82)}
                                            strokeLinecap="round"
                                            className="path-draw"
                                        />
                                        <defs>
                                            <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="50%" stopColor="#a855f7" />
                                                <stop offset="100%" stopColor="#34d399" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Inner Numeric Readout */}
                                    <div className="absolute bottom-1 flex flex-col items-center">
                                        <div className="font-['Hanken_Grotesk'] text-4xl font-bold text-[#E2E8F0] tracking-tight">
                                            82 <span className="text-xl text-[#c4c6cd] font-normal">/ 100</span>
                                        </div>
                                        <span className="font-['JetBrains_Mono'] text-xs text-[#818cf8] font-semibold mt-0.5">
                                            Strong Candidate Tier
                                        </span>
                                    </div>
                                </div>

                                {/* AI Summary text */}
                                <div className="w-full bg-[#0F172A] p-4 rounded-xl border border-[#334155] text-left text-xs font-['Inter'] text-[#c4c6cd] leading-relaxed">
                                    💡 <strong>AI ATS Verdict:</strong> Your resume has a clean semantic hierarchy (98% parsing accuracy). To exceed <strong>90/100</strong>, inject cloud infrastructure keywords (Docker, AWS, Kubernetes) directly into your accomplishment bullet points.
                                </div>
                            </div>

                            {/* Category Progress Breakdown (7 cols) */}
                            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 lg:p-7 border border-[#334155] shadow-lg flex flex-col justify-between gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                        ATS Rubric Category Breakdown
                                    </h3>
                                    <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                        5 Key Criteria Audited
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3.5">
                                    {skillGapAnalysis.atsCategories.map((cat, i) => (
                                        <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#0F172A] border border-[#334155]">
                                            <div className="flex justify-between items-center text-xs font-['JetBrains_Mono']">
                                                <div className="flex items-center gap-2 text-[#E2E8F0] font-bold">
                                                    <span className="material-symbols-outlined text-[16px] text-[#818cf8]">{cat.icon}</span>
                                                    <span>{cat.name}</span>
                                                </div>
                                                <span className={`font-bold ${
                                                    cat.score >= 90 ? 'text-emerald-400' :
                                                    cat.score >= 80 ? 'text-[#818cf8]' : 'text-amber-400'
                                                }`}>
                                                    {cat.score} / 100
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full h-1.5 bg-[#020617] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${
                                                        cat.score >= 90 ? 'bg-emerald-400' :
                                                        cat.score >= 80 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-amber-400'
                                                    }`}
                                                    style={{ width: `${cat.score}%` }}
                                                />
                                            </div>

                                            <div className="text-[11px] font-['Inter'] text-[#c4c6cd]">
                                                {cat.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        SECTION 2: SIDE-BY-SIDE TARGET JOB MATCHER
                    ========================================================= */}
                    {isResultsReady && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-up duration-300">
                            
                            {/* LEFT: Uploaded Resume Summary (5 cols) */}
                            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col justify-between gap-5">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[20px]">badge</span>
                                            <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                                Detected Resume Profile
                                            </h3>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold">
                                            ✓ Active
                                        </span>
                                    </div>

                                    {/* Candidate Card */}
                                    <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold font-['Hanken_Grotesk']">
                                                SA
                                            </div>
                                            <div>
                                                <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0]">
                                                    {resumeInfo.detectedName}
                                                </h4>
                                                <p className="font-['JetBrains_Mono'] text-xs text-[#818cf8]">
                                                    {resumeInfo.detectedRole}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#c4c6cd] pt-2 border-t border-[#334155]/60">
                                            <span>{resumeInfo.experienceYears}</span>
                                            <span>•</span>
                                            <span>{resumeInfo.education}</span>
                                        </div>
                                    </div>

                                    {/* Detected Core Skills */}
                                    <div>
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] mb-2 block font-medium">
                                            Extracted Core Skills ({resumeInfo.detectedSkills.length}):
                                        </label>
                                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                                            {resumeInfo.detectedSkills.map((sk, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 rounded-md text-xs font-['JetBrains_Mono'] bg-[#0F172A] text-[#dae2fd] border border-[#334155]"
                                                >
                                                    {sk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-dashed border-[#334155] hover:border-indigo-500/50 transition-colors text-center cursor-pointer bg-[#0F172A]/40">
                                    <span className="material-symbols-outlined text-[#818cf8] text-[22px] mb-1">upload_file</span>
                                    <div className="text-xs font-['JetBrains_Mono'] text-[#E2E8F0] font-bold">
                                        Drop a new resume to re-parse
                                    </div>
                                    <div className="text-[10px] text-[#c4c6cd]">Supports PDF, DOCX (Max 10MB)</div>
                                </div>
                            </div>

                            {/* RIGHT: Target Job Description Input (7 cols) */}
                            <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col justify-between gap-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[20px]">work</span>
                                            <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                                Target Job Description
                                            </h3>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                            Paste custom or select preset:
                                        </span>
                                    </div>

                                    {/* Presets Toggle Pills */}
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
                                        {Object.keys(SAMPLE_JOB_PRESETS).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => handleSelectPreset(key)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] whitespace-nowrap transition-all cursor-pointer ${
                                                    selectedPresetKey === key
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-sm'
                                                        : 'bg-[#0F172A] text-[#c4c6cd] hover:text-[#E2E8F0] border border-[#334155]'
                                                }`}
                                            >
                                                {SAMPLE_JOB_PRESETS[key].title}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Textarea */}
                                    <textarea
                                        value={jobDescriptionInput}
                                        onChange={(e) => setJobDescriptionInput(e.target.value)}
                                        rows={8}
                                        placeholder="Paste target job description and required competencies here..."
                                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-4 font-['Inter'] text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#c4c6cd]/50 resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                        {jobDescriptionInput.length} characters parsed
                                    </span>
                                    <button
                                        onClick={handleRunAnalysis}
                                        className="btn-primary rounded-xl px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-2 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                                        Analyze Semantic Alignment
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        SECTION 3: SEMANTIC SKILL-GAP ANALYSIS & MATCH RESULTS
                    ========================================================= */}
                    {isResultsReady && (
                        <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6 animate-in fade-up duration-300">
                            
                            {/* Match Score Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex flex-col items-center justify-center text-center shadow-lg">
                                        <span className="text-[10px] font-['JetBrains_Mono'] text-[#818cf8]">Match</span>
                                        <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-emerald-400">
                                            {skillGapAnalysis.matchScore}%
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#E2E8F0]">
                                                Semantic Skill-Gap Diagnostics
                                            </h3>
                                            <span className="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20 font-bold">
                                                Cosine Parity: High
                                            </span>
                                        </div>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                            Identified 6 high-confidence matching competencies and 5 critical missing or weak technical areas.
                                        </p>
                                    </div>
                                </div>

                                {/* Primary One-Click CTA */}
                                <button
                                    onClick={handleLaunchMockInterview}
                                    className="group relative overflow-hidden rounded-xl px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white font-['JetBrains_Mono'] text-xs font-bold shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                    <span>Start Mock Interview Based on Missing Skills</span>
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>

                            {/* Dual Column: Matched Skills vs Missing/Weak Skills */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                
                                {/* LEFT: MATCHED SKILLS */}
                                <div className="p-5 rounded-xl bg-[#0F172A] border border-emerald-500/30 flex flex-col gap-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-emerald-300">
                                                Matched Skills ({skillGapAnalysis.matchedSkills.length})
                                            </h4>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold">
                                            ✓ Strong Parity
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        {skillGapAnalysis.matchedSkills.map((item, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-[#1E293B]/60 border border-[#334155]/60 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                                                    <div>
                                                        <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#E2E8F0]">{item.name}</div>
                                                        <div className="text-[10px] font-['Inter'] text-[#c4c6cd]">{item.context}</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-['JetBrains_Mono'] font-bold text-emerald-400">
                                                    {item.confidence}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT: MISSING OR WEAK SKILLS */}
                                <div className="p-5 rounded-xl bg-[#0F172A] border border-amber-500/30 flex flex-col gap-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-amber-300">
                                                Missing or Weak Skills ({skillGapAnalysis.missingSkills.length})
                                            </h4>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-amber-400 font-bold">
                                            ⚠️ High Impact Gap
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        {skillGapAnalysis.missingSkills.map((item, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-[#1E293B]/60 border border-amber-500/20 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="material-symbols-outlined text-amber-400 text-[18px]">{item.icon}</span>
                                                    <div>
                                                        <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#E2E8F0]">{item.name}</div>
                                                        <div className="text-[10px] font-['JetBrains_Mono'] text-amber-400">{item.impact}</div>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    {item.scoreGap} Impact
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                </div>
            </main>

            {/* =========================================================
                ONE-CLICK MOCK INTERVIEW CONFIRMATION MODAL
            ========================================================= */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-modal max-w-lg w-full rounded-2xl p-6 md:p-7 border border-[#334155] flex flex-col gap-5 animate-in zoom-in-95 duration-150">
                        
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                                    <span className="material-symbols-outlined text-[24px]">auto_fix_high</span>
                                </div>
                                <div>
                                    <h4 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                        AI Configured Mock Session
                                    </h4>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd]">
                                        Tailored specifically to bridge detected skill gaps
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-[#c4c6cd] hover:text-white p-1"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Configuration Parameters Summary */}
                        <div className="bg-[#020617] rounded-xl p-4 border border-[#334155] flex flex-col gap-3 font-['JetBrains_Mono'] text-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-[#334155]/60">
                                <span className="text-[#c4c6cd]">Target Role:</span>
                                <span className="font-bold text-[#E2E8F0]">Frontend Developer</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-[#334155]/60">
                                <span className="text-[#c4c6cd]">Difficulty Level:</span>
                                <span className="font-bold text-amber-400">Medium / Advanced</span>
                            </div>
                            <div>
                                <span className="text-[#c4c6cd] block mb-1.5">AI Targeted Focus Areas (Missing Skills):</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {['System Design', 'Docker', 'AWS', 'CI/CD Pipelines'].map((f, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/20 text-[#818cf8] border border-indigo-500/30 text-[11px] font-bold">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="font-['Inter'] text-xs text-[#c4c6cd] leading-relaxed">
                            Clicking proceed will transfer this auto-generated curriculum into the Interview Setup module where you can review your microphone, camera, and start the simulation.
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAndNavigate}
                                className="btn-primary rounded-xl px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-2 cursor-pointer"
                            >
                                <span>Proceed to Setup</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#334155] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Overview</span>
                </button>
                <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">History</span>
                </button>
                <button onClick={() => navigate('/resume')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        description
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Resume</span>
                </button>
                <button onClick={() => navigate('/interview/setup')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
            </nav>
        </div>
    )
}

export default ResumeAnalyzer
