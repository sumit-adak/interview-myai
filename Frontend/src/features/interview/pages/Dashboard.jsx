import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

// Animated Count-Up helper component
const AnimatedNumber = ({ value, duration = 1200, prefix = '', suffix = '' }) => {
    const [displayVal, setDisplayVal] = useState(0)

    useEffect(() => {
        let startTime = null
        const startVal = 0
        const targetVal = typeof value === 'number' ? value : parseFloat(value) || 0

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(startVal + (targetVal - startVal) * easeOutProgress)
            setDisplayVal(current)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        const animId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animId)
    }, [value, duration])

    return (
        <span>
            {prefix}{displayVal}{suffix}
        </span>
    )
}

const TIME_RANGES = {
    '7D': {
        label: '7 Days',
        points: [
            { label: 'Mon', score: 74, accuracy: '82%', round: 'Mock Tech 1', date: 'Aug 17' },
            { label: 'Tue', score: 78, accuracy: '84%', round: 'Algorithm Drill', date: 'Aug 18' },
            { label: 'Wed', score: 76, accuracy: '80%', round: 'Behavioral', date: 'Aug 19' },
            { label: 'Thu', score: 82, accuracy: '88%', round: 'System Design', date: 'Aug 20' },
            { label: 'Fri', score: 85, accuracy: '90%', round: 'Live Coding', date: 'Aug 21' },
            { label: 'Sat', score: 88, accuracy: '91%', round: 'Frontend Arch', date: 'Aug 22' },
            { label: 'Sun', score: 91, accuracy: '95%', round: 'Full Simulation', date: 'Today' }
        ],
        avg: '82%'
    },
    '30D': {
        label: '30 Days',
        points: [
            { label: 'Week 1', score: 72, accuracy: '78%', round: 'Baseline Test', date: 'Aug 01' },
            { label: 'Week 2', score: 78, accuracy: '83%', round: 'Core DSA', date: 'Aug 08' },
            { label: 'Week 3', score: 84, accuracy: '89%', round: 'System Arch', date: 'Aug 15' },
            { label: 'Week 4', score: 89, accuracy: '93%', round: 'Behavioral Sprint', date: 'Aug 22' },
            { label: 'Current', score: 91, accuracy: '95%', round: 'Final Mock', date: 'Today' }
        ],
        avg: '82.8%'
    },
    '3M': {
        label: '3 Months',
        points: [
            { label: 'Jun 1', score: 65, accuracy: '70%', round: 'Initial Baseline', date: 'Jun 01' },
            { label: 'Jun 15', score: 71, accuracy: '76%', round: 'Mid-Jun Practice', date: 'Jun 15' },
            { label: 'Jul 1', score: 78, accuracy: '82%', round: 'System Design', date: 'Jul 01' },
            { label: 'Jul 15', score: 83, accuracy: '87%', round: 'Leadership Prep', date: 'Jul 15' },
            { label: 'Aug 1', score: 87, accuracy: '90%', round: 'Advanced Tech', date: 'Aug 01' },
            { label: 'Aug 23', score: 91, accuracy: '95%', round: 'Current Level', date: 'Aug 23' }
        ],
        avg: '79.2%'
    },
    'ALL': {
        label: 'All Time',
        points: [
            { label: 'Start', score: 58, accuracy: '64%', round: 'Day 1 Evaluation', date: 'May 10' },
            { label: 'M1', score: 68, accuracy: '73%', round: 'DSA Sprint', date: 'Jun 01' },
            { label: 'M2', score: 77, accuracy: '81%', round: 'Frontend Mastery', date: 'Jul 01' },
            { label: 'M3', score: 84, accuracy: '89%', round: 'System Design Pro', date: 'Aug 01' },
            { label: 'Now', score: 91, accuracy: '95%', round: 'Peak Readiness', date: 'Aug 23' }
        ],
        avg: '75.6%'
    }
}

