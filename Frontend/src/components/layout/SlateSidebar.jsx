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
        <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white/95 backdrop-blur-xl border-r border-[#E8E4DC] py-6 z-40 select-none shadow-[1px_0_12px_rgba(0,0,0,0.03)]">
            {/* Header */}
            <div className="px-6 mb-7 flex items-center gap-3.5">
                <div
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:bg-blue-700 hover:scale-105 transition-all"
                >
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                    </span>
                </div>
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <h1 className="font-['Hanken_Grotesk'] text-[18px] font-bold text-[#0F172A] tracking-tight leading-none flex items-center gap-1.5">
                        Interview AI
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            PRO
                        </span>
                    </h1>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#64748B] mt-1">Smart AI Simulator</p>
                </div>
            </div>

            {/* New Session CTA */}
            <div className="px-5 mb-7">
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="w-full btn-primary rounded-xl py-3 font-['JetBrains_Mono'] text-[13px] font-semibold flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
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
                                ? 'text-blue-700 bg-blue-50/90 border-l-[3px] border-blue-600 font-semibold shadow-[inset_2px_0_4px_rgba(37,99,235,0.06)]'
                                : 'text-[#475569] hover:text-[#0F172A] border-l-[3px] border-transparent hover:bg-[#F5F2EB]/70'
                        }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] transition-colors ${
                                item.active ? 'text-blue-600' : 'text-[#94A3B8]'
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
            <div className="mt-auto px-3 flex flex-col gap-1.5 pt-4 border-t border-[#E8E4DC]">
                {footerItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-['JetBrains_Mono'] text-[13px] flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                            item.active
                                ? 'text-blue-700 bg-blue-50/90 border-l-[3px] border-blue-600 font-semibold'
                                : 'text-[#475569] hover:text-[#0F172A] border-l-[3px] border-transparent hover:bg-[#F5F2EB]/70'
                        }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] ${
                                item.active ? 'text-blue-600' : 'text-[#94A3B8]'
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
