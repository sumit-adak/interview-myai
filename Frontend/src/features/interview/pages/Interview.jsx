import React, { useState } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { MonitorPlay, Users, Map, ChevronDown, DownloadCloud, Sparkles, ChevronLeft } from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Details', icon: <MonitorPlay className="w-5 h-5" /> },
    { id: 'behavioral', label: 'Behavioral Prep', icon: <Users className="w-5 h-5" /> },
    { id: 'roadmap', label: 'Preparation Plan', icon: <Map className="w-5 h-5" /> },
]

const AccordionItem = ({ item, index, isOpen, onToggle, type }) => {
    return (
        <Card className={`mb-4 border-white/5 transition-colors overflow-hidden ${isOpen ? (type === 'technical' ? 'border-primary/50 bg-primary/5' : 'border-secondary/50 bg-secondary/5') : 'bg-card/40 hover:bg-white/5 backdrop-blur-sm'}`}>
            <div 
                className="p-4 flex items-center justify-between cursor-pointer select-none"
                onClick={onToggle}
            >
                <div className="flex gap-4 items-center pr-8">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${type === 'technical' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        Q{index + 1}
                    </div>
                    <h3 className="text-white font-medium line-clamp-2 md:line-clamp-none leading-tight">{item.question}</h3>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white/10' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <CardContent className="px-4 pb-4 pt-0 border-t border-white/5 mt-2">
                            <div className="pt-4 space-y-4">
                                <div>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mb-2 ${type === 'technical' ? 'bg-primary/10 text-primary ring-primary/20' : 'bg-secondary/10 text-secondary ring-secondary/20'}`}>
                                        Intention
                                    </span>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.intention}</p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/10 mb-2">
                                        Model Answer
                                    </span>
                                    <p className="text-sm text-white/90 leading-relaxed bg-background/50 p-4 rounded-xl border border-white/5">{item.answer}</p>
                                </div>
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}

const RoadMapDay = ({ day }) => (
    <Card className="mb-4 border-white/5 bg-card/40 backdrop-blur-sm hover:border-accent/30 transition-colors">
        <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <span className="flex-shrink-0 inline-flex items-center rounded-md bg-accent/10 px-3 py-1 text-sm font-semibold text-accent ring-1 ring-inset ring-accent/20 glow-blue">
                    Day {day.day}
                </span>
                <h3 className="text-lg font-semibold text-white">{day.focus}</h3>
            </div>
            <ul className="space-y-3 pl-2">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0 glow-blue" />
                        <span className="leading-relaxed">{task}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
)

const CircularProgress = ({ value, colorClass, strokeColor }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
                <circle
                    className="text-white/5"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke={strokeColor || "currentColor"}
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${colorClass.replace('text-', 'text-transparent bg-clip-text bg-gradient-to-br from-white to-')}`}>{value}<span className="text-xl">%</span></span>
                <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Match</span>
            </div>
        </div>
    )
}

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [openQuestions, setOpenQuestions] = useState({ technical: 0, behavioral: 0 })
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const toggleQuestion = (idx) => {
        setOpenQuestions(prev => ({
            ...prev,
            [activeNav]: prev[activeNav] === idx ? null : idx
        }))
    }

    if (!report && loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-r-secondary rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-4 border-4 border-transparent border-b-accent rounded-full animate-[spin_2s_linear_infinite]"></div>
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white">Loading Strategy...</h2>
            </div>
        )
    }

    if (!report && !loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
                <p className="text-muted-foreground mb-6">We couldn't load the strategy for this interview.</p>
                <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
        )
    }

    const isHighMatch = report.matchScore >= 80;
    const isMidMatch = report.matchScore >= 60 && report.matchScore < 80;
    const scoreColorClass = isHighMatch ? 'text-primary' : isMidMatch ? 'text-secondary' : 'text-accent';
    const strokeHex = isHighMatch ? '#ff0080' : isMidMatch ? '#7928ca' : '#0070f3';

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 glass sticky top-0 z-40 border-b border-white/5 bg-background/80">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full w-8 h-8 text-muted-foreground hover:text-white bg-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="hidden md:flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center glow-magenta">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-lg text-white">Interview<span className="text-primary">AI</span></span>
                    </div>
                </div>
                <h1 className="text-sm font-semibold text-white/80 line-clamp-1 max-w-sm ml-4 absolute left-1/2 -translate-x-1/2">
                    {report.title || 'Role Overview'}
                </h1>
                <Button variant="outline" size="sm" onClick={() => getResumePdf(interviewId)} className="h-9 px-4 hidden sm:flex">
                    <DownloadCloud className="w-4 h-4 mr-2" />
                    Export PDF
                </Button>
                <Button variant="outline" size="icon" onClick={() => getResumePdf(interviewId)} className="h-9 w-9 sm:hidden">
                    <DownloadCloud className="w-4 h-4" />
                </Button>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto relative flex flex-col lg:flex-row">
                
                {/* 1. Left Navigation Sidebar */}
                <aside className="w-full lg:w-64 lg:border-r border-white/5 p-6 flex flex-col gap-2 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] bg-card/10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 pl-2">Strategy Sections</p>
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeNav === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                                    isActive 
                                    ? `bg-white/10 text-white ${item.id==='technical'?'ring-1 ring-primary/30 glow-magenta':item.id==='behavioral'?'ring-1 ring-secondary/30 glow-purple':'ring-1 ring-accent/30 glow-blue'}` 
                                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? (item.id==='technical'?'text-primary':item.id==='behavioral'?'text-secondary':'text-accent') : ''}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        )
                    })}
                </aside>

                {/* 2. Center Content Area */}
                <div className="flex-1 p-6 lg:p-10 pb-24 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeNav}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="mb-8 border-b border-white/5 pb-6">
                                <h2 className="text-3xl font-bold text-white mb-2 capitalize">
                                    {NAV_ITEMS.find(i => i.id === activeNav)?.label}
                                </h2>
                                <p className="text-muted-foreground">
                                    {activeNav === 'technical' && `Core topics and system design questions tailored for ${report.title}.`}
                                    {activeNav === 'behavioral' && "Questions designed to assess culture fit and previous experience."}
                                    {activeNav === 'roadmap' && "Your day-by-day action plan to close skill gaps and succeed."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {activeNav === 'technical' && report.technicalQuestions.map((q, i) => (
                                    <AccordionItem key={i} item={q} index={i} isOpen={openQuestions.technical === i} onToggle={() => toggleQuestion(i)} type="technical" />
                                ))}

                                {activeNav === 'behavioral' && report.behavioralQuestions.map((q, i) => (
                                    <AccordionItem key={i} item={q} index={i} isOpen={openQuestions.behavioral === i} onToggle={() => toggleQuestion(i)} type="behavioral" />
                                ))}

                                {activeNav === 'roadmap' && report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 3. Right Sidebar - Score and Analysis */}
                <aside className="w-full lg:w-80 lg:border-l border-white/5 bg-card/20 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col gap-10">
                    
                    {/* Match Score */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 w-full text-left">Overall Fit</h3>
                        <CircularProgress value={report.matchScore} colorClass={scoreColorClass} strokeColor={strokeHex} />
                        <p className="text-sm text-center text-muted-foreground mt-6 font-medium">
                            {isHighMatch ? "You are a very strong candidate for this role." : isMidMatch ? "You meet the core requirements, focus on your gaps." : "Significant gaps. Dedicated focus required."}
                        </p>
                    </div>

                    {/* Skill Gaps */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Identified Skill Gaps</h3>
                        <div className="flex flex-wrap gap-2">
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border ${
                                    gap.severity === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20 glow-magenta' :
                                    gap.severity === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                    'bg-accent/10 text-accent border-accent/20'
                                }`}>
                                    {gap.skill}
                                </span>
                            ))}
                            {report.skillGaps.length === 0 && (
                                <p className="text-sm text-muted-foreground">No significant skill gaps identified.</p>
                            )}
                        </div>
                    </div>

                </aside>
            </main>
        </div>
    )
}

export default Interview