const SKILLS_DATA = [
    { name: 'Technical Knowledge', key: 'tech', score: 92, angle: 0, labelShort: 'Technical' },
    { name: 'Communication', key: 'comm', score: 85, angle: 90, labelShort: 'Communication' },
    { name: 'Confidence', key: 'conf', score: 78, angle: 180, labelShort: 'Confidence' },
    { name: 'Logic / Problem Solving', key: 'logic', score: 88, angle: 270, labelShort: 'Logic' }
]

const RECENT_ACTIVITIES = [
    {
        id: 'rec-1',
        role: 'Senior Full Stack Developer',
        type: 'Technical Simulation',
        date: 'Today, 2:30 PM',
        score: 92,
        status: 'Completed',
        statusColor: 'emerald',
        duration: '45 mins',
        topics: ['System Design', 'React 19', 'Concurrency']
    },
    {
        id: 'rec-2',
        role: 'Backend System Architect',
        type: 'System Design Round',
        date: 'Yesterday, 6:15 PM',
        score: 84,
        status: 'Passed',
        statusColor: 'indigo',
        duration: '60 mins',
        topics: ['Distributed Caching', 'Database Sharding']
    },
    {
        id: 'rec-3',
        role: 'Frontend Specialist',
        type: 'Behavioral & Leadership',
        date: 'Aug 21, 2026',
        score: 88,
        status: 'Completed',
        statusColor: 'emerald',
        duration: '30 mins',
        topics: ['STAR Method', 'Cross-team Conflict']
    },
    {
        id: 'rec-4',
        role: 'Cloud & DevOps Engineer',
        type: 'Architecture Review',
        date: 'Aug 19, 2026',
        score: 79,
        status: 'Needs Review',
        statusColor: 'amber',
        duration: '40 mins',
        topics: ['Kubernetes', 'CI/CD Optimization']
    }
]

