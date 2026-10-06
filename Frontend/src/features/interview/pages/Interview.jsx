import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Navbar } from '../../../components/layout/Navbar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { useToast } from '../../../components/ui/toast'
import { useInterview } from '../hooks/useInterview'
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    Download,
    FileText,
    ChevronDown,
    ChevronRight,
    Code2,
    BrainCircuit,
    Target,
    CalendarDays,
    Sparkles,
    Copy,
    Check,
    CheckCircle2,
    Lightbulb,
    CheckSquare,
    Square
} from 'lucide-react'

const severityClass = {
    low: 'badge-emerald',
    medium: 'badge-amber',
    high: 'badge-rose'
}

const AccordionItem = ({ title, subtitle, content }) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const { showToast } = useToast()

    const handleCopy = (e) => {
        e.stopPropagation()
        if (!content) return
        navigator.clipboard.writeText(`Question: ${title}\n\nSuggested Answer:\n${content}`)
        setCopied(true)
        showToast({ title: 'Copied to Clipboard', description: 'Question and answer copied to clipboard.' })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200 hover:border-primary/40">
            <button
                className="flex w-full items-center justify-between gap-4 p-4.5 text-left transition-colors hover:bg-muted/30"
                onClick={() => setOpen((prev) => !prev)}
            >
                <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground leading-snug">{title}</p>
                    {subtitle && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span className="line-clamp-1">{subtitle}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopy}
                        className="rounded-lg border border-border/80 bg-secondary/50 p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                        title="Copy question and answer"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </div>
            </button>
            {open && (
                <div className="border-t border-border/60 bg-muted/20 p-4.5 space-y-3 text-sm leading-relaxed text-foreground">
                    {subtitle && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">Interviewer Intention: </span>
                                {subtitle}
                            </div>
                        </div>
                    )}
                    <div className="whitespace-pre-line text-sm text-foreground/90 font-medium">
                        {content}
                    </div>
                </div>
            )}
        </div>
    )
}

const Interview = () => {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { getReportById, report, loading, getResumePdf } = useInterview()
    const { showToast } = useToast()

    const [activeTab, setActiveTab] = useState('technical')
    const [fetchError, setFetchError] = useState('')
    const [resumeLoading, setResumeLoading] = useState(false)
    const [pdfExporting, setPdfExporting] = useState(false)
    const [completedTasks, setCompletedTasks] = useState({})

    useEffect(() => {
        if (!interviewId) return
        setFetchError('')
        getReportById(interviewId).catch((err) => {
            setFetchError(err?.message || 'Could not load report')
        })
    }, [interviewId]) // eslint-disable-line react-hooks/exhaustive-deps

    const matchScore = useMemo(() => {
        const parsed = Number(report?.matchScore)
        return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0
    }, [report])

    const toggleTask = (taskKey) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [taskKey]: !prev[taskKey]
        }))
    }

    const handleDownloadReportPdf = async () => {
        const element = document.getElementById('report-export')
        if (!element) return

        setPdfExporting(true)
        try {
            const { default: html2pdf } = await import('html2pdf.js')
            await html2pdf()
                .set({
                    margin: 10,
                    filename: `interview_report_${interviewId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                })
                .from(element)
                .save()
            showToast({ title: 'Report Exported', description: 'PDF download complete.' })
        } catch (error) {
            console.error("Report PDF export error:", error)
            showToast({ title: 'Export Failed', description: 'Failed to generate PDF. Please try again.', variant: 'error' })
        } finally {
            setPdfExporting(false)
        }
    }

    const handleResumeDownload = async () => {
        setResumeLoading(true)
        try {
            await getResumePdf(interviewId)
            showToast({ title: 'Resume Exported', description: 'ATS resume PDF download complete.' })
        } catch (error) {
            showToast({ title: 'Resume Export Failed', description: error?.message || 'Please try again.', variant: 'error' })
        } finally {
            setResumeLoading(false)
        }
    }

    if (loading && !report) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-semibold text-muted-foreground">Loading Evaluation Report...</p>
                </div>
            </div>
        )
    }

    if (fetchError || !report) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
                    <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                    <h2 className="text-2xl font-bold">Report Unavailable</h2>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">{fetchError || 'Unable to retrieve evaluation report.'}</p>
                    <Button className="mt-6 shadow-md" onClick={() => navigate('/dashboard')}>
                        Back to Workspace
                    </Button>
                </div>
            </div>
        )
    }

    const tabs = [
        { id: 'technical', label: 'Technical Prompts', icon: Code2, count: report.technicalQuestions?.length },
        { id: 'behavioral', label: 'Behavioral Guide', icon: BrainCircuit, count: report.behavioralQuestions?.length },
        { id: 'gaps', label: 'Skill Gap Analysis', icon: Target, count: report.skillGaps?.length },
        { id: 'plan', label: 'Preparation Plan', icon: CalendarDays, count: report.preparationPlan?.length }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] font-['Inter',sans-serif]">
            <Navbar />

            <main className="flex-1 px-4 py-6 sm:px-6 md:py-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header Controls */}
                    <header className="bg-white border border-[#E8E4DC] shadow-sm flex flex-col justify-between gap-4 rounded-2xl p-5 md:flex-row md:items-center md:p-6">
                        <div className="space-y-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-2 h-8 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAF8F5]"
                                onClick={() => navigate('/dashboard')}
                            >
                                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                                Back to Workspace
                            </Button>
                            <h1 className="text-2xl font-bold font-['Hanken_Grotesk'] tracking-tight sm:text-3xl text-[#0F172A]">
                                {report?.title || 'Role Evaluation Strategy Report'}
                            </h1>
                            <p className="text-xs text-[#64748B]">
                                Detailed AI assessment, questions, and step-by-step prep roadmap.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadReportPdf}
                                disabled={pdfExporting}
                                className="border-[#E8E4DC] text-[#0F172A] hover:bg-[#FAF8F5]"
                            >
                                {pdfExporting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-[#2563EB]" /> : <Download className="mr-1.5 h-4 w-4 text-[#2563EB]" />}
                                {pdfExporting ? 'Exporting...' : 'Export Report PDF'}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleResumeDownload}
                                disabled={resumeLoading}
                                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm font-semibold"
                            >
                                {resumeLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileText className="mr-1.5 h-4 w-4" />}
                                Download ATS Resume
                            </Button>
                        </div>
                    </header>

                    {/* Report Navigation Tabs (Sticky Header for Mobile/Desktop) */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-[#2563EB] text-white shadow-sm'
                                        : 'bg-white border border-[#E8E4DC] text-[#64748B] hover:text-[#0F172A] hover:border-blue-200'
                                }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : 'text-[#2563EB]'}`} />
                                {tab.label}
                                {tab.count != null && (
                                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${
                                        activeTab === tab.id ? 'bg-white/20 text-white font-bold' : 'bg-[#FAF8F5] text-[#64748B] border border-[#E8E4DC]'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Layout Grid */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]" id="report-export">
                        {/* Tab Content Section */}
                        <div className="space-y-4">
                            {activeTab === 'technical' && (
                                <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                    <CardHeader className="pb-3 border-b border-[#F0ECE1]">
                                        <CardTitle className="text-xl font-bold font-['Hanken_Grotesk'] text-[#0F172A] flex items-center gap-2">
                                            <Code2 className="h-5 w-5 text-[#2563EB]" />
                                            Technical Questions & Answers
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#64748B]">
                                            Deep-dive role-specific technical prompts with detailed answer explanations.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-3">
                                        {report.technicalQuestions?.map((item, idx) => (
                                            <AccordionItem
                                                key={idx}
                                                title={item.question}
                                                subtitle={item.intention}
                                                content={item.answer}
                                            />
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'behavioral' && (
                                <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                    <CardHeader className="pb-3 border-b border-[#F0ECE1]">
                                        <CardTitle className="text-xl font-bold font-['Hanken_Grotesk'] text-[#0F172A] flex items-center gap-2">
                                            <BrainCircuit className="h-5 w-5 text-[#2563EB]" />
                                            Behavioral & Leadership Scenarios
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#64748B]">
                                            Situational prompts evaluated using the STAR framework method.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-3">
                                        {report.behavioralQuestions?.map((item, idx) => (
                                            <AccordionItem
                                                key={idx}
                                                title={item.question}
                                                subtitle={item.intention}
                                                content={item.answer}
                                            />
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'gaps' && (
                                <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                    <CardHeader className="pb-3 border-b border-[#F0ECE1]">
                                        <CardTitle className="text-xl font-bold font-['Hanken_Grotesk'] text-[#0F172A] flex items-center gap-2">
                                            <Target className="h-5 w-5 text-amber-600" />
                                            Target Skill Gap Analysis
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#64748B]">
                                            Competencies to strengthen before technical rounds.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {report.skillGaps?.map((item, idx) => (
                                                <div key={idx} className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-4 space-y-2 shadow-sm">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-bold text-[#0F172A]">{item.skill}</p>
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${severityClass[item.severity] || severityClass.medium}`}>
                                                            {item.severity || 'medium'} severity
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#64748B]">Focus review area for candidate preparation.</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'plan' && (
                                <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                    <CardHeader className="pb-3 border-b border-[#F0ECE1]">
                                        <CardTitle className="text-xl font-bold font-['Hanken_Grotesk'] text-[#0F172A] flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5 text-[#2563EB]" />
                                            Daily Preparation Roadmap
                                        </CardTitle>
                                        <CardDescription className="text-xs text-[#64748B]">
                                            Interactive task list to track your day-by-day study execution.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-4">
                                        {report.preparationPlan?.map((day, idx) => (
                                            <div key={idx} className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-4.5 space-y-3 shadow-sm">
                                                <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-2">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold font-['JetBrains_Mono']">
                                                        D{day.day}
                                                    </span>
                                                    <p className="text-sm font-bold text-[#0F172A]">{day.focus}</p>
                                                </div>
                                                <ul className="space-y-2">
                                                    {day.tasks?.map((task, tIdx) => {
                                                        const taskKey = `day-${day.day}-task-${tIdx}`
                                                        const isDone = !!completedTasks[taskKey]
                                                        return (
                                                            <li
                                                                key={tIdx}
                                                                onClick={() => toggleTask(taskKey)}
                                                                className={`flex items-start gap-2.5 text-xs p-2 rounded-lg transition-colors cursor-pointer ${
                                                                    isDone ? 'bg-emerald-50 text-emerald-800 line-through' : 'hover:bg-white text-[#0F172A]'
                                                                }`}
                                                            >
                                                                {isDone ? (
                                                                    <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                                ) : (
                                                                    <Square className="h-4 w-4 text-[#64748B] shrink-0 mt-0.5" />
                                                                )}
                                                                <span className="leading-relaxed">{task}</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar Metrics Column */}
                        <div className="space-y-6">
                            {/* Score Card */}
                            <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                <CardHeader className="pb-3 text-center border-b border-[#F0ECE1]">
                                    <CardTitle className="text-base font-bold text-[#0F172A]">Target Match Score</CardTitle>
                                    <CardDescription className="text-xs text-[#64748B]">Overall alignment with job requirement</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4 pt-5">
                                    <div className="inline-flex flex-col items-center justify-center rounded-full border-4 border-blue-100 bg-blue-50/50 p-6 h-36 w-36 mx-auto">
                                        <span className="text-4xl font-extrabold text-[#2563EB] font-['JetBrains_Mono']">{matchScore}%</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mt-1">Match Index</span>
                                    </div>

                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FAF8F5] border border-[#E8E4DC]">
                                        <div
                                            className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                                            style={{ width: `${matchScore}%` }}
                                        />
                                    </div>

                                    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-3 text-left space-y-1">
                                        <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            {matchScore >= 75 ? 'Exceptional Fit' : matchScore >= 50 ? 'Moderate Fit' : 'Requires Focus'}
                                        </p>
                                        <p className="text-[11px] text-[#64748B]">
                                            Focus on high-severity skill gaps to maximize panel readiness.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Execution Checklist Tips */}
                            <Card className="bg-white border border-[#E8E4DC] shadow-sm rounded-2xl">
                                <CardHeader className="pb-3 border-b border-[#F0ECE1]">
                                    <CardTitle className="text-base font-bold text-[#0F172A]">Pro Interview Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-xs text-[#64748B] pt-4">
                                    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-2.5">
                                        <p className="font-semibold text-[#0F172A] mb-0.5">Use STAR Technique</p>
                                        <p className="text-[11px] text-[#64748B]">Structure responses by Situation, Task, Action, and Result.</p>
                                    </div>
                                    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-2.5">
                                        <p className="font-semibold text-[#0F172A] mb-0.5">Quantify Outcomes</p>
                                        <p className="text-[11px] text-[#64748B]">Include metrics e.g., "Improved speed by 35%".</p>
                                    </div>
                                    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-2.5">
                                        <p className="font-semibold text-[#0F172A] mb-0.5">Prepare Questions</p>
                                        <p className="text-[11px] text-[#64748B]">Ask 2 strategic questions about team challenges.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Interview
