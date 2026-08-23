import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

// Timeline datasets based on time range
const TIMELINE_DATA = {
    '7D': [
        { session: 'S1', label: 'Mon', fillerWpm: 2.6, confidence: 78, paceWpm: 126, techAccuracy: 80, date: 'Aug 17' },
        { session: 'S2', label: 'Tue', fillerWpm: 2.4, confidence: 81, paceWpm: 130, techAccuracy: 82, date: 'Aug 18' },
        { session: 'S3', label: 'Wed', fillerWpm: 2.1, confidence: 84, paceWpm: 134, techAccuracy: 85, date: 'Aug 19' },
        { session: 'S4', label: 'Thu', fillerWpm: 1.9, confidence: 86, paceWpm: 136, techAccuracy: 88, date: 'Aug 20' },
        { session: 'S5', label: 'Fri', fillerWpm: 1.8, confidence: 89, paceWpm: 138, techAccuracy: 91, date: 'Aug 21' },
        { session: 'S6', label: 'Sun', fillerWpm: 1.7, confidence: 92, paceWpm: 140, techAccuracy: 93, date: 'Aug 23' }
    ],
    '30D': [
        { session: 'W1', label: 'Week 1', fillerWpm: 3.1, confidence: 72, paceWpm: 122, techAccuracy: 75, date: 'Aug 01' },
        { session: 'W2', label: 'Week 2', fillerWpm: 2.6, confidence: 78, paceWpm: 128, techAccuracy: 81, date: 'Aug 08' },
        { session: 'W3', label: 'Week 3', fillerWpm: 2.2, confidence: 84, paceWpm: 134, techAccuracy: 86, date: 'Aug 15' },
        { session: 'W4', label: 'Week 4', fillerWpm: 1.8, confidence: 90, paceWpm: 138, techAccuracy: 92, date: 'Aug 22' }
    ],
    '3M': [
        { session: 'M1', label: 'Jun', fillerWpm: 3.8, confidence: 66, paceWpm: 118, techAccuracy: 68, date: 'Jun 2026' },
        { session: 'M2', label: 'Jul', fillerWpm: 2.7, confidence: 79, paceWpm: 130, techAccuracy: 80, date: 'Jul 2026' },
        { session: 'M3', label: 'Aug', fillerWpm: 1.8, confidence: 91, paceWpm: 138, techAccuracy: 92, date: 'Aug 2026' }
    ],
    'ALL': [
        { session: 'B0', label: 'Baseline', fillerWpm: 4.2, confidence: 60, paceWpm: 114, techAccuracy: 62, date: 'May 2026' },
        { session: 'S1', label: 'Sprint 1', fillerWpm: 3.4, confidence: 70, paceWpm: 122, techAccuracy: 73, date: 'Jun 2026' },
        { session: 'S2', label: 'Sprint 2', fillerWpm: 2.5, confidence: 82, paceWpm: 132, techAccuracy: 84, date: 'Jul 2026' },
        { session: 'S3', label: 'Current', fillerWpm: 1.8, confidence: 92, paceWpm: 138, techAccuracy: 93, date: 'Aug 2026' }
    ]
}

const FILLER_BREAKDOWN = [
    { word: 'um / uh', count: 14, percentage: 42, color: '#818cf8' },
    { word: 'like', count: 9, percentage: 28, color: '#c084fc' },
    { word: 'you know', count: 6, percentage: 18, color: '#60a5fa' },
    { word: 'basically / actually', count: 4, percentage: 12, color: '#34d399' }
]

const SKILLS_IMPROVING = [
    { name: 'Concurrency & Async Paradigms', score: 92, delta: '+14%', category: 'Full Stack' },
    { name: 'React 19 Internal Reconciliation', score: 95, delta: '+12%', category: 'Frontend' },
    { name: 'GraphQL & Schema Federation', score: 88, delta: '+8%', category: 'API Architecture' },
    { name: 'Microservices Saga Pattern', score: 90, delta: '+10%', category: 'System Design' }
]