const Dashboard = () => {
    const navigate = useNavigate()
    const [animated, setAnimated] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [timeRange, setTimeRange] = useState('30D')
    const [activePoint, setActivePoint] = useState(null)
    const [hoveredSkill, setHoveredSkill] = useState(null)
    const [hoveredActivity, setHoveredActivity] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true)
        }, 50)
        return () => clearTimeout(timer)
    }, [])

    // Performance Chart Calculations
    const currentPoints = useMemo(() => {
        const data = TIME_RANGES[timeRange].points
        const count = data.length
        const width = 800
        const height = 180
        const topPadding = 20
        const bottomPadding = 30
        const minScore = 50
        const maxScore = 100

        return data.map((pt, index) => {
            const cx = count === 1 ? width / 2 : (index / (count - 1)) * (width - 60) + 30
            const normalizedY = (pt.score - minScore) / (maxScore - minScore)
            const cy = height - bottomPadding - normalizedY * (height - topPadding - bottomPadding)
            return {
                ...pt,
                cx: Math.round(cx),
                cy: Math.round(cy)
            }
        })
    }, [timeRange])

    // Generate smooth SVG curve path
    const chartPaths = useMemo(() => {
        if (!currentPoints.length) return { linePath: '', areaPath: '' }

        if (currentPoints.length === 1) {
            const pt = currentPoints[0]
            return {
                linePath: `M${pt.cx},${pt.cy}`,
                areaPath: `M${pt.cx},${pt.cy} L${pt.cx},200 Z`
            }
        }

        let linePath = `M ${currentPoints[0].cx},${currentPoints[0].cy}`
        for (let i = 0; i < currentPoints.length - 1; i++) {
            const curr = currentPoints[i]
            const next = currentPoints[i + 1]
            const mx = (curr.cx + next.cx) / 2
            linePath += ` C ${mx},${curr.cy} ${mx},${next.cy} ${next.cx},${next.cy}`
        }

        const last = currentPoints[currentPoints.length - 1]
        const first = currentPoints[0]
        const areaPath = `${linePath} L ${last.cx},200 L ${first.cx},200 Z`

        return { linePath, areaPath }
    }, [currentPoints])

    // Radar Chart Calculations (Center: 110, 110 | Radius: 70)
    const radarCenter = { x: 110, y: 110 }
    const radarMaxRadius = 70

    const getRadarCoordinates = (angleDeg, valuePercent) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180
        const r = (valuePercent / 100) * radarMaxRadius
        return {
            x: radarCenter.x + r * Math.cos(rad),
            y: radarCenter.y + r * Math.sin(rad)
        }
    }

    const radarPolyPoints = useMemo(() => {
        return SKILLS_DATA.map(skill => {
            const coords = getRadarCoordinates(skill.angle, skill.score)
            return `${coords.x},${coords.y}`
        }).join(' ')
    }, [])

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
                    aria-label="New Session"
                >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </button>
            </nav>

            {/* Desktop Slate Sidebar */}
            <SlateSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen flex flex-col relative pb-20 md:pb-8">
                <div className="scanline"></div>

                {/* Top Search & Profile Bar (Desktop) */}
                <header className="hidden md:flex justify-between items-center px-8 py-4 border-b border-[#334155] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative w-96">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c6cd] text-[18px]">
                            search
                        </span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2 font-['Inter'] text-[14px] text-[#dae2fd] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#c4c6cd]/50"
                            placeholder="Search interviews, skills, metrics..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/interview/setup')}
                            className="btn-primary rounded-lg px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                            Start Session
                        </button>
                        <button className="p-2 text-[#c4c6cd] hover:text-[#E2E8F0] transition-colors relative">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#6366f1] rounded-full ring-2 ring-[#0b1326] animate-pulse"></span>
                        </button>
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Welcome Header */}
                    <div className={`stagger-item ${animated ? 'fade-up' : ''} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-semibold bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                                    AI Readiness: Ready to Interview
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Good evening, Sumit 👋
                            </h2>
                            <p className="font-['Inter'] text-[15px] md:text-[16px] text-[#c4c6cd] mt-0.5">
                                Your mock interview performance is up <span className="text-emerald-400 font-semibold">+18%</span> this week.
                            </p>
                        </div>

                        {/* Top Quick Resume Badge */}
                        <div className="hidden sm:flex items-center gap-3 bg-[#0F172A]/80 border border-[#334155] rounded-xl px-4 py-2.5 backdrop-blur-sm self-start md:self-auto shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            </div>
                            <div className="text-left">
                                <div className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#E2E8F0]">Target Role</div>
                                <div className="font-['JetBrains_Mono'] text-xs text-[#818cf8]">Senior Full Stack Dev</div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        PRIMARY CARD (HERO WITH UPGRADED CTA)
                    ========================================================= */}
                    <div
                        className={`glass-modal rounded-2xl p-6 lg:p-8 stagger-item ${
                            animated ? 'fade-up delay-100' : ''
                        } relative overflow-hidden group border border-[#334155] shadow-[0_20px_45px_rgba(0,0,0,0.35)]`}
                    >
                        {/* Decorative Gradient Glows */}
                        <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-transparent blur-[90px] rounded-full pointer-events-none group-hover:from-purple-600/30 transition-all duration-700"></div>
                        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1E293B] border border-[#334155] mb-3">
                                    <span className="material-symbols-outlined text-[#818cf8] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        auto_awesome
                                    </span>
                                    <span className="font-['JetBrains_Mono'] text-[12px] text-[#c4c6cd]">
                                        Next Milestone: <strong className="text-[#E2E8F0]">System Design Mastery</strong>
                                    </span>
                                </div>
                                <h3 className="font-['Hanken_Grotesk'] text-[22px] md:text-[26px] font-bold text-[#E2E8F0] leading-snug">
                                    Continue Your Interview Journey
                                </h3>
                                <p className="font-['Inter'] text-[14px] md:text-[15px] text-[#c4c6cd] mt-1.5 leading-relaxed">
                                    Simulate high-pressure behavioral and technical rounds with adaptive AI feedback tuned for top-tier engineering roles.
                                </p>
                            </div>

                            {/* Upgraded Primary CTA Button */}
                            <button
                                onClick={() => navigate('/interview/setup')}
                                className="group relative overflow-hidden rounded-xl px-7 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white font-['JetBrains_Mono'] text-[14px] font-bold shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.55)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 shrink-0 cursor-pointer border border-white/10"
                            >
                                <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                                    play_arrow
                                </span>
                                <span className="tracking-wide">Start New Interview</span>
                                <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1.5">
                                    arrow_forward
                                </span>
                                {/* Ambient Sheen Layer */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"></div>
                            </button>
                        </div>

                        {/* Module Progress Bar */}
                        <div className="mt-8 pt-6 border-t border-[#334155]/60 relative z-10">
                            <div className="flex flex-wrap justify-between items-center font-['JetBrains_Mono'] text-[12px] text-[#c4c6cd] mb-2.5 gap-2">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#818cf8]"></span>
                                    <span>Curriculum Progress • Module 3: Behavioral & System Design</span>
                                </span>
                                <span className="text-[#818cf8] font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                                    65% Completed
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-[#020617] rounded-full overflow-hidden border border-[#334155]/60 p-0.5">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%] rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-1000"></div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        TOP KPI METRIC SECTION (4 DEDICATED KPI CARDS)
                    ========================================================= */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger-item ${animated ? 'fade-up delay-200' : ''}`}>
                        
                        {/* KPI 1: Total Interviews */}
                        <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[13px] font-medium">
                                    <span className="w-7 h-7 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#818cf8] group-hover:border-indigo-500/40 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                                    </span>
                                    Total Interviews
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                    +12% mo
                                </span>
                            </div>
                            <div className="font-['Hanken_Grotesk'] text-[32px] md:text-[36px] text-[#E2E8F0] font-bold tracking-tight">
                                {animated ? <AnimatedNumber value={24} duration={1200} /> : '0'}
                            </div>
                            <div className="text-[12px] font-['Inter'] text-[#c4c6cd]/80 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                6 completed in past 7 days
                            </div>
                        </div>

                        {/* KPI 2: Average Score */}
                        <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[13px] font-medium">
                                    <span className="w-7 h-7 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-purple-400 group-hover:border-purple-500/40 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">query_stats</span>
                                    </span>
                                    Average Score
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                    +4.2%
                                </span>
                            </div>
                            <div className="font-['Hanken_Grotesk'] text-[32px] md:text-[36px] text-[#818cf8] font-bold tracking-tight">
                                {animated ? <AnimatedNumber value={86} duration={1400} suffix="%" /> : '0%'}
                            </div>
                            <div className="text-[12px] font-['Inter'] text-[#c4c6cd]/80 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Top 15% candidate tier
                            </div>
                        </div>

                        {/* KPI 3: Current Streak */}
                        <div className="glass-panel rounded-2xl p-5 border border-[#334155] hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[13px] font-medium">
                                    <span className="w-7 h-7 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-amber-400 group-hover:border-amber-500/40 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            local_fire_department
                                        </span>
                                    </span>
                                    Current Streak
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold">
                                    Active 🔥
                                </span>
                            </div>
                            <div className="font-['Hanken_Grotesk'] text-[32px] md:text-[36px] text-amber-300 font-bold tracking-tight flex items-baseline gap-1.5">
                                {animated ? <AnimatedNumber value={7} duration={1000} /> : '0'}
                                <span className="text-[18px] text-[#c4c6cd] font-semibold">Days</span>
                            </div>
                            <div className="text-[12px] font-['Inter'] text-[#c4c6cd]/80 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                Personal best: 12 days
                            </div>
                        </div>

                        {/* KPI 4: Improvement */}
                        <div className="glass-panel ai-feedback-card rounded-2xl p-5 border border-[#334155] hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[13px] font-medium">
                                    <span className="w-7 h-7 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">insights</span>
                                    </span>
                                    Improvement
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                                    +18% 🚀
                                </span>
                            </div>
                            <div className="font-['Hanken_Grotesk'] text-[32px] md:text-[36px] text-emerald-400 font-bold tracking-tight">
                                {animated ? <AnimatedNumber value={18} duration={1300} prefix="+" suffix="%" /> : '+0%'}
                            </div>
                            <div className="text-[12px] font-['Inter'] text-[#c4c6cd]/80 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Evaluated vs. initial baseline
                            </div>
                        </div>

                    </div>

                    {/* =========================================================
                        MAIN ANALYTICS SECTION (CHART + SIDE PANEL)
                    ========================================================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        
                        {/* Left Column (8 cols): Main Performance Line Chart */}
                        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                            
                            <div
                                className={`glass-panel rounded-2xl p-6 lg:p-8 stagger-item ${
                                    animated ? 'fade-up delay-300' : ''
                               } border border-[#334155] relative shadow-lg`}
                            >
                                {/* Chart Header with Range Selector */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-['Hanken_Grotesk'] text-[20px] md:text-[22px] font-semibold text-[#E2E8F0]">
                                                Performance Trend
                                            </h3>
                                            <span className="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-[#1E293B] text-[#818cf8] border border-[#334155]">
                                                Avg {TIME_RANGES[timeRange].avg}
                                            </span>
                                        </div>
                                        <p className="font-['Inter'] text-[13px] text-[#c4c6cd] mt-0.5">
                                            Score trajectory & accuracy rate across simulated AI rounds
                                        </p>
                                    </div>

                                    {/* Time Range Pills */}
                                    <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-[#334155] self-start sm:self-auto">
                                        {['7D', '30D', '3M', 'ALL'].map((rangeKey) => (
                                            <button
                                                key={rangeKey}
                                                onClick={() => {
                                                    setTimeRange(rangeKey)
                                                    setActivePoint(null)
                                                }}
                                                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
                                                    timeRange === rangeKey
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                                                        : 'text-[#c4c6cd] hover:text-[#E2E8F0] hover:bg-white/5'
                                                }`}
                                            >
                                                {rangeKey === 'ALL' ? 'All Time' : rangeKey}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* SVG Interactive Chart Canvas */}
                                <div className="h-64 sm:h-72 w-full relative">
                                    <svg
                                        className="w-full h-full overflow-visible"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 800 200"
                                    >
                                        {/* Horizontal Grid Lines */}
                                        <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="30" y2="30" />
                                        <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="75" y2="75" />
                                        <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="120" y2="120" />
                                        <line stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="770" y1="165" y2="165" />

                                        {/* Benchmark Target Reference Line (85% Score = Y: 60) */}
                                        <line stroke="rgba(129, 140, 248, 0.3)" strokeDasharray="4 4" strokeWidth="1.2" x1="30" x2="770" y1="60" y2="60" />
                                        <text x="765" y="55" fill="rgba(129, 140, 248, 0.6)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
                                            Target: 85%
                                        </text>

                                        {/* Gradients */}
                                        <defs>
                                            <linearGradient id="mainChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="50%" stopColor="#818cf8" />
                                                <stop offset="100%" stopColor="#c084fc" />
                                            </linearGradient>
                                            <linearGradient id="mainFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.35)" />
                                                <stop offset="60%" stopColor="rgba(147, 51, 234, 0.08)" />
                                                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.0)" />
                                            </linearGradient>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="3" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>

                                        {/* Gradient Area Fill */}
                                        <path
                                            key={`area-${timeRange}`}
                                            d={chartPaths.areaPath}
                                            fill="url(#mainFillGradient)"
                                            className="transition-all duration-700 ease-out"
                                        />

                                        {/* Main Curve Stroke */}
                                        <path
                                            key={`line-${timeRange}`}
                                            d={chartPaths.linePath}
                                            fill="none"
                                            stroke="url(#mainChartGradient)"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3.5"
                                            filter="url(#glow)"
                                            className="path-draw"
                                        />

                                        {/* Interactive Data Points */}
                                        {currentPoints.map((pt, idx) => {
                                            const isSelected = activePoint?.label === pt.label
                                            return (
                                                <g
                                                    key={idx}
                                                    className="cursor-pointer group"
                                                    onMouseEnter={() => setActivePoint(pt)}
                                                    onMouseLeave={() => setActivePoint(null)}
                                                    onClick={() => setActivePoint(pt)}
                                                >
                                                    {/* Outer Hover Ring */}
                                                    <circle
                                                        cx={pt.cx}
                                                        cy={pt.cy}
                                                        r={isSelected ? 12 : 7}
                                                        fill="rgba(99, 102, 241, 0.2)"
                                                        className="transition-all duration-200"
                                                    />
                                                    {/* Node Core */}
                                                    <circle
                                                        cx={pt.cx}
                                                        cy={pt.cy}
                                                        r={isSelected ? 6 : 4.5}
                                                        fill="#0F172A"
                                                        stroke={isSelected ? '#c084fc' : '#818cf8'}
                                                        strokeWidth="2.5"
                                                        className="transition-all duration-200"
                                                    />
                                                    {/* Hidden transparent hit area */}
                                                    <circle cx={pt.cx} cy={pt.cy} r={20} fill="transparent" />
                                                </g>
                                            )
                                        })}
                                    </svg>

                                    {/* Rich Interactive Floating Tooltip */}
                                    {activePoint && (
                                        <div
                                            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F172A]/95 border border-[#818cf8]/50 px-4 py-2.5 rounded-xl text-xs font-['JetBrains_Mono'] shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-4 z-20 animate-in fade-in zoom-in-95 duration-150"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[#c4c6cd] text-[11px]">{activePoint.date} • {activePoint.round}</span>
                                                <span className="text-[#E2E8F0] font-bold text-sm">
                                                    Score: <span className="text-emerald-400">{activePoint.score}%</span>
                                                </span>
                                            </div>
                                            <div className="h-6 w-px bg-[#334155]"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[#c4c6cd] text-[11px]">Accuracy</span>
                                                <span className="text-[#818cf8] font-bold text-sm">{activePoint.accuracy}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* X-Axis Labels */}
                                <div className="flex justify-between mt-3 px-2 font-['JetBrains_Mono'] text-[12px] text-[#c4c6cd] border-t border-[#334155]/40 pt-2.5">
                                    {currentPoints.map((pt, idx) => (
                                        <span
                                            key={idx}
                                            className={`transition-colors ${
                                                activePoint?.label === pt.label
                                                    ? 'text-[#818cf8] font-bold'
                                                    : 'hover:text-[#E2E8F0]'
                                            }`}
                                        >
                                            {pt.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* =========================================================
                                RECENT ACTIVITY SECTION
                            ========================================================= */}
                            <div
                                className={`glass-panel rounded-2xl p-6 lg:p-8 stagger-item ${
                                    animated ? 'fade-up delay-400' : ''
                                } border border-[#334155] shadow-lg`}
                            >
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-[20px] md:text-[22px] font-semibold text-[#E2E8F0]">
                                            Recent Activity
                                        </h3>
                                        <p className="font-['Inter'] text-[13px] text-[#c4c6cd] mt-0.5">
                                            Log of your latest simulated rounds and AI evaluations
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="text-xs font-['JetBrains_Mono'] text-[#818cf8] hover:text-white px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>New Round</span>
                                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {RECENT_ACTIVITIES.map((activity) => (
                                        <div
                                            key={activity.id}
                                            onClick={() => navigate('/interview/setup')}
                                            onMouseEnter={() => setHoveredActivity(activity.id)}
                                            onMouseLeave={() => setHoveredActivity(null)}
                                            className="p-4 rounded-xl bg-[#0F172A]/70 hover:bg-[#1E293B]/80 border border-[#334155] hover:border-[#818cf8]/40 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                        >
                                            {/* Role & Details */}
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] group-hover:border-indigo-500/40 flex items-center justify-center text-[#818cf8] shrink-0 transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {activity.type.includes('Technical') ? 'terminal' : activity.type.includes('System') ? 'hub' : 'psychology'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-['Hanken_Grotesk'] text-[15px] font-semibold text-[#E2E8F0] group-hover:text-white transition-colors">
                                                            {activity.role}
                                                        </span>
                                                        <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#171f33] text-[#818cf8] border border-indigo-500/20">
                                                            {activity.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[12px] font-['Inter'] text-[#c4c6cd] mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                            {activity.date}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{activity.duration}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score & Status */}
                                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                                                <div className="text-right">
                                                    <div className="font-['Hanken_Grotesk'] text-[18px] font-bold text-emerald-400">
                                                        {activity.score}%
                                                    </div>
                                                    <div className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">
                                                        Overall Score
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-['JetBrains_Mono'] font-medium border ${
                                                        activity.score >= 85
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : activity.score >= 80
                                                            ? 'bg-indigo-500/10 text-[#818cf8] border-indigo-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}
                                                >
                                                    {activity.status}
                                                </span>
                                                <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all text-[18px]">
                                                    chevron_right
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Right Column (4 cols): Radar Chart & Quick Actions */}
                        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                            
                            {/* Dynamic Spider / Radar Skill Breakdown Chart */}
                            <div
                                className={`glass-panel rounded-2xl p-6 stagger-item ${
                                    animated ? 'fade-up delay-400' : ''
                                } flex flex-col border border-[#334155] shadow-lg`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#E2E8F0]">
                                            Skill Breakdown
                                        </h3>
                                        <p className="font-['Inter'] text-[12px] text-[#c4c6cd]">
                                            Multi-axis AI competency assessment
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#818cf8] text-[20px]">
                                        radar
                                    </span>
                                </div>

                                {/* SVG Radar Canvas */}
                                <div className="flex items-center justify-center relative py-4">
                                    <svg
                                        className="w-full max-w-[240px] h-auto overflow-visible"
                                        viewBox="0 0 220 220"
                                    >
                                        {/* Radial Web Rings (25%, 50%, 75%, 100%) */}
                                        {[25, 50, 75, 100].map((level) => {
                                            const pts = [0, 90, 180, 270].map(deg => {
                                                const coords = getRadarCoordinates(deg, level)
                                                return `${coords.x},${coords.y}`
                                            }).join(' ')
                                            return (
                                                <polygon
                                                    key={level}
                                                    points={pts}
                                                    fill={level === 100 ? 'rgba(30, 41, 59, 0.25)' : 'none'}
                                                    stroke="rgba(255, 255, 255, 0.08)"
                                                    strokeWidth={level === 100 ? '1.2' : '0.8'}
                                                />
                                            )
                                        })}

                                        {/* Web Axes Lines */}
                                        <line x1={radarCenter.x} y1={radarCenter.y - radarMaxRadius} x2={radarCenter.x} y2={radarCenter.y + radarMaxRadius} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                                        <line x1={radarCenter.x - radarMaxRadius} y1={radarCenter.y} x2={radarCenter.x + radarMaxRadius} y2={radarCenter.y} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                                        {/* Filled Data Polygon */}
                                        <polygon
                                            points={radarPolyPoints}
                                            fill="rgba(99, 102, 241, 0.25)"
                                            stroke="#818cf8"
                                            strokeWidth="2"
                                            className="path-draw"
                                        />

                                        {/* Vertices and Interactive Points */}
                                        {SKILLS_DATA.map((skill) => {
                                            const coords = getRadarCoordinates(skill.angle, skill.score)
                                            const isHovered = hoveredSkill?.key === skill.key
                                            return (
                                                <g
                                                    key={skill.key}
                                                    className="cursor-pointer"
                                                    onMouseEnter={() => setHoveredSkill(skill)}
                                                    onMouseLeave={() => setHoveredSkill(null)}
                                                >
                                                    <circle
                                                        cx={coords.x}
                                                        cy={coords.y}
                                                        r={isHovered ? 6 : 4}
                                                        fill="#0F172A"
                                                        stroke="#c084fc"
                                                        strokeWidth="2"
                                                        className="transition-all duration-200"
                                                    />
                                                </g>
                                            )
                                        })}

                                        {/* Radar Axis Labels */}
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" textAnchor="middle" x="110" y="24">
                                            Technical (92%)
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" textAnchor="start" x="188" y="113">
                                            Comm (85%)
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" textAnchor="middle" x="110" y="202">
                                            Confidence (78%)
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" textAnchor="end" x="32" y="113">
                                            Logic (88%)
                                        </text>
                                    </svg>
                                </div>

                                {/* Detailed Skill Breakdown Progress Bars */}
                                <div className="flex flex-col gap-2.5 mt-2 pt-3 border-t border-[#334155]/60">
                                    {SKILLS_DATA.map((skill) => (
                                        <div
                                            key={skill.key}
                                            onMouseEnter={() => setHoveredSkill(skill)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                hoveredSkill?.key === skill.key ? 'bg-[#1E293B]/80' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between items-center text-xs font-['JetBrains_Mono'] mb-1">
                                                <span className="text-[#c4c6cd]">{skill.name}</span>
                                                <span className="text-[#818cf8] font-bold">{skill.score}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#020617] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                                                    style={{ width: `${skill.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div
                                className={`glass-panel rounded-2xl p-6 stagger-item ${
                                    animated ? 'fade-up delay-500' : ''
                                } border border-[#334155] shadow-lg`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#E2E8F0]">
                                        Quick Actions
                                    </h3>
                                    <span className="material-symbols-outlined text-[#c4c6cd] text-[18px]">
                                        bolt
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* Action 1: Start New Interview */}
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="w-full bg-gradient-to-r from-[#1E293B] to-[#0F172A] hover:from-[#2d3748] hover:to-[#1a202c] border border-[#334155] hover:border-indigo-500/50 rounded-xl p-3.5 font-['JetBrains_Mono'] text-[13px] flex items-center justify-between group cursor-pointer transition-all duration-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 text-[#E2E8F0]">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[#818cf8] group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    play_circle
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-[#E2E8F0]">Start New Interview</div>
                                                <div className="text-[11px] text-[#c4c6cd] font-['Inter']">Launch full simulation</div>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </button>

                                    {/* Action 2: Practice Questions */}
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="w-full bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-purple-500/50 rounded-xl p-3.5 font-['JetBrains_Mono'] text-[13px] flex items-center justify-between group cursor-pointer transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 text-[#E2E8F0]">
                                            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    model_training
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-[#E2E8F0]">Practice Questions</div>
                                                <div className="text-[11px] text-[#c4c6cd] font-['Inter']">Drill role-specific prompts</div>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </button>

                                    {/* Action 3: Analyze Resume */}
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="w-full bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-blue-500/50 rounded-xl p-3.5 font-['JetBrains_Mono'] text-[13px] flex items-center justify-between group cursor-pointer transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 text-[#E2E8F0]">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    upload_file
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-[#E2E8F0]">Analyze Resume</div>
                                                <div className="text-[11px] text-[#c4c6cd] font-['Inter']">Tailor rounds to your CV</div>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#334155] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        dashboard
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Overview</span>
                </button>
                <button onClick={() => navigate('/interview/setup')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
                <button onClick={() => navigate('/interview/setup')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Resume</span>
                </button>
                <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">home</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Home</span>
                </button>
            </nav>
        </div>
    )
}

export default Dashboard
