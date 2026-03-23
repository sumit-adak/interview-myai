import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { 
    Code2, Search, ArrowLeft, Target, Settings, BrainCircuit,
    ChevronDown, Download, AlertCircle, CheckCircle2, ChevronRight,
    Loader2
} from 'lucide-react'
import html2pdf from 'html2pdf.js'

const SimpleAccordion = ({ question, answer, title }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-border rounded-md mb-3 bg-card overflow-hidden">
            <button 
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-foreground pr-8">{question}</span>
                    {title && <span className="text-xs text-muted-foreground">{title}</span>}
                </div>
                {isOpen ? <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-sm text-foreground bg-muted/20 border-t border-border mt-2 whitespace-pre-wrap leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    )
}

const ProgressBar = ({ score }) => {
    const numericScore = parseInt(score) || 0;
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-3xl font-bold text-foreground">{numericScore}%</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Match Score</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${numericScore}%` }}
                />
            </div>
        </div>
    )
}

const Interview = () => {
    const { id } = useParams()
    const { fetchReportById, activeReport, loading } = useInterview()
    const [activeTab, setActiveTab] = useState('technical')
    const navigate = useNavigate()

    useEffect(() => {
        if (id) fetchReportById(id)
    }, [id])

    const handleDownloadPdf = () => {
        const element = document.getElementById('report-content')
        if (!element) return
        
        const opt = {
            margin: 1,
            filename: `interview_strategy_${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save()
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <h2 className="text-lg font-medium text-foreground">Loading specific report...</h2>
            </div>
        )
    }

    if (!activeReport) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Report Not Found</h2>
                <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
            </div>
        )
    }

    const { match_score, technical_questions, behavioral_questions, preparation_strategy, feedback } = activeReport

    const tabs = [
        { id: 'technical', label: 'Technical Assessment', icon: Code2 },
        { id: 'behavioral', label: 'Behavioral Fit', icon: BrainCircuit },
        { id: 'roadmap', label: 'Strategic Roadmap', icon: Target },
        { id: 'feedback', label: 'Core Feedback', icon: Search }
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Sidebar (Navigation) */}
            <aside className="w-full lg:w-64 border-r border-border bg-card flex-shrink-0 flex flex-col">
                <div className="h-16 flex items-center px-4 md:px-6 border-b border-border sticky top-0 bg-card z-10 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="px-2 -ml-2 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Report Sections</p>
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                ${activeTab === tab.id 
                                    ? 'bg-muted text-foreground' 
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                            >
                                <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-border sticky bottom-0 bg-card">
                    <Button variant="outline" className="w-full" onClick={handleDownloadPdf}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </aside>

            {/* Center Content Area */}
            <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8" id="report-content">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Interview Evaluation Report</h1>
                        <p className="text-sm text-muted-foreground">Generated analysis based on your target role mapping.</p>
                    </header>
                    
                    {activeTab === 'technical' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">Technical Questions</h2>
                            {technical_questions?.length > 0 ? (
                                <div className="space-y-1">
                                    {technical_questions.map((q, idx) => (
                                        <SimpleAccordion key={idx} question={q.question} answer={q.answer} title={q.topicSelected} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No technical questions available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'behavioral' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">Behavioral Alignment</h2>
                            {behavioral_questions?.length > 0 ? (
                                <div className="space-y-1">
                                    {behavioral_questions.map((q, idx) => (
                                        <SimpleAccordion key={idx} question={q.question} answer={q.answer} title={q.intention} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No behavioral questions available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">Strategic Roadmap</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground bg-card p-6 rounded-lg border border-border">
                                {preparation_strategy || "No strategy provided."}
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">Core Feedback</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground bg-card p-6 rounded-lg border border-border whitespace-pre-wrap">
                                {feedback || "No feedback provided."}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar (Analytics Panel) */}
            <aside className="w-full lg:w-80 border-l border-border bg-card p-6 flex flex-col gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">Profile Match</h3>
                    <ProgressBar score={match_score} />
                </div>

                {activeReport.skill_gaps && activeReport.skill_gaps.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-destructive" />
                            Identified Gaps
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {activeReport.skill_gaps.map((gap, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                                    {gap.skill || gap}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Next Actions
                    </h3>
                    <ul className="space-y-3">
                        <li className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
                            Review technical core concepts
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
                            Draft STAR method behavioral stories
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
                            Address identified skill gaps
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}

export default Interview