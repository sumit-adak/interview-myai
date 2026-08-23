import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

const FAQ_DATA = [
    {
        category: 'Getting Started',
        icon: 'rocket_launch',
        questions: [
            {
                q: 'How does Interview AI simulate real technical rounds?',
                a: 'Our AI engine uses advanced large language models fine-tuned on thousands of verified L5/L6 senior engineering rubrics. It assesses technical precision, architecture trade-offs, speaking pace, and acoustic clarity in real time.'
            },
            {
                q: 'What equipment do I need for mock interview simulations?',
                a: 'Any modern browser with standard microphone and camera permissions enabled is sufficient. For optimal acoustic scoring, we recommend using a headset or dedicated condenser microphone.'
            }
        ]
    },
    {
        category: 'AI Interviews',
        icon: 'psychology',
        questions: [
            {
                q: 'How are filler words and cadence measured?',
                a: 'Our speech recognition engine performs acoustic tokenization on your audio stream, isolating verbal tics (such as "um", "like", "you know") and calculating WPM conversational velocity against industry sweet spots (130–150 WPM).'
            },
            {
                q: 'Can I practice specific interview domains like System Design?',
                a: 'Yes! You can choose specific domains in the Practice Gym or configure a targeted mock session in Interview Setup covering Concurrency, Distributed Caching, Database Indexing, and STAR Leadership.'
            }
        ]
    },
    {
        category: 'Resume Analysis',
        icon: 'document_scanner',
        questions: [
            {
                q: 'How does the ATS Compatibility scoring work?',
                a: 'The ATS engine parses your uploaded resume against industry standard Applicant Tracking System (ATS) AST parsers, auditing formatting, keyword density, section hierarchy, readability, and cosine semantic job alignment.'
            },
            {
                q: 'What file formats are supported for resume parsing?',
                a: 'We currently support clean single-column and standard multi-section PDF and DOCX files up to 10MB.'
            }
        ]
    },
    {
        category: 'Billing & Pro Plans',
        icon: 'credit_card',
        questions: [
            {
                q: 'What is included in the Interview AI Pro Plan?',
                a: 'Pro tier includes unlimited AI interview simulations, full speech transcriptions, custom ATS job descriptions, PDF report exports, and mentor link sharing.'
            },
            {
                q: 'Can I cancel or switch plans at any time?',
                a: 'Yes, subscriptions can be cancelled or modified at any time with zero cancellation fees through your Account Management panel.'
            }
        ]
    },
    {
        category: 'Technical Issues',
        icon: 'build',
        questions: [
            {
                q: 'What should I do if microphone permissions are blocked?',
                a: 'Click the padlock icon in your browser URL bar, ensure microphone and camera permissions are set to "Allow", and refresh the session.'
            },
            {
                q: 'Is my audio and video data stored securely?',
                a: 'All audio and video streams are processed with end-to-end TLS 1.3 encryption and are never sold or shared with third-party advertisers.'
            }
        ]
    }
]

