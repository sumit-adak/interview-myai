import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'

const Home = () => {
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [animated, setAnimated] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] antialiased overflow-x-hidden selection:bg-[#b8c8e0] selection:text-[#223144] flex flex-col justify-between">
            {/* Floating Pill NavBar (Desktop) */}
            <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50 glass-panel rounded-full border border-white/10 shadow-2xl hidden md:flex items-center justify-between px-6 py-2.5">
                <Link to="/" className="font-['Hanken_Grotesk'] text-[20px] font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                    </span>
                    Interview AI
                </Link>

                <div className="flex items-center gap-6 font-['JetBrains_Mono'] text-[13px]">
                    <button
                        onClick={() => navigate('/practice')}
                        className="text-[#94a3b8] hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/5 cursor-pointer"
                    >
                        Practice
                    </button>
                    <button
                        onClick={() => navigate('/resume')}
                        className="text-[#94a3b8] hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/5 cursor-pointer"
                    >
                        Resume Analyzer
                    </button>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="text-[#94a3b8] hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/5 cursor-pointer"
                    >
                        Analytics
                    </button>
                </div>

                <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-[13px]">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-[#dae2fd] hover:text-white transition-colors py-1.5 px-4 rounded-full hover:bg-white/5 cursor-pointer"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/interview/setup')}
                        className="btn-primary font-bold py-2 px-5 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Header */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#334155]/60 flex md:hidden justify-between items-center px-5 py-3.5">
                <Link to="/" className="font-['Hanken_Grotesk'] text-[19px] font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                    </span>
                    Interview AI
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-[#dae2fd] p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
                </button>
            </nav>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed top-14 inset-x-0 bg-[#0b1326]/95 backdrop-blur-2xl border-b border-[#334155] p-6 z-40 flex flex-col gap-3 md:hidden font-['JetBrains_Mono'] text-[14px] shadow-2xl">
                    <button
                        onClick={() => { navigate('/practice'); setMobileOpen(false); }}
                        className="text-left text-[#dae2fd] py-2.5 px-3 hover:bg-white/5 rounded-xl transition-colors"
                    >
                        Practice
                    </button>
                    <button
                        onClick={() => { navigate('/resume'); setMobileOpen(false); }}
                        className="text-left text-[#dae2fd] py-2.5 px-3 hover:bg-white/5 rounded-xl transition-colors"
                    >
                        Resume Analyzer
                    </button>
                    <button
                        onClick={() => { navigate('/analytics'); setMobileOpen(false); }}
                        className="text-left text-[#dae2fd] py-2.5 px-3 hover:bg-white/5 rounded-xl transition-colors"
                    >
                        Analytics
                    </button>
                    <div className="pt-4 border-t border-[#334155] flex flex-col gap-2">
                        <button
                            onClick={() => { navigate('/interview/setup'); setMobileOpen(false); }}
                            className="w-full btn-primary font-bold py-3 rounded-xl text-center"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Main Content */}
            <main className="flex-1 flex flex-col justify-center">
                <section className="relative min-h-[90vh] md:min-h-screen flex flex-col md:flex-row items-center pt-24 md:pt-0 overflow-hidden bg-[#0b1326]">
                    {/* Left Side: Typography & CTA */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:pl-20 md:pr-12 z-20 h-full py-12 md:py-0">
                        <div className="max-w-2xl gsap-reveal-text">
                            <div className="overflow-hidden">
                                <h1
                                    className={`font-['Hanken_Grotesk'] text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold leading-[1.05] text-[#dae2fd] tracking-tight gsap-line ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.1s' }}
                                >
                                    Don't Just Prepare
                                </h1>
                            </div>
                            <div className="overflow-hidden">
                                <h1
                                    className={`font-['Hanken_Grotesk'] text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold leading-[1.05] text-[#dae2fd] tracking-tight gsap-line ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.2s' }}
                                >
                                    for Interviews.
                                </h1>
                            </div>
                            <div className="overflow-hidden mt-2">
                                <h1
                                    className={`font-['Hanken_Grotesk'] text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-200 glow-text tracking-tight gsap-line ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.3s' }}
                                >
                                    Dominate Them.
                                </h1>
                            </div>
                        </div>

                        <p
                            className={`font-['Inter'] text-[16px] md:text-[18px] text-[#94a3b8] max-w-lg mt-6 mb-8 leading-relaxed gsap-line ${
                                animated ? 'active' : ''
                            }`}
                            style={{ transitionDelay: '0.4s' }}
                        >
                            Step into the simulation. Our advanced AI challenges you with role-specific questions, analyzing every response to build your ultimate competitive edge.
                        </p>

                        <div
                            className={`flex flex-col sm:flex-row gap-4 gsap-line ${
                                animated ? 'active' : ''
                            }`}
                            style={{ transitionDelay: '0.5s' }}
                        >
                            <button
                                onClick={() => navigate('/interview/setup')}
                                className="glowing-btn font-['JetBrains_Mono'] text-[14px] font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
                            >
                                Enter Simulation
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Side: AI Simulation Interface */}
                    <div className="w-full md:w-1/2 relative h-[500px] md:h-screen flex items-center justify-center border-t md:border-t-0 md:border-l border-[#334155]">
                        {/* Shaders & Ambient Glow */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b1326]/90 md:to-[#0b1326] z-0"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1326]/50 via-transparent to-[#0b1326]/50 z-0"></div>
                        </div>

                        {/* AI Intelligence Ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full border border-[#334155] rotate-slow z-0 opacity-40 pointer-events-none hidden md:block">
                            <svg className="w-full h-full" viewBox="0 0 200 200">
                                <path d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" fill="transparent" id="curve"></path>
                                <text className="text-[#b8c8e0]" fill="currentColor" fontFamily="Hanken Grotesk" fontSize="8" fontWeight="600" letterSpacing="4">
                                    <textPath href="#curve">ANALYZE • PRACTICE • IMPROVE • REPEAT • ANALYZE • PRACTICE • IMPROVE • REPEAT • </textPath>
                                </text>
                            </svg>
                        </div>

                        {/* Core Interface & Floating Cards */}
                        <div className={`relative z-10 w-full max-w-[620px] px-6 gsap-slide-in ${animated ? 'active' : ''}`}>
                            <div className="glass-panel rounded-2xl p-2 shadow-2xl border border-[#334155] relative">
                                {/* Main Image */}
                                <img
                                    alt="AI Interview Interface"
                                    className="w-full h-auto rounded-xl object-cover mix-blend-lighten float shadow-2xl"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAX6sgpjBpHJltPnFlNL2UGOE0dZS7tljA1Y6RFTUtnRHuoHgVJvoO3BgWf3j5sjho-8nODFOL-vW1lbkvojABgrOwqKLx_4tBu-xNwxYzAhLbUUqp9VyJ2CheQaQUct8eFyzzToG-g5aDurqC3W6HK34_7d7X5SJoaJXCQ6VGRfd6Tf9m8J7sZ57KXGGv8ZxyssGA7tfSkg4ULXYqdzmwFFIVZqreMZJeyBbNEcsbpdRcbfhgYiMbHw"
                                />

                                {/* Floating Card 1: Confidence */}
                                <div
                                    className={`absolute -right-2 md:-right-8 top-8 w-44 md:w-60 glass-panel rounded-xl p-3 md:p-4 border-t border-[#334155] shadow-2xl float-delayed-1 gsap-stagger-card ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.6s' }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-['JetBrains_Mono'] text-[11px] md:text-[12px] text-[#c4c6cd] uppercase tracking-wider">Confidence</span>
                                        <span className="font-['Hanken_Grotesk'] text-[20px] md:text-[24px] font-bold text-[#b8c8e0]">92%</span>
                                    </div>
                                    <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#b8c8e0] w-[92%] h-full rounded-full"></div>
                                    </div>
                                </div>

                                {/* Floating Card 2: AI Analysis */}
                                <div
                                    className={`absolute -left-2 md:-left-10 bottom-1/4 w-52 md:w-68 glass-panel rounded-xl p-3 md:p-4 border-l border-[#334155] shadow-2xl float-delayed-2 gsap-stagger-card ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.7s' }}
                                >
                                    <h3 className="font-['JetBrains_Mono'] text-[13px] text-[#b8c8e0] mb-3 font-semibold">AI Analysis</h3>
                                    <div className="space-y-1.5 font-['JetBrains_Mono'] text-[11px] text-[#dae2fd]">
                                        <div className="flex justify-between items-center">
                                            <span>Communication</span>
                                            <span className="text-[#b8c8e0] font-semibold">91%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Technical</span>
                                            <span className="text-[#b8c8e0] font-semibold">84%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Problem Solving</span>
                                            <span className="text-[#b8c8e0] font-semibold">89%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Card 3: Streak */}
                                <div
                                    className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-60 glass-panel rounded-xl py-2.5 px-4 border-b border-[#334155] shadow-2xl flex items-center justify-center gap-2 float gsap-stagger-card ${
                                        animated ? 'active' : ''
                                    }`}
                                    style={{ transitionDelay: '0.8s' }}
                                >
                                    <span className="material-symbols-outlined text-[#b8c8e0] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        local_fire_department
                                    </span>
                                    <span className="font-['JetBrains_Mono'] text-[13px] font-semibold text-[#dae2fd]">
                                        7-Day Streak Maintained
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Marquee Bottom Ticker */}
                    <div className="absolute bottom-0 w-full border-t border-b border-[#334155] bg-[#0b1326]/60 backdrop-blur-md py-2.5 z-30">
                        <div className="marquee-container font-['JetBrains_Mono'] text-[12px] tracking-[0.2em] text-[#c4c6cd] uppercase">
                            <div className="marquee-content">
                                <span className="mx-6">PRACTICE SMARTER ✦</span>
                                <span className="mx-6">GET REAL FEEDBACK ✦</span>
                                <span className="mx-6">TRACK YOUR GROWTH ✦</span>
                                <span className="mx-6">BUILD CONFIDENCE ✦</span>
                                <span className="mx-6">PRACTICE SMARTER ✦</span>
                                <span className="mx-6">GET REAL FEEDBACK ✦</span>
                                <span className="mx-6">TRACK YOUR GROWTH ✦</span>
                                <span className="mx-6">BUILD CONFIDENCE ✦</span>
                            </div>
                            <div aria-hidden="true" className="marquee-content">
                                <span className="mx-6">PRACTICE SMARTER ✦</span>
                                <span className="mx-6">GET REAL FEEDBACK ✦</span>
                                <span className="mx-6">TRACK YOUR GROWTH ✦</span>
                                <span className="mx-6">BUILD CONFIDENCE ✦</span>
                                <span className="mx-6">PRACTICE SMARTER ✦</span>
                                <span className="mx-6">GET REAL FEEDBACK ✦</span>
                                <span className="mx-6">TRACK YOUR GROWTH ✦</span>
                                <span className="mx-6">BUILD CONFIDENCE ✦</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full relative bg-[#0b1326] border-t border-[#334155] z-40">
                <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                        <div className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#b8c8e0]">Interview AI</div>
                        <p className="font-['Inter'] text-[14px] text-[#c4c6cd]">© 2024 Interview AI. Engineered for Excellence.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 font-['Inter'] text-[14px]">
                        <span className="text-[#c4c6cd] hover:text-[#b8c8e0] transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="text-[#c4c6cd] hover:text-[#b8c8e0] transition-colors cursor-pointer">Terms of Service</span>
                        <span className="text-[#c4c6cd] hover:text-[#b8c8e0] transition-colors cursor-pointer">API Documentation</span>
                        <span className="text-[#c4c6cd] hover:text-[#b8c8e0] transition-colors cursor-pointer">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
