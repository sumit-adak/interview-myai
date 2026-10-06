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

    return (
        <div className="bg-[#FAF8F5] text-[#0F172A] font-['Inter',sans-serif] antialiased overflow-x-hidden flex min-h-screen selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E8E4DC] shadow-sm">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#0F172A] cursor-pointer">
                    Interview AI
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 text-[#0F172A] hover:text-blue-600 transition-colors"
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
                            <h2 className="font-['Hanken_Grotesk'] text-[30px] md:text-[34px] font-bold text-[#0F172A] tracking-tight">
                                Configure Session
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#64748B] mt-1">
                                Fine-tune the AI parameters for your upcoming practice interview.
                            </p>
                        </header>

                        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl flex-1 border border-[#E8E4DC] shadow-sm relative overflow-hidden">
                            {/* Role Selection */}
                            <div className="relative">
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#0F172A] mb-2">
                                    Interview Role
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                                        search
                                    </span>
                                    <input
                                        value={roleInput}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        onFocus={() => setShowRoleDropdown(true)}
                                        className="w-full bg-[#FAF8F5] border border-[#D8D2C7] rounded-xl py-3 pl-11 pr-4 text-[#0F172A] font-['Inter'] text-[15px] focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-[#94A3B8] transition-colors"
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
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold'
                                                    : 'border-[#E2DDD5] bg-[#F5F2EB] text-[#475569] hover:border-blue-300 hover:text-[#0F172A]'
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#0F172A] mb-2">
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
                                                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                                        : 'bg-[#F5F2EB] border border-[#E2DDD5] text-[#475569] hover:text-[#0F172A] hover:bg-[#EAE5DC]'
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
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#0F172A] mb-2">
                                    Interview Type
                                </label>
                                <select
                                    value={interviewType}
                                    onChange={(e) => updateSetup({ interviewType: e.target.value })}
                                    className="w-full bg-[#FAF8F5] border border-[#D8D2C7] rounded-xl py-3 px-4 text-[#0F172A] font-['Inter'] text-[15px] focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer transition-colors"
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
                                    <label className="font-['JetBrains_Mono'] text-[14px] font-medium text-[#0F172A]">
                                        Difficulty
                                    </label>
                                    <span className="font-['JetBrains_Mono'] text-[13px] text-blue-600 font-bold">
                                        {getDifficultyText(difficulty)} ({difficulty}%)
                                    </span>
                                </div>
                                <input
                                    value={difficulty}
                                    onChange={(e) => updateSetup({ difficulty: Number(e.target.value) })}
                                    className="w-full accent-blue-600 h-2 bg-[#EAE5DC] rounded-lg appearance-none cursor-pointer"
                                    max="100"
                                    min="1"
                                    type="range"
                                />
                            </div>

                            {/* Duration Chips */}
                            <div>
                                <label className="block font-['JetBrains_Mono'] text-[14px] font-medium text-[#0F172A] mb-2">
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
                                                className={`px-5 py-2 rounded-xl font-['JetBrains_Mono'] text-[13px] font-medium transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                                                        : 'border border-[#E2DDD5] bg-[#F5F2EB] text-[#475569] hover:bg-[#EAE5DC] hover:text-[#0F172A]'
                                                }`}
                                            >
                                                {mins} Mins
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="w-full lg:w-[420px] flex flex-col gap-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E4DC] flex-1 flex flex-col relative overflow-hidden shadow-sm">
                            <h3 className="font-['Hanken_Grotesk'] text-[22px] font-bold text-[#0F172A] mb-6 z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">analytics</span>
                                Session Preview
                            </h3>

                            <div className="space-y-4 z-10 flex-1">
                                {/* Target Role */}
                                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E4DC] border-l-4 border-l-blue-600 transition-all">
                                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-1 uppercase tracking-wider font-semibold">
                                        Target Role
                                    </p>
                                    <p className="font-['Inter'] text-[18px] font-bold text-[#0F172A] leading-tight">
                                        {currentRole}
                                    </p>
                                </div>

                                {/* Level & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-1 uppercase tracking-wider">
                                            Level
                                        </p>
                                        <p className="font-['Inter'] text-[15px] font-semibold text-blue-600">
                                            {experience}
                                        </p>
                                    </div>
                                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-1 uppercase tracking-wider">
                                            Time
                                        </p>
                                        <p className="font-['Inter'] text-[15px] font-semibold text-blue-600">
                                            {duration} Mins
                                        </p>
                                    </div>
                                </div>

                                {/* Difficulty & Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-1 uppercase tracking-wider">
                                            Type
                                        </p>
                                        <p className="font-['Inter'] text-[14px] font-semibold text-[#0F172A] truncate">
                                            {interviewType}
                                        </p>
                                    </div>
                                    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                                        <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-1 uppercase tracking-wider">
                                            Difficulty
                                        </p>
                                        <p className="font-['Inter'] text-[14px] font-semibold text-blue-600">
                                            {getDifficultyText(difficulty)}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Focus Areas */}
                                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E4DC]">
                                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mb-2.5 uppercase tracking-wider font-semibold">
                                        AI Focus Areas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {focusAreas.map((area, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[12px] font-['JetBrains_Mono'] bg-blue-50 px-2.5 py-1 rounded-lg text-blue-700 border border-blue-200 font-medium"
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
                                className="w-full mt-6 btn-primary font-['JetBrains_Mono'] text-[14px] font-semibold py-4 rounded-xl flex items-center justify-center gap-2 z-10 cursor-pointer shadow-sm hover:bg-blue-700 disabled:opacity-75"
                            >
                                {isStarting ? (
                                    <>
                                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 md:p-8 border border-[#E8E4DC] shadow-xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 text-blue-600">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        verified
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-['Hanken_Grotesk'] text-[22px] font-bold text-[#0F172A]">
                                        Your Interview Is Ready
                                    </h3>
                                    <p className="font-['Inter'] text-[13px] text-[#64748B]">
                                        Simulation calibrated for your custom profile.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setReadyModalOpen(false)}
                                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F5F2EB]"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-3 my-6 text-[14px]">
                            <div className="flex justify-between py-2 border-b border-[#E8E4DC] font-['JetBrains_Mono']">
                                <span className="text-[#64748B]">Role:</span>
                                <span className="text-[#0F172A] font-semibold">{currentRole}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#E8E4DC] font-['JetBrains_Mono']">
                                <span className="text-[#64748B]">Level:</span>
                                <span className="text-blue-600 font-semibold">{experience}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#E8E4DC] font-['JetBrains_Mono']">
                                <span className="text-[#64748B]">Format:</span>
                                <span className="text-[#0F172A]">{interviewType} ({duration} mins)</span>
                            </div>
                            <div className="flex justify-between py-2 font-['JetBrains_Mono']">
                                <span className="text-[#64748B]">Difficulty:</span>
                                <span className="text-blue-600 font-semibold">{getDifficultyText(difficulty)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setReadyModalOpen(false)}
                                className="flex-1 btn-secondary rounded-xl py-3 font-['JetBrains_Mono'] text-[13px] font-semibold"
                            >
                                Modify Setup
                            </button>
                            <button
                                onClick={() => {
                                    setReadyModalOpen(false)
                                    navigate('/dashboard')
                                }}
                                className="flex-1 btn-primary rounded-xl py-3 font-['JetBrains_Mono'] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
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
