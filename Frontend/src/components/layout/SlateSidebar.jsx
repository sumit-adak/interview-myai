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
    const isSettings = location.pathname === '/settings' || location.pathname === '/interview/settings'
    const isSupport = location.pathname === '/support' || location.pathname === '/interview/support'

    const navItems = [
        { label: 'Overview', icon: 'dashboard', path: '/dashboard', active: isOverview },
        { label: 'History', icon: 'history', path: '/history', active: isHistory },
        { label: 'Analytics', icon: 'insights', path: '/analytics', active: isAnalytics },
        { label: 'Resume Analyzer', icon: 'description', path: '/resume', active: isResume },
        { label: 'Practice', icon: 'psychology', path: '/practice', active: isPractice },
    ]

    const footerItems = [
        { label: 'Settings', icon: 'settings', path: '/settings', active: isSettings },
        { label: 'Support', icon: 'help', path: '/support', active: isSupport },
    ]

    return (
        <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#0f172a]/95 backdrop-blur-2xl border-r border-[#334155]/80 py-6 z-40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
            {/* Header */}
            <div className="px-6 mb-7 flex items-center gap-3.5">
                <div
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform"
                >
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                    </span>
                </div>
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <h1 className="font-['Hanken_Grotesk'] text-[18px] font-bold text-[#E2E8F0] tracking-tight leading-none flex items-center gap-1.5">
                        Interview AI
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                            PRO
                        </span>
                    </h1>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#94a3b8] mt-1">Smart AI Simulator</p>
                </div>
            </div>

            {/* New Session CTA */}
            <div className="px-5 mb-7">
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="w-full btn-primary rounded-xl py-3 font-['JetBrains_Mono'] text-[13px] font-bold flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                >
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        add_circle
                    </span>
                    New Session
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-1.5 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-['JetBrains_Mono'] text-[13px] flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                            item.active
                                ? 'text-white bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border-l-[3px] border-blue-400 font-semibold shadow-[inset_2px_0_8px_rgba(59,130,246,0.15)]'
                                : 'text-[#94a3b8] hover:text-[#e2e8f0] border-l-[3px] border-transparent hover:bg-slate-800/60'
                        }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] transition-colors ${
                                item.active ? 'text-blue-400' : 'text-[#64748b]'
                            }`}
                            style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Footer Links */}
            <div className="mt-auto px-3 flex flex-col gap-1.5 pt-4 border-t border-[#334155]/60">
                {footerItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-['JetBrains_Mono'] text-[13px] flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                            item.active
                                ? 'text-white bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border-l-[3px] border-blue-400 font-semibold'
                                : 'text-[#94a3b8] hover:text-[#e2e8f0] border-l-[3px] border-transparent hover:bg-slate-800/60'
                        }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] ${
                                item.active ? 'text-blue-400' : 'text-[#64748b]'
                            }`}
                            style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default SlateSidebar

