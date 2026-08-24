import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'
import { InterviewContext } from '../interview.context'

const ROLE_SUGGESTIONS = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Java Developer',
    'Python Developer',
    'Data Analyst',
    'DevOps Engineer'
]

const FOCUS_BY_ROLE = {
    'Frontend Developer': ['React & TypeScript', 'State Management', 'Web Performance', 'CSS Architecture'],
    'Backend Developer': ['REST & GraphQL APIs', 'Database Indexing', 'System Design', 'Microservices'],
    'Full Stack Developer': ['End-to-End Architecture', 'React & Node.js', 'API Design', 'Database Scaling'],
    'Software Engineer': ['Algorithms', 'Data Structures', 'Problem Solving', 'System Design'],
    'Java Developer': ['Spring Boot', 'Multithreading', 'JVM Internals', 'Microservices'],
    'Python Developer': ['FastAPI / Django', 'Data Structures', 'Async IO', 'Cloud Deployments'],
    'Data Analyst': ['SQL Optimization', 'Python / Pandas', 'Statistical Modeling', 'BI Dashboards'],
    'DevOps Engineer': ['CI/CD Pipelines', 'Kubernetes / Docker', 'Cloud Architecture', 'Infrastructure as Code']
}

const getDifficultyText = (val) => {
    if (val <= 30) return 'Easy'
    if (val <= 60) return 'Medium'
    if (val <= 85) return 'Advanced'
    return 'Expert'
}

