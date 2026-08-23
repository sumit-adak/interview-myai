import React from 'react'
import { useNavigate, useLocation } from 'react-router'

export const SlateSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const isOverview = location.pathname === '/dashboard'
    const isHistory = location.pathname === '/history' || location.pathname === '/interview/history'
    const isAnalytics = location.pathname === '/analytics' || location.pathname === '/interview/analytics'
    const isResume = location.pathname === '/resume' || location.pathname === '/interview/resume'
    const isPractice = location.pathname === '/practice' || location.pathname === '/interview/practice' || location.pathname === '/interview/setup'

    return (
        <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#1E293B]/90 backdrop-blur-xl border-r border-[#334155] py-6 z-40 select-none">
            {/* Header */}
            <div className="px-6 mb-8 flex items-center gap-3">
                <div
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden border border-[#334155] cursor-pointer hover:border-[#b8c8e0] transition-colors"
                >
                    <img
                        alt="User Profile"
                        className="object-cover w-full h-full"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuALXt8886n6wUINwTp0DppOp5tlVIcXiJyt8wIQiMor8fGhmn8oTKbeumnohXqpd2JHtGH4EzwuAOmeXFstSO6cH40pWCGL9oRE4W-uBqZt9h-qREsnAru8SUs0oA-I3iD27AixEEJzyWia8fxtLZ_EJkkC_4xMvKq9zfXA3v3DnsPzdgTrJ_JU8vjbcmUIgd31L_RReH0-UlHZLuiDSxdndl1yJC8VCFJfqJ3HILdTg0qkeRc-3_mj3A"
                    />
                </div>
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <h1 className="font-['Hanken_Grotesk'] text-[18px] font-bold text-[#E2E8F0] tracking-tight">Interview AI</h1>
                    <p className="font-['JetBrains_Mono'] text-[12px] text-[#c3c7cd] opacity-70">Pro Account</p>
                </div>
            </div>

            {/* New Session CTA */}
            <div className="px-6 mb-8">
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="w-full btn-primary rounded-lg py-3 font-['JetBrains_Mono'] text-[14px] font-bold flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                    <span className="material-symbols-outlined text-[#E2E8F0] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        add
                    </span>
                    New Session
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-1 px-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`w-full text-left px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 transition-all duration-200 ${
                        isOverview
                            ? 'text-[#E2E8F0] bg-[#4A5568]/20 border-l-2 border-[#4A5568]'
                            : 'text-[#c4c6cd] hover:text-[#E2E8F0] border-l-2 border-transparent hover:bg-[#4A5568]/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isOverview ? "'FILL' 1" : "'FILL' 0" }}>
                        dashboard
                    </span>
                    Overview
                </button>

                <button
                    onClick={() => navigate('/history')}
                    className={`w-full text-left px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 transition-all duration-200 ${
                        isHistory
                            ? 'text-[#E2E8F0] bg-[#4A5568]/20 border-l-2 border-[#4A5568]'
                            : 'text-[#c4c6cd] hover:text-[#E2E8F0] border-l-2 border-transparent hover:bg-[#4A5568]/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isHistory ? "'FILL' 1" : "'FILL' 0" }}>
                        history
                    </span>
                    History
                </button>

                <button
                    onClick={() => navigate('/analytics')}
                    className={`w-full text-left px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 transition-all duration-200 ${
                        isAnalytics
                            ? 'text-[#E2E8F0] bg-[#4A5568]/20 border-l-2 border-[#4A5568]'
                            : 'text-[#c4c6cd] hover:text-[#E2E8F0] border-l-2 border-transparent hover:bg-[#4A5568]/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isAnalytics ? "'FILL' 1" : "'FILL' 0" }}>
                        insights
                    </span>
                    Analytics
                </button>

                <button
                    onClick={() => navigate('/resume')}
                    className={`w-full text-left px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 transition-all duration-200 ${
                        isResume
                            ? 'text-[#E2E8F0] bg-[#4A5568]/20 border-l-2 border-[#4A5568]'
                            : 'text-[#c4c6cd] hover:text-[#E2E8F0] border-l-2 border-transparent hover:bg-[#4A5568]/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isResume ? "'FILL' 1" : "'FILL' 0" }}>
                        description
                    </span>
                    Resume Analyzer
                </button>

                <button
                    onClick={() => navigate('/practice')}
                    className={`w-full text-left px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 transition-all duration-200 ${
                        isPractice
                            ? 'text-[#E2E8F0] bg-[#4A5568]/20 border-l-2 border-[#4A5568]'
                            : 'text-[#c4c6cd] hover:text-[#E2E8F0] border-l-2 border-transparent hover:bg-[#4A5568]/10'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isPractice ? "'FILL' 1" : "'FILL' 0" }}>
                        psychology
                    </span>
                    Practice
                </button>
            </nav>

            {/* Footer Links */}
            <div className="mt-auto px-2 flex flex-col gap-1 pb-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-left text-[#c4c6cd] hover:text-[#E2E8F0] px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 hover:bg-[#4A5568]/10 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Settings
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-full text-left text-[#c4c6cd] hover:text-[#E2E8F0] px-4 py-3 rounded-r-lg font-['JetBrains_Mono'] text-[14px] flex items-center gap-3 hover:bg-[#4A5568]/10 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    Support
                </button>
            </div>
        </aside>
    )
}

export default SlateSidebar