export const Settings = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // Top View Tab: 'settings' | 'support' | 'status'
    const [activeTab, setActiveTab] = useState(location.pathname.includes('/support') ? 'support' : 'settings')

    // AI Voice & Accent Settings
    const [voiceGender, setVoiceGender] = useState('Neutral') // 'Male' | 'Female' | 'Neutral'
    const [voiceAccent, setVoiceAccent] = useState('American English') // 'Indian English' | 'American English' | 'British English'
    const [isPlayingPreview, setIsPlayingPreview] = useState(false)

    // Interviewer Strictness
    const [strictness, setStrictness] = useState('Neutral') // 'Supportive' | 'Neutral' | 'Stress Test'

    // API Integration Keys
    const [openAiKey, setOpenAiKey] = useState('sk-proj-••••••••••••••••••••••••••••••••')
    const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••••••••••')
    const [showOpenAiKey, setShowOpenAiKey] = useState(false)
    const [showAnthropicKey, setShowAnthropicKey] = useState(false)
    const [openAiStatus, setOpenAiStatus] = useState('Connected')
    const [anthropicStatus, setAnthropicStatus] = useState('Connected')
    const [isTestingOpenAi, setIsTestingOpenAi] = useState(false)
    const [isTestingAnthropic, setIsTestingAnthropic] = useState(false)

    // Account Management
    const [profileName, setProfileName] = useState('Sumit Adak')
    const [profileEmail, setProfileEmail] = useState('sumit.adak@gmail.com')
    const [profileRole, setProfileRole] = useState('Senior Full Stack Engineer')
    const [isSaveSuccess, setIsSaveSuccess] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // FAQ Accordion State
    const [openFaqIndex, setOpenFaqIndex] = useState('Getting Started-0')

    // Bug Report Modal State
    const [showBugModal, setShowBugModal] = useState(false)
    const [bugTitle, setBugTitle] = useState('')
    const [bugCategory, setBugCategory] = useState('Speech Recognition')
    const [bugDescription, setBugDescription] = useState('')
    const [bugSubmitted, setBugSubmitted] = useState(false)

    // System Status State
    const [statusRefreshing, setStatusRefreshing] = useState(false)
    const [lastCheckedSeconds, setLastCheckedSeconds] = useState(12)

    useEffect(() => {
        const interval = setInterval(() => {
            setLastCheckedSeconds((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const handlePlayVoicePreview = (voice, accent) => {
        setIsPlayingPreview(true)
        setTimeout(() => setIsPlayingPreview(false), 1600)
    }

    const handleTestOpenAi = () => {
        setIsTestingOpenAi(true)
        setTimeout(() => {
            setIsTestingOpenAi(false)
            setOpenAiStatus('Verified (42ms)')
        }, 1200)
    }

    const handleTestAnthropic = () => {
        setIsTestingAnthropic(true)
        setTimeout(() => {
            setIsTestingAnthropic(false)
            setAnthropicStatus('Verified (58ms)')
        }, 1200)
    }

    const handleSaveProfile = (e) => {
        e.preventDefault()
        setIsSaveSuccess(true)
        setTimeout(() => setIsSaveSuccess(false), 2500)
    }

    const handleRefreshStatus = () => {
        setStatusRefreshing(true)
        setTimeout(() => {
            setStatusRefreshing(false)
            setLastCheckedSeconds(1)
        }, 800)
    }

    const handleSubmitBugReport = (e) => {
        e.preventDefault()
        setBugSubmitted(true)
        setTimeout(() => {
            setBugSubmitted(false)
            setShowBugModal(false)
            setBugTitle('')
            setBugDescription('')
        }, 1800)
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
                            Settings, Preferences & Support Hub
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            All Systems Operational
                        </span>
                    </div>

                    <button
                        onClick={() => setShowBugModal(true)}
                        className="btn-secondary rounded-lg px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px] text-amber-400">bug_report</span>
                        Report a Problem
                    </button>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#818cf8] text-[18px]">tune</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                    Platform Configuration & Diagnostics
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Settings & Support
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-0.5">
                                Configure your AI interviewer persona, strictness thresholds, API connections, account security, and diagnostic support.
                            </p>
                        </div>

                        {/* Mode Switcher Tabs */}
                        <div className="flex items-center bg-[#0F172A] p-1.5 rounded-2xl border border-[#334155] shadow-lg self-start md:self-auto">
                            {[
                                { id: 'settings', label: 'Settings', icon: 'settings' },
                                { id: 'support', label: 'Support & FAQs', icon: 'help' },
                                { id: 'status', label: 'System Health', icon: 'monitor_heart' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                                            : 'text-[#c4c6cd] hover:text-white'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* =========================================================
                        TAB 1: SETTINGS & PREFERENCES
                    ========================================================= */}
                    {activeTab === 'settings' && (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-200">
                            
                            {/* SECTION A: AI VOICE & ACCENT SETTINGS */}
                            <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#334155]">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[20px]">record_voice_over</span>
                                            <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                                AI Interviewer Voice & Persona
                                            </h3>
                                        </div>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                            Choose the synthesized neural voice gender and regional acoustic accent for mock sessions.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handlePlayVoicePreview(voiceGender, voiceAccent)}
                                        className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                                    >
                                        <span className={`material-symbols-outlined text-[16px] ${isPlayingPreview ? 'text-[#818cf8] animate-spin' : ''}`}>
                                            volume_up
                                        </span>
                                        <span>{isPlayingPreview ? 'Playing Sample...' : 'Play Voice Preview'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Voice Gender Cards */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] font-semibold">
                                            Synthesizer Gender:
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Neutral', 'Female', 'Male'].map((gender) => (
                                                <button
                                                    key={gender}
                                                    onClick={() => setVoiceGender(gender)}
                                                    className={`p-3.5 rounded-xl border text-center font-['JetBrains_Mono'] text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                                        voiceGender === gender
                                                            ? 'bg-gradient-to-tr from-indigo-950/80 to-purple-950/80 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                                            : 'bg-[#0F172A] border-[#334155] text-[#c4c6cd] hover:text-white hover:border-[#818cf8]/40'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[22px] text-[#818cf8]">
                                                        {gender === 'Male' ? 'face_6' : gender === 'Female' ? 'face_3' : 'robot_2'}
                                                    </span>
                                                    <span>{gender}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accent Selection */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] font-semibold">
                                            Regional English Accent:
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: 'Indian English', flag: '🇮🇳' },
                                                { label: 'American English', flag: '🇺🇸' },
                                                { label: 'British English', flag: '🇬🇧' }
                                            ].map((item) => (
                                                <button
                                                    key={item.label}
                                                    onClick={() => setVoiceAccent(item.label)}
                                                    className={`p-3.5 rounded-xl border text-center font-['JetBrains_Mono'] text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                                        voiceAccent === item.label
                                                            ? 'bg-gradient-to-tr from-indigo-950/80 to-purple-950/80 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                                            : 'bg-[#0F172A] border-[#334155] text-[#c4c6cd] hover:text-white hover:border-[#818cf8]/40'
                                                    }`}
                                                >
                                                    <span className="text-lg">{item.flag}</span>
                                                    <span className="text-[11px] leading-tight">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SECTION B: INTERVIEWER STRICTNESS MODES */}
                            <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                                <div className="pb-4 border-b border-[#334155]">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#818cf8] text-[20px]">psychology_alt</span>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            Interviewer Evaluation Strictness
                                        </h3>
                                    </div>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                        Adjust how aggressively the AI probes for trade-offs, edge cases, and interruption triggers.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            id: 'Supportive',
                                            icon: 'favorite',
                                            badge: 'Encouraging & Helpful',
                                            badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                                            desc: 'Provides hints when hesitation is detected, uses friendly conversational cadence, and forgives minor syntax errors.',
                                            borderColor: 'border-emerald-500'
                                        },
                                        {
                                            id: 'Neutral',
                                            icon: 'balance',
                                            badge: 'Standard L5 Rubric',
                                            badgeColor: 'text-[#818cf8] bg-indigo-500/10 border-indigo-500/20',
                                            desc: 'Standard balanced tech evaluation with calibrated follow-ups and realistic rubric scoring without artificial hints.',
                                            borderColor: 'border-indigo-500'
                                        },
                                        {
                                            id: 'Stress Test',
                                            icon: 'warning',
                                            badge: 'High Pressure & Rigorous',
                                            badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                                            desc: 'Challenging follow-ups, strict timer pressure, unexpected boundary constraint shifts, and rigorous edge testing.',
                                            borderColor: 'border-amber-500'
                                        }
                                    ].map((mode) => {
                                        const isSelected = strictness === mode.id
                                        return (
                                            <div
                                                key={mode.id}
                                                onClick={() => setStrictness(mode.id)}
                                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                                                    isSelected
                                                        ? `bg-[#0F172A] ${mode.borderColor} shadow-lg shadow-indigo-500/15`
                                                        : 'bg-[#0F172A]/50 border-[#334155] hover:border-[#818cf8]/40 hover:bg-[#0F172A]'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="material-symbols-outlined text-[24px] text-[#818cf8]">{mode.icon}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold border ${mode.badgeColor}`}>
                                                            {mode.badge}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0]">
                                                        {mode.id} Mode
                                                    </h4>
                                                    <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-1.5 leading-relaxed">
                                                        {mode.desc}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2 border-t border-[#334155]/60 text-xs font-['JetBrains_Mono']">
                                                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                                                        isSelected ? 'bg-indigo-600 border-indigo-400' : 'border-[#334155]'
                                                    }`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                                    </span>
                                                    <span className={isSelected ? 'text-[#E2E8F0] font-bold' : 'text-[#c4c6cd]'}>
                                                        {isSelected ? 'Active Mode Selected' : 'Click to Select'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* SECTION C: API INTEGRATION (OPTIONAL PRO PROVIDERS) */}
                            <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                                <div className="pb-4 border-b border-[#334155]">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#818cf8] text-[20px]">key</span>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            API Key Integrations & Custom Models (BYOK)
                                        </h3>
                                    </div>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                        Optionally connect your personal OpenAI GPT-4o or Anthropic Claude 3.5 Sonnet keys for zero-latency direct inference.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* OpenAI Key Field */}
                                    <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col gap-3.5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">OpenAI API Key</span>
                                                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    {openAiStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type={showOpenAiKey ? 'text' : 'password'}
                                                value={openAiKey}
                                                onChange={(e) => setOpenAiKey(e.target.value)}
                                                className="w-full bg-[#020617] border border-[#334155] rounded-xl px-3.5 py-2.5 font-['JetBrains_Mono'] text-xs text-[#dae2fd] focus:outline-none focus:border-indigo-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c6cd] hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showOpenAiKey ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleTestOpenAi}
                                            disabled={isTestingOpenAi}
                                            className="btn-secondary py-2 rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${isTestingOpenAi ? 'animate-spin' : ''}`}>
                                                {isTestingOpenAi ? 'sync' : 'network_check'}
                                            </span>
                                            <span>{isTestingOpenAi ? 'Testing Latency...' : 'Test Connection'}</span>
                                        </button>
                                    </div>

                                    {/* Anthropic Key Field */}
                                    <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col gap-3.5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">Anthropic API Key</span>
                                                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    {anthropicStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type={showAnthropicKey ? 'text' : 'password'}
                                                value={anthropicKey}
                                                onChange={(e) => setAnthropicKey(e.target.value)}
                                                className="w-full bg-[#020617] border border-[#334155] rounded-xl px-3.5 py-2.5 font-['JetBrains_Mono'] text-xs text-[#dae2fd] focus:outline-none focus:border-indigo-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c6cd] hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showAnthropicKey ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleTestAnthropic}
                                            disabled={isTestingAnthropic}
                                            className="btn-secondary py-2 rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${isTestingAnthropic ? 'animate-spin' : ''}`}>
                                                {isTestingAnthropic ? 'sync' : 'network_check'}
                                            </span>
                                            <span>{isTestingAnthropic ? 'Testing Latency...' : 'Test Connection'}</span>
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* SECTION D: ACCOUNT MANAGEMENT & SECURITY */}
                            <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                                <div className="pb-4 border-b border-[#334155]">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#818cf8] text-[20px]">manage_accounts</span>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            Account Profile & Security
                                        </h3>
                                    </div>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                        Update candidate profile information, credentials, and connected OAuth accounts.
                                    </p>
                                </div>

                                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2 text-xs font-['Inter'] text-[#dae2fd] focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileEmail}
                                            onChange={(e) => setProfileEmail(e.target.value)}
                                            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2 text-xs font-['Inter'] text-[#dae2fd] focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Target Engineering Role</label>
                                        <input
                                            type="text"
                                            value={profileRole}
                                            onChange={(e) => setProfileRole(e.target.value)}
                                            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2 text-xs font-['Inter'] text-[#dae2fd] focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="md:col-span-3 flex justify-between items-center pt-2">
                                        {isSaveSuccess ? (
                                            <span className="text-xs font-['JetBrains_Mono'] text-emerald-400 font-bold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                Profile changes saved successfully!
                                            </span>
                                        ) : <span></span>}

                                        <button
                                            type="submit"
                                            className="btn-primary px-5 py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold"
                                        >
                                            Save Account Changes
                                        </button>
                                    </div>
                                </form>

                                {/* Danger Zone */}
                                <div className="p-5 rounded-xl border border-red-500/30 bg-red-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                    <div>
                                        <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-red-400">
                                            Delete Account & Purge Interview History
                                        </h4>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                            Permanently delete your profile, audio recordings, rubrics, and diagnostic logs.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-['JetBrains_Mono'] font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0"
                                    >
                                        Delete Account
                                    </button>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        TAB 2: SUPPORT & FAQ ACCORDION
                    ========================================================= */}
                    {activeTab === 'support' && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                            
                            {/* Top Support Banner */}
                            <div className="glass-modal rounded-2xl p-6 border border-indigo-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[#818cf8] shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">support_agent</span>
                                    </div>
                                    <div>
                                        <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                            Need Help with Your Interview AI Session?
                                        </h3>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                            Search frequently asked questions below or submit a direct ticket with our engineering team.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowBugModal(true)}
                                    className="btn-primary rounded-xl px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">bug_report</span>
                                    <span>Report a Problem</span>
                                </button>
                            </div>

                            {/* FAQ Accordion List */}
                            <div className="flex flex-col gap-5">
                                {FAQ_DATA.map((cat) => (
                                    <div key={cat.category} className="glass-panel rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col gap-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-[#334155]">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[20px]">{cat.icon}</span>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0]">
                                                {cat.category}
                                            </h4>
                                        </div>

                                        <div className="flex flex-col gap-2.5">
                                            {cat.questions.map((item, qIdx) => {
                                                const key = `${cat.category}-${qIdx}`
                                                const isOpen = openFaqIndex === key
                                                return (
                                                    <div
                                                        key={qIdx}
                                                        className="rounded-xl border border-[#334155] bg-[#0F172A] overflow-hidden transition-all"
                                                    >
                                                        <button
                                                            onClick={() => setOpenFaqIndex(isOpen ? null : key)}
                                                            className="w-full p-4 text-left flex justify-between items-center gap-3 cursor-pointer hover:bg-white/5"
                                                        >
                                                            <span className="font-['Hanken_Grotesk'] text-xs md:text-sm font-bold text-[#E2E8F0]">
                                                                {item.q}
                                                            </span>
                                                            <span className={`material-symbols-outlined text-[18px] text-[#818cf8] transition-transform ${
                                                                isOpen ? 'rotate-180' : ''
                                                            }`}>
                                                                expand_more
                                                            </span>
                                                        </button>

                                                        {isOpen && (
                                                            <div className="p-4 pt-0 text-xs font-['Inter'] text-[#c4c6cd] leading-relaxed border-t border-[#334155]/60 bg-[#020617]/50">
                                                                {item.a}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* =========================================================
                        TAB 3: SYSTEM CONNECTIVITY & HEALTH
                    ========================================================= */}
                    {activeTab === 'status' && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                            
                            <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-[#334155] shadow-lg flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#334155]">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-400 text-[20px]">cloud_done</span>
                                            <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                                AI System & Microservice Telemetry
                                            </h3>
                                        </div>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-0.5">
                                            Real-time health status of inference nodes, speech pipelines, and rubric evaluators.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                            Checked {lastCheckedSeconds}s ago
                                        </span>
                                        <button
                                            onClick={handleRefreshStatus}
                                            disabled={statusRefreshing}
                                            className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${statusRefreshing ? 'animate-spin' : ''}`}>
                                                refresh
                                            </span>
                                            <span>Refresh</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { name: 'AI LLM Evaluation Engine', status: 'Operational', latency: '120ms', uptime: '99.98%', icon: 'neurology' },
                                        { name: 'Whisper STT Speech Engine', status: 'Operational', latency: '85ms', uptime: '99.95%', icon: 'graphic_eq' },
                                        { name: 'Neural TTS Voice Synthesizer', status: 'Operational', latency: '140ms', uptime: '99.99%', icon: 'record_voice_over' },
                                        { name: 'ATS Semantic Parsing Engine', status: 'Operational', latency: '45ms', uptime: '100.0%', icon: 'document_scanner' }
                                    ].map((service, i) => (
                                        <div key={i} className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                                                    <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                                                </div>
                                                <span className="flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                    {service.status}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                    {service.name}
                                                </h4>
                                                <div className="flex justify-between text-xs font-['JetBrains_Mono'] text-[#c4c6cd] mt-2 pt-2 border-t border-[#334155]/60">
                                                    <span>Latency: <strong className="text-[#818cf8]">{service.latency}</strong></span>
                                                    <span>Uptime: <strong className="text-emerald-400">{service.uptime}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </main>

            {/* =========================================================
                BUG REPORT MODAL ("REPORT A PROBLEM")
            ========================================================= */}
            {showBugModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-modal max-w-lg w-full rounded-2xl p-6 md:p-7 border border-[#334155] shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <span className="material-symbols-outlined text-[22px]">bug_report</span>
                                </div>
                                <div>
                                    <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0]">
                                        Report a Problem / Submit Ticket
                                    </h4>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd]">
                                        Our engineering team responds within 24 hours
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBugModal(false)}
                                className="text-[#c4c6cd] hover:text-white p-1"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {bugSubmitted ? (
                            <div className="p-6 text-center flex flex-col items-center gap-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                                <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
                                <h5 className="font-['Hanken_Grotesk'] text-base font-bold text-emerald-300">Ticket Submitted Successfully</h5>
                                <p className="text-xs font-['Inter'] text-[#c4c6cd]">Reference ID: #TICK-8492. Closing dialog...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitBugReport} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Problem Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={bugTitle}
                                        onChange={(e) => setBugTitle(e.target.value)}
                                        placeholder="e.g. Microphone audio drops out after 3 minutes"
                                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2 text-xs font-['Inter'] text-[#dae2fd] focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Category</label>
                                    <select
                                        value={bugCategory}
                                        onChange={(e) => setBugCategory(e.target.value)}
                                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2 text-xs font-['JetBrains_Mono'] text-[#dae2fd] focus:outline-none"
                                    >
                                        <option>Speech Recognition / Audio</option>
                                        <option>Camera & Video Feed</option>
                                        <option>ATS Score & Resume Parsing</option>
                                        <option>Practice Mode Code Sandbox</option>
                                        <option>Billing & Subscription</option>
                                        <option>Other Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Detailed Description</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={bugDescription}
                                        onChange={(e) => setBugDescription(e.target.value)}
                                        placeholder="Please provide steps to reproduce the issue..."
                                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs font-['Inter'] text-[#dae2fd] focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Screen Capture Attachment Placeholder */}
                                <div>
                                    <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] block mb-1">Screen Capture Attachment</label>
                                    <div className="p-4 rounded-xl border border-dashed border-[#334155] hover:border-indigo-500/50 transition-colors text-center cursor-pointer bg-[#0F172A]/50">
                                        <span className="material-symbols-outlined text-[#818cf8] text-[22px] mb-1">add_photo_alternate</span>
                                        <div className="text-xs font-['JetBrains_Mono'] text-[#E2E8F0] font-bold">
                                            Attach screenshot or logs
                                        </div>
                                        <div className="text-[10px] text-[#c4c6cd]">PNG, JPG, or PDF (Max 5MB)</div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowBugModal(false)}
                                        className="btn-secondary px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary px-5 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                                    >
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* =========================================================
                DELETE ACCOUNT CONFIRMATION MODAL
            ========================================================= */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-modal max-w-md w-full rounded-2xl p-6 border border-red-500/40 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 text-red-400">
                            <span className="material-symbols-outlined text-[28px]">warning</span>
                            <h4 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                Confirm Account Deletion
                            </h4>
                        </div>
                        <p className="font-['Inter'] text-xs text-[#c4c6cd] leading-relaxed">
                            Are you absolutely sure you want to permanently delete your Interview AI account? All recorded interview transcripts, audio files, and ATS resume audits will be irreversibly erased.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-secondary px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    navigate('/')
                                }}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-['JetBrains_Mono'] font-bold cursor-pointer"
                            >
                                Yes, Delete My Account
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
                <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        settings
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Settings</span>
                </button>
                <button onClick={() => navigate('/support')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Support</span>
                </button>
            </nav>
        </div>
    )
}

export default Settings