const SKILLS_NEEDS_ATTENTION = [
    { name: 'Database Isolation & MVCC Locking', score: 74, delta: '-2%', urgency: 'High', category: 'Databases' },
    { name: 'Kafka Consumer Rebalance Strategies', score: 78, delta: '+3%', urgency: 'Medium', category: 'Event Streaming' },
    { name: 'Serverless Edge Cold-Start Latency', score: 76, delta: '0%', urgency: 'Medium', category: 'Cloud Infrastructure' },
    { name: 'Distributed Cache Stampede Mitigation', score: 79, delta: '+1%', urgency: 'Medium', category: 'Caching' }
]

const BENCHMARKS = [
    {
        title: 'System Design & Distributed Primitives',
        cohort: 'Senior Backend Candidates',
        percentile: 85,
        badge: 'Top 15%',
        userScore: '84/100',
        cohortAvg: '72/100',
        color: 'indigo'
    },
    {
        title: 'JavaScript & Asynchronous Concurrency',
        cohort: 'Frontend Engineering Leads',
        percentile: 92,
        badge: 'Top 8%',
        userScore: '95/100',
        cohortAvg: '76/100',
        color: 'purple'
    },
    {
        title: 'Behavioral & Leadership Communication',
        cohort: 'L5/L6 Engineering Candidates',
        percentile: 88,
        badge: 'Top 12%',
        userScore: '91/100',
        cohortAvg: '74/100',
        color: 'emerald'
    },
    {
        title: 'Algorithmic Optimization & Problem Decomposition',
        cohort: 'Tier-1 Tech Applicants',
        percentile: 80,
        badge: 'Top 20%',
        userScore: '86/100',
        cohortAvg: '68/100',
        color: 'blue'
    }
]

const TOP_STRENGTHS = [
    {
        title: 'Clear Technical Communication',
        desc: 'Uses precise engineering vocabulary and explains complex race conditions without ambiguity.'
    },
    {
        title: 'Strong React 19 & Runtime Mastery',
        desc: 'In-depth understanding of transition scheduling, Suspense microtasks, and fiber trees.'
    },
    {
        title: 'Structured STAR Problem Solving',
        desc: 'Effectively frames trade-offs, constraints, and operational fallbacks before coding.'
    },
    {
        title: 'Proactive Edge-Case Verification',
        desc: 'Consistently evaluates cache invalidation delays, idempotency keys, and network timeouts.'
    }
]

const RECURRING_WEAKNESSES = [
    {
        title: 'Filler Words Under High Pressure',
        desc: 'Tendency to use "um" and "like" during initial 30 seconds of open-ended system design questions.'
    },
    {
        title: 'Shallow Database Isolation Explanations',
        desc: 'Misses detailed nuances between Repeatable Read and Serializable snapshot isolation.'
    },
    {
        title: 'Conclusion Sometimes Lacks Summary',
        desc: 'Occasionally transitions into next question without summarizing final architectural compromises.'
    },
    {
        title: 'Rushing Into Schema Before Edge Scoping',
        desc: 'Dives into database table definitions before fully scoping write QPS and replication lags.'
    }
]

const HIGH_PRIORITY_TOPICS = [
    {
        id: 'rev-1',
        title: 'Distributed Systems (CAP & Consensus)',
        mastery: 74,
        scoreImpact: '+6% to +8%',
        tags: ['Raft', '2PC vs Saga', 'Eventual Consistency'],
        icon: 'hub'
    },
    {
        id: 'rev-2',
        title: 'Dynamic Programming (State Transitions)',
        mastery: 78,
        scoreImpact: '+4% to +6%',
        tags: ['Memoization', 'Space Optimization', 'Knapsack Matrix'],
        icon: 'code'
    },
    {
        id: 'rev-3',
        title: 'Database Indexing (B-Tree vs LSM)',
        mastery: 72,
        scoreImpact: '+7% to +10%',
        tags: ['Write Amplification', 'Compaction', 'Covering Indexes'],
        icon: 'database'
    },
    {
        id: 'rev-4',
        title: 'Core Web Vitals & Profiler Audits',
        mastery: 82,
        scoreImpact: '+3% to +5%',
        tags: ['LCP Sub-parts', 'INP Tuning', 'Layout Shifts'],
        icon: 'speed'
    }
]

export const Analytics = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('speech') // 'speech' | 'technical'
    const [timeRange, setTimeRange] = useState('30D') // '7D' | '30D' | '3M' | 'ALL'
    const [hoveredPoint, setHoveredPoint] = useState(null)

    const currentTimeline = useMemo(() => {
        return TIMELINE_DATA[timeRange] || TIMELINE_DATA['30D']
    }, [timeRange])

    // Generate SVG path for communication chart
    const chartPaths = useMemo(() => {
        const data = currentTimeline
        const count = data.length
        const width = 800
        const height = 180
        const topPadding = 25
        const bottomPadding = 30

        const coords = data.map((pt, idx) => {
            const x = count === 1 ? width / 2 : (idx / (count - 1)) * (width - 60) + 30
            // Score scaled 50 -> 100
            const yScore = height - bottomPadding - ((pt.confidence - 50) / 50) * (height - topPadding - bottomPadding)
            // Filler scaled 0 -> 5 (inverted so lower filler is higher visual score)
            const yFiller = height - bottomPadding - ((5 - pt.fillerWpm) / 5) * (height - topPadding - bottomPadding)
            return {
                ...pt,
                x: Math.round(x),
                yScore: Math.round(yScore),
                yFiller: Math.round(yFiller)
            }
        })

        let scoreLine = `M ${coords[0].x},${coords[0].yScore}`
        let fillerLine = `M ${coords[0].x},${coords[0].yFiller}`

        for (let i = 0; i < coords.length - 1; i++) {
            const curr = coords[i]
            const next = coords[i + 1]
            const mx = (curr.x + next.x) / 2
            scoreLine += ` C ${mx},${curr.yScore} ${mx},${next.yScore} ${next.x},${next.yScore}`
            fillerLine += ` C ${mx},${curr.yFiller} ${mx},${next.yFiller} ${next.x},${next.yFiller}`
        }

        const last = coords[coords.length - 1]
        const first = coords[0]
        const scoreArea = `${scoreLine} L ${last.x},200 L ${first.x},200 Z`

        return { coords, scoreLine, fillerLine, scoreArea }
    }, [currentTimeline])

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
                            AI Performance Intelligence
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                            Telemetry Active • Real-Time Diagnostics
                        </span>
                    </div>

                    {/* Time Range Filter Header */}
                    <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
                        {['7D', '30D', '3M', 'ALL'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-semibold transition-all cursor-pointer ${
                                    timeRange === r
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                                        : 'text-[#c4c6cd] hover:text-white'
                                }`}
                            >
                                {r === 'ALL' ? 'All Time' : r}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#818cf8] text-[18px]">query_stats</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                    Deep Diagnostics & Rubric Analysis
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Performance Intelligence
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-0.5">
                                Multi-dimensional evaluation of delivery cadence, acoustic clarity, algorithmic rigor, and peer percentiles.
                            </p>
                        </div>

                        {/* Top Readiness Index Card */}
                        <div className="flex items-center gap-4 bg-[#0F172A] border border-[#334155] px-5 py-3 rounded-2xl shadow-lg self-start md:self-auto">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold font-['Hanken_Grotesk'] text-xl shadow-md shadow-indigo-500/30">
                                88%
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                        Readiness Score
                                    </span>
                                    <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold">
                                        +12% mo
                                    </span>
                                </div>
                                <span className="text-xs font-['Inter'] text-[#c4c6cd]">
                                    Ready for L5/L6 Senior Tech Rounds
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        HIGHLIGHTED AI INSIGHT CARD
                    ========================================================= */}
                    <div className="glass-modal rounded-2xl p-6 lg:p-7 border border-[#334155] relative overflow-hidden group shadow-xl">
                        {/* Ambient glow backdrop */}
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-indigo-600/25 via-purple-600/20 to-transparent blur-[80px] rounded-full pointer-events-none group-hover:from-indigo-600/35 transition-all duration-700"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4 max-w-3xl">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-[#818cf8] shrink-0 shadow-lg">
                                    <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#818cf8] uppercase tracking-wider">
                                            AI Predictive Intelligence
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">High Impact Opportunity</span>
                                    </div>
                                    <h3 className="font-['Hanken_Grotesk'] text-[18px] md:text-[20px] font-bold text-[#E2E8F0] leading-snug">
                                        "Based on your last 10 interviews, improving your system design explanations could increase your average score by approximately <strong className="text-emerald-400">8–12%</strong>."
                                    </h3>
                                    <p className="font-['Inter'] text-xs md:text-sm text-[#c4c6cd] mt-2 leading-relaxed">
                                        Your technical fundamentals in React and asynchronous concurrency are already in the top 8th percentile. Focusing revision on database isolation and replication trade-offs will bridge your remaining gap to Staff level.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/interview/setup')}
                                className="group relative overflow-hidden rounded-xl px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-['JetBrains_Mono'] text-xs font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                            >
                                <span>Target System Design Drill</span>
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =========================================================
                        PRIMARY NAVIGATION TABS
                    ========================================================= */}
                    <div className="flex items-center border-b border-[#334155] gap-2 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setActiveTab('speech')}
                            className={`py-3.5 px-5 font-['Hanken_Grotesk'] text-[15px] font-bold flex items-center gap-2.5 border-b-2 transition-all cursor-pointer ${
                                activeTab === 'speech'
                                    ? 'text-[#818cf8] border-[#818cf8] bg-indigo-500/5'
                                    : 'text-[#c4c6cd] border-transparent hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                            1. Speech & Delivery Deep-Dive
                        </button>

                        <button
                            onClick={() => setActiveTab('technical')}
                            className={`py-3.5 px-5 font-['Hanken_Grotesk'] text-[15px] font-bold flex items-center gap-2.5 border-b-2 transition-all cursor-pointer ${
                                activeTab === 'technical'
                                    ? 'text-[#818cf8] border-[#818cf8] bg-indigo-500/5'
                                    : 'text-[#c4c6cd] border-transparent hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">terminal</span>
                            2. Technical Accuracy & Mastery
                        </button>
                    </div>

                    {/* =========================================================
                        TAB 1: SPEECH & DELIVERY DEEP-DIVE
                    ========================================================= */}
                    {activeTab === 'speech' && (
                        <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-200">
                            
                            {/* Key Speech Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                                
                                {/* Filler Words per Minute */}
                                <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">Filler Words / Min</span>
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                                            -32% (Improved)
                                        </span>
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#E2E8F0]">
                                        1.8 <span className="text-base text-[#c4c6cd] font-normal">WPM</span>
                                    </div>
                                    <p className="text-xs font-['Inter'] text-[#c4c6cd]/80 mt-1.5">
                                        Down from 2.6 WPM baseline (Target: &lt; 2.0)
                                    </p>
                                </div>

                                {/* Speaking Pace */}
                                <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-purple-500/40 hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">Speaking Pace</span>
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-[#818cf8] bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                                            Sweet Spot
                                        </span>
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#818cf8]">
                                        138 <span className="text-base text-[#c4c6cd] font-normal">WPM</span>
                                    </div>
                                    <p className="text-xs font-['Inter'] text-[#c4c6cd]/80 mt-1.5">
                                        Ideal conversational range: 130–150 WPM
                                    </p>
                                </div>

                                {/* Response Length */}
                                <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-blue-500/40 hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">Avg Response Length</span>
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                                            STAR Adherent
                                        </span>
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-3xl font-bold text-blue-400">
                                        2m 14s
                                    </div>
                                    <p className="text-xs font-['Inter'] text-[#c4c6cd]/80 mt-1.5">
                                        Target concise range: 1.5m to 3.0m
                                    </p>
                                </div>

                                {/* Pause Frequency & Cadence */}
                                <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">Pause Frequency</span>
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                                            Natural
                                        </span>
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-3xl font-bold text-emerald-400">
                                        2.1s <span className="text-base text-[#c4c6cd] font-normal">avg pause</span>
                                    </div>
                                    <p className="text-xs font-['Inter'] text-[#c4c6cd]/80 mt-1.5">
                                        Zero awkward dead air (&gt;5s) detected
                                    </p>
                                </div>

                            </div>

                            {/* Middle Grid: Timeline Curve + Filler Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                                
                                {/* Interactive Multi-Metric Progression Timeline (8 cols) */}
                                <div className="lg:col-span-8 glass-panel rounded-2xl p-6 lg:p-7 border border-[#334155] shadow-lg flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <div>
                                                <h4 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                                    Fluency Progression & Delivery Confidence
                                                </h4>
                                                <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                                    Confidence climb vs. filler reduction across simulated rounds
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
                                                <span className="flex items-center gap-1.5 text-[#818cf8]">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]"></span>
                                                    Confidence %
                                                </span>
                                                <span className="flex items-center gap-1.5 text-emerald-400">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                                    Fluency (Inverted Filler)
                                                </span>
                                            </div>
                                        </div>

                                        {/* SVG Chart */}
                                        <div className="h-64 w-full relative">
                                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                                                {/* Grid Lines */}
                                                <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="30" y2="30" />
                                                <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="80" y2="80" />
                                                <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="130" y2="130" />

                                                <defs>
                                                    <linearGradient id="scoreFillGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                                                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Score Area */}
                                                <path d={chartPaths.scoreArea} fill="url(#scoreFillGrad)" />

                                                {/* Confidence Curve */}
                                                <path
                                                    d={chartPaths.scoreLine}
                                                    fill="none"
                                                    stroke="#818cf8"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    className="path-draw"
                                                />

                                                {/* Filler Reduction Curve */}
                                                <path
                                                    d={chartPaths.fillerLine}
                                                    fill="none"
                                                    stroke="#34d399"
                                                    strokeWidth="2.5"
                                                    strokeDasharray="4 4"
                                                    strokeLinecap="round"
                                                />

                                                {/* Interactive Data Points */}
                                                {chartPaths.coords.map((pt, idx) => (
                                                    <g
                                                        key={idx}
                                                        className="cursor-pointer"
                                                        onMouseEnter={() => setHoveredPoint(pt)}
                                                        onMouseLeave={() => setHoveredPoint(null)}
                                                    >
                                                        <circle
                                                            cx={pt.x}
                                                            cy={pt.yScore}
                                                            r={hoveredPoint?.label === pt.label ? 7 : 4.5}
                                                            fill="#0F172A"
                                                            stroke="#818cf8"
                                                            strokeWidth="2.5"
                                                            className="transition-all duration-150"
                                                        />
                                                    </g>
                                                ))}
                                            </svg>

                                            {/* Hover Tooltip */}
                                            {hoveredPoint && (
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0F172A]/95 border border-[#818cf8]/50 px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] shadow-xl backdrop-blur-md pointer-events-none flex items-center gap-4 z-20">
                                                    <div>
                                                        <span className="text-[#c4c6cd]">{hoveredPoint.date}: </span>
                                                        <span className="text-[#818cf8] font-bold">{hoveredPoint.confidence}% Confidence</span>
                                                    </div>
                                                    <div className="h-4 w-px bg-[#334155]"></div>
                                                    <div>
                                                        <span className="text-[#c4c6cd]">Filler: </span>
                                                        <span className="text-emerald-400 font-bold">{hoveredPoint.fillerWpm} WPM</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* X-axis Labels */}
                                    <div className="flex justify-between font-['JetBrains_Mono'] text-xs text-[#c4c6cd] pt-2 border-t border-[#334155]/60 px-2">
                                        {chartPaths.coords.map((pt, idx) => (
                                            <span key={idx}>{pt.label}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Filler Word Breakdown & Tone Spectrum (4 cols) */}
                                <div className="lg:col-span-4 flex flex-col gap-6">
                                    
                                    {/* Filler Breakdown */}
                                    <div className="glass-panel rounded-2xl p-6 border border-[#334155] shadow-lg">
                                        <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0] mb-3 flex items-center justify-between">
                                            <span>Filler Word Breakdown</span>
                                            <span className="text-xs font-['JetBrains_Mono'] text-[#818cf8]">33 Total Logged</span>
                                        </h4>

                                        <div className="flex flex-col gap-3">
                                            {FILLER_BREAKDOWN.map((item, i) => (
                                                <div key={i} className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                                                        <span className="text-[#E2E8F0]">"{item.word}"</span>
                                                        <span className="text-[#c4c6cd]">{item.count}x ({item.percentage}%)</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tone & Emotion Spectrum */}
                                    <div className="glass-panel rounded-2xl p-6 border border-[#334155] shadow-lg">
                                        <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0] mb-3">
                                            Tone & Acoustic Analysis
                                        </h4>

                                        <div className="flex flex-col gap-2.5 text-xs font-['JetBrains_Mono']">
                                            {[
                                                { trait: 'Confidence & Assertiveness', score: 88, color: 'text-indigo-400' },
                                                { trait: 'Engagement & Energy', score: 84, color: 'text-purple-400' },
                                                { trait: 'Composure Under Stress', score: 82, color: 'text-blue-400' },
                                                { trait: 'Enunciation & Clarity', score: 91, color: 'text-emerald-400' }
                                            ].map((t, i) => (
                                                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-[#0F172A] border border-[#334155]">
                                                    <span className="text-[#c4c6cd]">{t.trait}</span>
                                                    <span className={`font-bold ${t.color}`}>{t.score}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        TAB 2: TECHNICAL ACCURACY & MASTERY
                    ========================================================= */}
                    {activeTab === 'technical' && (
                        <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-200">
                            
                            {/* Technical Rubric Scorecards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                
                                {[
                                    { title: 'Keyword & Terminology Coverage', score: 94, subtitle: 'Senior L5/L6 Rubric Match', icon: 'spellcheck', color: 'emerald' },
                                    { title: 'Technical Concept Accuracy', score: 89, subtitle: 'Algorithmic Invariants & Proofs', icon: 'verified', color: 'indigo' },
                                    { title: 'Problem Solving & Decomposition', score: 91, subtitle: 'STAR Framework Compliance', icon: 'account_tree', color: 'purple' },
                                    { title: 'Algorithm Explanation Quality', score: 86, subtitle: 'Time & Space Complexity Articulation', icon: 'data_object', color: 'blue' },
                                    { title: 'System Design Understanding', score: 84, subtitle: 'Distributed Primitives & CAP', icon: 'hub', color: 'amber' },
                                    { title: 'Answer Structure & Synthesis', score: 88, subtitle: 'Clear Executive Conclusion', icon: 'view_agenda', color: 'indigo' }
                                ].map((card, i) => (
                                    <div key={i} className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-[#818cf8]/40 hover:-translate-y-0.5 transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#818cf8]">
                                                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                                            </div>
                                            <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-emerald-400">
                                                {card.score}%
                                            </span>
                                        </div>
                                        <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                            {card.title}
                                        </h4>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-1">
                                            {card.subtitle}
                                        </p>
                                        <div className="w-full h-1.5 bg-[#020617] rounded-full overflow-hidden mt-3">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                style={{ width: `${card.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}

                            </div>

                            {/* Improving Skills vs Attention Needed Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                
                                {/* Skills Improving */}
                                <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-emerald-950/5 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-emerald-300">
                                                Skills on Upward Trajectory
                                            </h4>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold">+11% avg gain</span>
                                    </div>

                                    <div className="flex flex-col gap-3.5">
                                        {SKILLS_IMPROVING.map((s, i) => (
                                            <div key={i} className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155]">
                                                <div className="flex justify-between items-center text-xs font-['JetBrains_Mono'] mb-1.5">
                                                    <span className="text-[#E2E8F0] font-medium">{s.name}</span>
                                                    <span className="text-emerald-400 font-bold">{s.delta}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd] mb-1">
                                                    <span>{s.category}</span>
                                                    <span className="font-bold text-[#818cf8]">{s.score}% Mastery</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-[#020617] rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${s.score}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Needing Attention */}
                                <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 bg-amber-950/5 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-amber-300">
                                                Skills Needing Targeted Practice
                                            </h4>
                                        </div>
                                        <span className="text-xs font-['JetBrains_Mono'] text-amber-400 font-bold">Action Required</span>
                                    </div>

                                    <div className="flex flex-col gap-3.5">
                                        {SKILLS_NEEDS_ATTENTION.map((s, i) => (
                                            <div key={i} className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155]">
                                                <div className="flex justify-between items-center text-xs font-['JetBrains_Mono'] mb-1.5">
                                                    <span className="text-[#E2E8F0] font-medium">{s.name}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        {s.urgency} Priority
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd] mb-1">
                                                    <span>{s.category}</span>
                                                    <span className="font-bold text-amber-400">{s.score}% Mastery</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-[#020617] rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${s.score}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        COMPARATIVE BENCHMARKS (COHORT PERCENTILE RANKINGS)
                    ========================================================= */}
                    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-[#818cf8] text-[18px]">leaderboard</span>
                                    <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                        Verified Peer Cohort Comparison
                                    </span>
                                </div>
                                <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#E2E8F0]">
                                    Percentile Rankings vs. 4,500+ Senior Candidates
                                </h3>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] font-bold bg-indigo-600/20 text-[#818cf8] border border-indigo-500/30 self-start sm:self-auto">
                                🏆 Tier 1 Competitive Profile
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {BENCHMARKS.map((b, i) => (
                                <div key={i} className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between gap-4">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                {b.title}
                                            </h4>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shrink-0">
                                                {b.badge}
                                            </span>
                                        </div>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd]">
                                            Benchmark against {b.cohort}
                                        </p>
                                    </div>

                                    {/* Percentile Progress Bar */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                                            <span className="text-[#c4c6cd]">Cohort Avg: {b.cohortAvg}</span>
                                            <span className="text-emerald-400 font-bold">Your Score: {b.userScore}</span>
                                        </div>
                                        <div className="w-full h-3 bg-[#020617] rounded-full relative overflow-hidden border border-[#334155]/60 p-0.5">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000"
                                                style={{ width: `${b.percentile}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#c4c6cd]/70">
                                            <span>0th Pct</span>
                                            <span>50th Median</span>
                                            <span>99th Elite</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =========================================================
                        STRENGTHS VS WEAKNESSES MATRIX
                    ========================================================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        
                        {/* LEFT: Top Strengths */}
                        <div className="glass-panel rounded-2xl p-6 lg:p-7 border border-emerald-500/30 bg-[#0F172A]/80 shadow-lg flex flex-col gap-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                                </div>
                                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-emerald-400">
                                    Top Validated Strengths
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3">
                                {TOP_STRENGTHS.map((st, i) => (
                                    <div key={i} className="p-3.5 rounded-xl bg-[#1E293B]/40 border border-[#334155]/60 flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-['JetBrains_Mono'] shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                {st.title}
                                            </h4>
                                            <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5 leading-relaxed">
                                                {st.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Recurring Weaknesses */}
                        <div className="glass-panel rounded-2xl p-6 lg:p-7 border border-amber-500/30 bg-[#0F172A]/80 shadow-lg flex flex-col gap-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <span className="material-symbols-outlined text-[20px]">flag</span>
                                </div>
                                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-amber-400">
                                    Recurring Weaknesses to Overcome
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3">
                                {RECURRING_WEAKNESSES.map((wk, i) => (
                                    <div key={i} className="p-3.5 rounded-xl bg-[#1E293B]/40 border border-[#334155]/60 flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold font-['JetBrains_Mono'] shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                {wk.title}
                                            </h4>
                                            <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5 leading-relaxed">
                                                {wk.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* =========================================================
                        THIRD SECTION: HIGH PRIORITY TOPICS TO REVISE
                    ========================================================= */}
                    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-purple-400 text-[18px]">menu_book</span>
                                    <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-purple-400 font-bold">
                                        Targeted Curriculum Recommendations
                                    </span>
                                </div>
                                <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#E2E8F0]">
                                    High Priority Topics to Revise
                                </h3>
                            </div>
                            <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                Ranked by projected interview score bump
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {HIGH_PRIORITY_TOPICS.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col justify-between gap-4 group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                                                <span className="material-symbols-outlined text-[20px]">{topic.icon}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                                {topic.scoreImpact}
                                            </span>
                                        </div>

                                        <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0] group-hover:text-white transition-colors">
                                            {topic.title}
                                        </h4>

                                        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                                            {topic.tags.map((t, idx) => (
                                                <span key={idx} className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#171f33] text-[#c4c6cd] border border-[#334155]">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2 border-t border-[#334155]/60">
                                        <div className="flex justify-between text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">
                                            <span>Current Mastery</span>
                                            <span className="font-bold text-amber-400">{topic.mastery}%</span>
                                        </div>
                                        <button
                                            onClick={() => navigate('/interview/setup')}
                                            className="w-full py-2 rounded-lg btn-secondary text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all cursor-pointer"
                                        >
                                            <span>Start Drill</span>
                                            <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

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
                <button onClick={() => navigate('/analytics')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        insights
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Analytics</span>
                </button>
                <button onClick={() => navigate('/interview/setup')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
            </nav>
        </div>
    )
}

export default Analytics
