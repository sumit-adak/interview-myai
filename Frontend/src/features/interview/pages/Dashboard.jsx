import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

const Dashboard = () => {
    const navigate = useNavigate()
    const [animated, setAnimated] = useState(false)
    const [activePoint, setActivePoint] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true)
        }, 50)
        return () => clearTimeout(timer)
    }, [])

    const dataPoints = [
        { cx: 200, cy: 120, label: 'Week 1', score: '72%' },
        { cx: 400, cy: 90, label: 'Week 2', score: '78%' },
        { cx: 600, cy: 40, label: 'Week 3', score: '84%' },
        { cx: 800, cy: 20, label: 'Week 4', score: '91%' }
    ]

    return (
        <div className="bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] antialiased overflow-x-hidden min-h-screen flex selection:bg-[#b8c8e0] selection:text-[#223144]">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#334155] shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#E2E8F0] cursor-pointer">
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
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2 font-['Inter'] text-[14px] text-[#dae2fd] focus:outline-none focus:border-[#4A5568] focus:ring-1 focus:ring-[#4A5568]/50 transition-all placeholder:text-[#c4c6cd]/50"
                            placeholder="Search interviews, metrics..."
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
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#4A5568] rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    {/* Welcome Header */}
                    <div className={`stagger-item ${animated ? 'fade-up' : ''} mb-2`}>
                        <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[36px] md:text-[40px] text-[#E2E8F0] font-bold tracking-tight">
                            Good evening, Sumit 👋
                        </h2>
                        <p className="font-['Inter'] text-[16px] md:text-[18px] text-[#c4c6cd] mt-1">
                            Ready to level up your interview skills?
                        </p>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Left Column (Main Focus) */}
                        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                            {/* Primary Card */}
                            <div
                                className={`glass-modal rounded-xl p-6 lg:p-8 stagger-item ${
                                    animated ? 'fade-up delay-100' : ''
                                } relative overflow-hidden group border border-[#334155]`}
                            >
                                {/* Decorative Glow */}
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#4A5568]/15 blur-[80px] rounded-full group-hover:bg-[#4A5568]/25 transition-all duration-700 pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-[22px] md:text-[24px] font-semibold text-[#E2E8F0] mb-2">
                                            Continue Your Interview Journey
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-1">
                                                <div className="w-8 h-8 rounded-full bg-[#4A5568]/20 flex items-center justify-center border border-[#4A5568]/30">
                                                    <span className="material-symbols-outlined text-[#b8c8e0] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        local_fire_department
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-['JetBrains_Mono'] text-[14px] text-[#b8c8e0] font-medium">
                                                7 Day Streak! Keep it up.
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="btn-primary rounded-lg px-6 py-3.5 font-['JetBrains_Mono'] text-[14px] font-bold whitespace-nowrap shrink-0 shadow-lg hover:scale-105 transition-transform"
                                    >
                                        Start New Interview
                                    </button>
                                </div>

                                {/* Module Progress Bar */}
                                <div className="mt-8 relative z-10">
                                    <div className="flex justify-between font-['JetBrains_Mono'] text-[12px] text-[#c4c6cd] mb-2">
                                        <span>Module 3: Behavioral</span>
                                        <span className="text-[#b8c8e0] font-bold">65%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden border border-[#334155]/40">
                                        <div className="h-full bg-[#4A5568] w-[65%] rounded-full shadow-[0_0_10px_rgba(74,85,104,0.5)] transition-all duration-1000"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section: Performance Overview */}
                            <div
                                className={`glass-panel rounded-xl p-6 lg:p-8 stagger-item ${
                                    animated ? 'fade-up delay-300' : ''
                                } border border-[#334155]`}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-[22px] md:text-[24px] font-semibold text-[#E2E8F0]">
                                            Performance Overview
                                        </h3>
                                        <p className="font-['Inter'] text-[13px] text-[#c4c6cd] mt-0.5">
                                            Score progression across simulated rounds
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="text-[#c4c6cd] hover:text-[#E2E8F0] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>

                                <div className="h-64 w-full relative">
                                    {/* Abstract SVG Line Chart Simulation */}
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                                        {/* Grid Lines */}
                                        <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
                                        <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
                                        <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />

                                        {/* Gradient Definitions */}
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                                <stop offset="0%" stopColor="#4A5568" />
                                                <stop offset="100%" stopColor="#b8c8e0" />
                                            </linearGradient>
                                            <linearGradient id="fillGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                                <stop offset="0%" stopColor="rgba(184, 200, 224, 0.15)" />
                                                <stop offset="100%" stopColor="rgba(184, 200, 224, 0.0)" />
                                            </linearGradient>
                                        </defs>

                                        {/* Fill Area */}
                                        <path
                                            d="M0,180 Q100,160 200,120 T400,90 T600,40 T800,20 L800,200 L0,200 Z"
                                            fill="url(#fillGradient)"
                                            opacity="0.6"
                                        />

                                        {/* Data Line Path */}
                                        <path
                                            className="path-draw"
                                            d="M0,180 Q100,160 200,120 T400,90 T600,40 T800,20"
                                            fill="none"
                                            stroke="url(#chartGradient)"
                                            strokeLinecap="round"
                                            strokeWidth="3.5"
                                        />

                                        {/* Interactive Data Points */}
                                        {dataPoints.map((pt, idx) => (
                                            <g key={idx} className="cursor-pointer" onMouseEnter={() => setActivePoint(pt)} onMouseLeave={() => setActivePoint(null)}>
                                                <circle
                                                    cx={pt.cx}
                                                    cy={pt.cy}
                                                    fill="#1E293B"
                                                    r={activePoint?.label === pt.label ? 7 : 5}
                                                    stroke={idx >= 2 ? '#b8c8e0' : '#4A5568'}
                                                    strokeWidth="2.5"
                                                    className="transition-all duration-200"
                                                />
                                            </g>
                                        ))}
                                    </svg>

                                    {/* Tooltip Hover Overlay */}
                                    {activePoint && (
                                        <div
                                            className="absolute top-2 left-1/2 -translate-x-1/2 glass-panel border border-[#b8c8e0] px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] shadow-xl pointer-events-none"
                                        >
                                            <span className="text-[#c4c6cd]">{activePoint.label}: </span>
                                            <span className="text-[#b8c8e0] font-bold">{activePoint.score} Match</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between mt-4 font-['JetBrains_Mono'] text-[12px] text-[#c4c6cd]">
                                    <span>Week 1 (Baseline)</span>
                                    <span>Week 2 (Practice)</span>
                                    <span>Week 3 (Refinement)</span>
                                    <span>Week 4 (Current)</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Stats & Radar) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Stat 1: Total Interviews */}
                                <div
                                    className={`glass-panel rounded-xl p-4 stagger-item ${
                                        animated ? 'fade-up delay-200' : ''
                                    } metric-glow border border-[#334155]`}
                                >
                                    <div className="flex items-center gap-2 mb-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[12px]">
                                        <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                                        Total Interviews
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-[28px] sm:text-[32px] text-[#E2E8F0] font-bold">
                                        24
                                    </div>
                                </div>

                                {/* Stat 2: Average Score */}
                                <div
                                    className={`glass-panel rounded-xl p-4 stagger-item ${
                                        animated ? 'fade-up delay-200' : ''
                                    } metric-glow border border-[#334155]`}
                                >
                                    <div className="flex items-center gap-2 mb-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[12px]">
                                        <span className="material-symbols-outlined text-[18px]">analytics</span>
                                        Average Score
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-[28px] sm:text-[32px] text-[#b8c8e0] font-bold">
                                        86%
                                    </div>
                                </div>

                                {/* Stat 3: Current Streak */}
                                <div
                                    className={`glass-panel rounded-xl p-4 stagger-item ${
                                        animated ? 'fade-up delay-300' : ''
                                    } metric-glow border border-[#334155]`}
                                >
                                    <div className="flex items-center gap-2 mb-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[12px]">
                                        <span className="material-symbols-outlined text-[18px] text-[#b8c8e0]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            local_fire_department
                                        </span>
                                        Current Streak
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-[28px] sm:text-[32px] text-[#b8c8e0] font-bold">
                                        7 Days
                                    </div>
                                </div>

                                {/* Stat 4: Improvement */}
                                <div
                                    className={`glass-panel ai-feedback-card rounded-xl p-4 stagger-item ${
                                        animated ? 'fade-up delay-300' : ''
                                    } border border-[#334155]`}
                                >
                                    <div className="flex items-center gap-2 mb-2 text-[#c4c6cd] font-['JetBrains_Mono'] text-[12px]">
                                        <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                        Improvement
                                    </div>
                                    <div className="font-['Hanken_Grotesk'] text-[28px] sm:text-[32px] text-[#b8c8e0] font-bold">
                                        +18%
                                    </div>
                                </div>
                            </div>

                            {/* Radar Chart: Skill Breakdown */}
                            <div
                                className={`glass-panel rounded-xl p-6 stagger-item ${
                                    animated ? 'fade-up delay-400' : ''
                                } flex-1 flex flex-col border border-[#334155]`}
                            >
                                <h3 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#E2E8F0] mb-4">
                                    Skill Analysis
                                </h3>
                                <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                                    {/* Abstract SVG Radar Chart */}
                                    <svg className="w-full max-w-[220px] h-auto overflow-visible" viewBox="0 0 100 100">
                                        {/* Background Web Polygons */}
                                        <polygon fill="none" points="50,5 95,50 50,95 5,50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                        <polygon fill="none" points="50,25 75,50 50,75 25,50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                                        {/* Axes */}
                                        <line stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" x1="50" x2="50" y1="5" y2="95" />
                                        <line stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" x1="5" x2="95" y1="50" y2="50" />

                                        {/* Data Polygon (Animated) */}
                                        <polygon
                                            className="path-draw"
                                            fill="rgba(184, 200, 224, 0.2)"
                                            points="50,15 85,50 50,70 20,50"
                                            stroke="#b8c8e0"
                                            strokeWidth="1.8"
                                        >
                                            <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.5;1;0.5" />
                                        </polygon>

                                        {/* Labels */}
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="6.5" textAnchor="middle" x="50" y="0">
                                            Technical
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="6.5" textAnchor="start" x="100" y="52">
                                            Comm
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="6.5" textAnchor="middle" x="50" y="104">
                                            Confidence
                                        </text>
                                        <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="6.5" textAnchor="end" x="0" y="52">
                                            Logic
                                        </text>
                                    </svg>
                                </div>
                            </div>

                            {/* Quick Actions Bento */}
                            <div
                                className={`glass-panel rounded-xl p-6 stagger-item ${
                                    animated ? 'fade-up delay-500' : ''
                                } border border-[#334155]`}
                            >
                                <h3 className="font-['Hanken_Grotesk'] text-[20px] font-semibold text-[#E2E8F0] mb-4">
                                    Quick Actions
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="w-full btn-secondary rounded-lg p-3.5 font-['JetBrains_Mono'] text-[13px] flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 text-[#E2E8F0]">
                                            <span className="material-symbols-outlined text-[#4A5568] group-hover:text-[#b8c8e0] transition-colors">
                                                model_training
                                            </span>
                                            Practice Questions
                                        </div>
                                        <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/interview/setup')}
                                        className="w-full btn-secondary rounded-lg p-3.5 font-['JetBrains_Mono'] text-[13px] flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 text-[#E2E8F0]">
                                            <span className="material-symbols-outlined text-[#4A5568] group-hover:text-[#b8c8e0] transition-colors">
                                                upload_file
                                            </span>
                                            Upload Resume
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
            <nav className="md:hidden fixed bottom-0 w-full bg-[#0F172A]/90 backdrop-blur-xl border-t border-[#334155] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#b8c8e0]">
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