export const InterviewSetup = () => {
    const navigate = useNavigate()
    const { setupConfig, updateSetup } = useContext(InterviewContext)

    const [isStarting, setIsStarting] = useState(false)
    const [readyModalOpen, setReadyModalOpen] = useState(false)
    const [roleInput, setRoleInput] = useState(setupConfig?.role || 'Software Engineer')
    const [showRoleDropdown, setShowRoleDropdown] = useState(false)

    const currentRole = roleInput.trim() || 'Software Engineer'
    const experience = setupConfig?.experience || 'Intermediate'
    const interviewType = setupConfig?.interviewType || 'Technical'
    const difficulty = setupConfig?.difficulty ?? 75
    const duration = setupConfig?.duration || 45

    const focusAreas = FOCUS_BY_ROLE[currentRole] || [
        'Algorithms',
        'Data Structures',
        'Problem Solving',
        'Communication'
    ]

    const handleRoleChange = (val) => {
        setRoleInput(val)
        updateSetup({ role: val })
    }

    const handleStartInterview = () => {
        setIsStarting(true)
        setTimeout(() => {
            setIsStarting(false)
            setReadyModalOpen(true)
        }, 1200)
    }

    const magnetize = (e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) scale(1.02)`
    }

    const resetMagnetize = (e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)'
    }

    return (
        <div className="bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] antialiased overflow-x-hidden flex h-screen selection:bg-[#b8c8e0] selection:text-[#223144]">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#334155] shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#E2E8F0] cursor-pointer">
                    Interview AI
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 text-[#dae2fd] hover:text-[#b8c8e0] transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                </button>
            </nav>

            {/* Desktop Slate Sidebar */}
            <SlateSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 overflow-y-auto w-full relative pt-20 md:pt-10">
                <div className="max-w-[1440px] mx-auto h-full flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Setup Form */}
                    <div className="flex-1 flex flex-col">
                        <header className="mb-6">
                            <h2 className="font-['Hanken_Grotesk'] text-[32px] md:text-[36px] font-bold text-[#dae2fd] tracking-tight">
                                Configure Session
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-1.5">
                                Fine-tune the AI parameters for your upcoming practice interview.
                            </p>
                        </header>

                        <div className="space-y-6 glass-card p-6 md:p-8 rounded-xl flex-1 border border-[#334155] relative overflow-hidden">
                            {/* Subtle Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8c8e0]/5 rounded-full blur-[80px] pointer-events-none"></div>

                            {/* Role Selection */}
                            <div className="relative">
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#dae2fd] mb-2">
                                    Interview Role
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4c6cd] text-[18px]">
                                        search
                                    </span>
                                    <input
                                        value={roleInput}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        onFocus={() => setShowRoleDropdown(true)}
                                        className="w-full bg-[#1E293B] border border-[#334155] rounded-lg py-3 pl-11 pr-4 text-[#dae2fd] font-['Inter'] text-[15px] input-glow placeholder-[#c4c6cd]/50 transition-colors"
                                        placeholder="e.g. Frontend Developer"
                                        type="text"
                                    />
                                </div>

                                {/* Suggested Roles Quick Selector */}
                                <div className="flex flex-wrap gap-2 mt-2.5">
                                    {ROLE_SUGGESTIONS.slice(0, 5).map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => handleRoleChange(r)}
                                            className={`text-[12px] font-['JetBrains_Mono'] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                                currentRole === r
                                                    ? 'border-blue-400 bg-blue-500/20 text-blue-300 font-semibold shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                                                    : 'border-[#334155] bg-[#1E293B]/60 text-[#94a3b8] hover:border-blue-400/50 hover:text-white'
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#dae2fd] mb-2">
                                    Experience Level
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Beginner', 'Intermediate', 'Experienced'].map((lvl) => {
                                        const isActive = experience === lvl
                                        return (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => updateSetup({ experience: lvl })}
                                                className={`py-2.5 rounded-xl font-['JetBrains_Mono'] text-[13px] font-medium transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-blue-500/20 border border-blue-400 text-blue-300 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                                        : 'bg-[#1E293B]/80 border border-[#334155] text-[#94a3b8] hover:text-white hover:border-blue-400/40'
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Interview Type */}
                            <div>
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#dae2fd] mb-2">
                                    Interview Type
                                </label>
                                <select
                                    value={interviewType}
                                    onChange={(e) => updateSetup({ interviewType: e.target.value })}
                                    className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#dae2fd] font-['Inter'] text-[15px] input-glow cursor-pointer transition-colors"
                                >
                                    <option value="Technical">Technical</option>
                                    <option value="Behavioral">Behavioral</option>
                                    <option value="System Design">System Design</option>
                                    <option value="HR Screening">HR Screening</option>
                                    <option value="Mixed">Mixed (Technical + Behavioral)</option>
                                </select>
                            </div>

                            {/* Difficulty Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="font-['JetBrains_Mono'] text-[14px] font-medium text-[#dae2fd]">
                                        Difficulty
                                    </label>
                                    <span className="font-['JetBrains_Mono'] text-[13px] text-blue-400 font-bold">
                                        {getDifficultyText(difficulty)} ({difficulty}%)
                                    </span>
                                </div>
                                <input
                                    value={difficulty}
                                    onChange={(e) => updateSetup({ difficulty: Number(e.target.value) })}
                                    className="w-full accent-blue-500 h-2 bg-[#171f33] rounded-lg appearance-none cursor-pointer"
                                    max="100"
                                    min="1"
                                    type="range"
                                />
                            </div>

                            {/* Duration Chips */}
                            <div>
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#dae2fd] mb-2">
                                    Duration (Mins)
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {[15, 30, 45, 60].map((mins) => {
                                        const isActive = duration === mins
                                        return (
                                            <button
                                                key={mins}
                                                type="button"
                                                onClick={() => updateSetup({ duration: mins })}
                                                className={`px-5 py-2 rounded-full font-['JetBrains_Mono'] text-[13px] font-medium transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'border border-blue-400 bg-blue-500/20 text-blue-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                                                        : 'border border-[#334155] bg-[#1E293B]/80 text-[#94a3b8] hover:border-blue-400/50 hover:text-white'
                                                }`}
                                            >
                                                {mins}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="w-full lg:w-[420px] flex flex-col gap-6">
                        <div className="glass-card rounded-2xl p-6 md:p-8 border border-[#334155] flex-1 flex flex-col relative overflow-hidden shadow-2xl">
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ backgroundImage: "radial-gradient(circle at top right, #3b82f6, transparent 70%)" }}
                            ></div>

                            <h3 className="font-['Hanken_Grotesk'] text-[22px] font-bold text-[#dae2fd] mb-6 z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">analytics</span>
                                Session Preview
                            </h3>

                            <div className="space-y-4 z-10 flex-1">
                                {/* Target Role */}
                                <div className="bg-[#0f172a]/90 p-4 rounded-xl border border-[#334155]/80 border-l-4 border-l-blue-500 transition-all shadow-md">
                                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider">
                                        Target Role
                                    </p>
                                    <p className="font-['Inter'] text-[18px] font-semibold text-[#dae2fd] leading-tight">
                                        {currentRole}
                                    </p>
                                </div>

                                {/* Level & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-[#334155]/80 shadow-sm">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider">
                                            Level
                                        </p>
                                        <p className="font-['Inter'] text-[15px] font-medium text-blue-400">
                                            {experience}
                                        </p>
                                    </div>
                                    <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-[#334155]/80 shadow-sm">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider">
                                            Time
                                        </p>
                                        <p className="font-['Inter'] text-[15px] font-medium text-blue-400">
                                            {duration} Mins
                                        </p>
                                    </div>
                                </div>

                                {/* Difficulty & Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-[#334155]/80 shadow-sm">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider">
                                            Type
                                        </p>
                                        <p className="font-['Inter'] text-[14px] font-medium text-[#dae2fd] truncate">
                                            {interviewType}
                                        </p>
                                    </div>
                                    <div className="bg-[#0f172a]/90 p-3.5 rounded-xl border border-[#334155]/80 shadow-sm">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider">
                                            Difficulty
                                        </p>
                                        <p className="font-['Inter'] text-[14px] font-medium text-blue-400">
                                            {getDifficultyText(difficulty)}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Focus Areas */}
                                <div className="bg-[#0f172a]/90 p-4 rounded-xl border border-[#334155]/80 shadow-sm">
                                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mb-2.5 uppercase tracking-wider">
                                        AI Focus Areas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {focusAreas.map((area, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[12px] font-['JetBrains_Mono'] bg-blue-500/10 px-2.5 py-1 rounded-lg text-blue-300 border border-blue-500/20"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Start AI Interview CTA */}
                            <button
                                onClick={handleStartInterview}
                                disabled={isStarting}
                                onMouseMove={magnetize}
                                onMouseLeave={resetMagnetize}
                                className="w-full mt-6 glowing-btn font-['JetBrains_Mono'] text-[14px] font-bold py-4 rounded-xl flex items-center justify-center gap-2 z-10 magnetic cursor-pointer shadow-xl disabled:opacity-75"
                            >
                                {isStarting ? (
                                    <>
                                        <span className="inline-block h-4 w-4 rounded-full border-2 border-[#020617] border-t-transparent animate-spin"></span>
                                        Preparing Your AI Interview...
                                    </>
                                ) : (
                                    <>
                                        Start AI Interview
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Ready Confirmation Modal */}
            {readyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
                    <div className="glass-modal max-w-lg w-full rounded-2xl p-6 md:p-8 border border-[#334155] shadow-2xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#b8c8e0]/15 flex items-center justify-center border border-[#b8c8e0]/30 text-[#b8c8e0]">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        verified
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-['Hanken_Grotesk'] text-[22px] font-bold text-[#E2E8F0]">
                                        Your Interview Is Ready
                                    </h3>
                                    <p className="font-['Inter'] text-[12px] text-[#c4c6cd]">
                                        Simulation calibrated for your custom profile.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setReadyModalOpen(false)}
                                className="text-[#c4c6cd] hover:text-white p-1 rounded-lg hover:bg-white/10"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-3 my-6 text-[14px]">
                            <div className="flex justify-between py-2 border-b border-[#334155]/60 font-['JetBrains_Mono']">
                                <span className="text-[#c4c6cd]">Role:</span>
                                <span className="text-[#E2E8F0] font-semibold">{currentRole}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#334155]/60 font-['JetBrains_Mono']">
                                <span className="text-[#c4c6cd]">Level:</span>
                                <span className="text-[#b8c8e0] font-semibold">{experience}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#334155]/60 font-['JetBrains_Mono']">
                                <span className="text-[#c4c6cd]">Format:</span>
                                <span className="text-[#E2E8F0]">{interviewType} ({duration} mins)</span>
                            </div>
                            <div className="flex justify-between py-2 font-['JetBrains_Mono']">
                                <span className="text-[#c4c6cd]">Difficulty:</span>
                                <span className="text-[#b8c8e0] font-semibold">{getDifficultyText(difficulty)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setReadyModalOpen(false)}
                                className="flex-1 btn-secondary rounded-lg py-3 font-['JetBrains_Mono'] text-[13px] font-semibold"
                            >
                                Modify Setup
                            </button>
                            <button
                                onClick={() => {
                                    setReadyModalOpen(false)
                                    navigate('/dashboard')
                                }}
                                className="flex-1 btn-primary rounded-lg py-3 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center justify-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                Launch Simulation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterviewSetup
