import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
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
    Sparkles
} from 'lucide-react'
import html2pdf from 'html2pdf.js'

const severityClass = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    medium: 'bg-amber-100 text-amber-700 border-amber-300',
    high: 'bg-rose-100 text-rose-700 border-rose-300'
}

const AccordionItem = ({ title, subtitle, content }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-white/90">
            <button
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
                onClick={() => setOpen((prev) => !prev)}
            >
                <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
            {open && <div className="border-t border-border bg-secondary/30 p-4 text-sm leading-relaxed text-foreground">{content}</div>}
        </div>
    )
}

const Interview = () => {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { getReportById, report, loading, getResumePdf } = useInterview()

    const [activeTab, setActiveTab] = useState('technical')
    const [fetchError, setFetchError] = useState('')
    const [resumeLoading, setResumeLoading] = useState(false)

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

    const handleDownloadReportPdf = () => {
        const element = document.getElementById('report-export')
        if (!element) return

        html2pdf()
            .set({
                margin: 10,
                filename: `interview_report_${interviewId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .save()
    }

    const handleResumeDownload = async () => {
        setResumeLoading(true)
        try {
            await getResumePdf(interviewId)
        } finally {
            setResumeLoading(false)
        }
    }

    if (loading && !report) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading report...</p>
            </div>
        )
    }

    if (fetchError || !report) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
                <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
                <h2 className="text-2xl font-semibold">Unable to open report</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{fetchError || 'This report is unavailable.'}</p>
                <Button className="mt-5" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
            </div>
        )
    }

    const tabs = [
        { id: 'technical', label: 'Technical Questions', icon: Code2 },
        { id: 'behavioral', label: 'Behavioral Questions', icon: BrainCircuit },
        { id: 'gaps', label: 'Skill Gaps', icon: Target },
        { id: 'plan', label: 'Preparation Plan', icon: CalendarDays }
    ]

    return (
        <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="glass-panel mb-6 flex flex-col justify-between gap-4 rounded-3xl p-5 md:flex-row md:items-center md:p-6">
                    <div>
                        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Dashboard
                        </Button>
                        <h1 className="text-2xl font-bold md:text-3xl">{report?.title || 'Interview Evaluation Report'}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Advanced analysis with role-aligned preparation strategy</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" onClick={handleDownloadReportPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Export report PDF
                        </Button>
                        <Button onClick={handleResumeDownload} disabled={resumeLoading}>
                            {resumeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Download ATS resume
                        </Button>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[250px_1fr_300px]" id="report-export">
                    <aside className="space-y-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Sections</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>

                    <main className="space-y-4">
                        {activeTab === 'technical' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Technical Interview Questions</CardTitle>
                                    <CardDescription>Role-specific deep-dive prompts with strong answer directions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Behavioral Interview Questions</CardTitle>
                                    <CardDescription>Communication and leadership scenarios with structured response guides</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skill Gaps</CardTitle>
                                    <CardDescription>Prioritized competencies to strengthen for better role fit</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 sm:grid-cols-2">
                                    {report.skillGaps?.map((item, idx) => (
                                        <div key={idx} className="rounded-2xl border border-border bg-white/80 p-4">
                                            <p className="text-sm font-semibold">{item.skill}</p>
                                            <span
                                                className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${severityClass[item.severity] || severityClass.medium}`}
                                            >
                                                {item.severity || 'medium'}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'plan' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preparation Plan</CardTitle>
                                    <CardDescription>Day-wise roadmap to increase interview readiness</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {report.preparationPlan?.map((day, idx) => (
                                        <div key={idx} className="rounded-2xl border border-border bg-white/90 p-4">
                                            <p className="text-sm font-bold text-primary">Day {day.day}: {day.focus}</p>
                                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                                                {day.tasks?.map((task, tIdx) => (
                                                    <li key={tIdx}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </main>

                    <aside className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Overall Match</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-4xl font-bold">{matchScore}%</p>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${matchScore}%` }} />
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">Higher score means stronger alignment with role requirements.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Execution Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p className="rounded-xl bg-secondary/40 p-3">Use STAR format for behavioral answers.</p>
                                <p className="rounded-xl bg-secondary/40 p-3">Quantify outcomes when discussing projects.</p>
                                <p className="rounded-xl bg-secondary/40 p-3">Prioritize high-severity gaps first.</p>
                                <p className="rounded-xl bg-secondary/40 p-3">Run one mock interview before final round.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-2 p-4 text-sm text-muted-foreground">
                                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                                This report is optimized for practical execution. Keep revising and regenerate after each major update.
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview
