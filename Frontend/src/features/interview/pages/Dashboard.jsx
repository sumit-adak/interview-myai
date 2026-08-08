import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Navbar } from '../../../components/layout/Navbar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import { useDebounce } from '../../../hooks/useDebounce'
import {
    UploadCloud,
    Briefcase,
    UserSquare2,
    Loader2,
    AlertCircle,
    Sparkles,
    Clock3,
    ChartNoAxesCombined,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    Wand2,
    FileCheck,
    X,
    ArrowUpRight,
    Filter
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

const SAMPLE_JOB_DESC = `Senior Frontend Engineer (React / TypeScript)
Responsibilities:
- Architect and scale high-performance web applications using React, Next.js, and TypeScript.
- Optimize frontend state management, bundle size, and web vitals for maximum responsiveness.
- Collaborate with backend engineers to design clean REST/GraphQL APIs.
- Write robust unit & integration tests using Jest/React Testing Library.

Requirements:
- 4+ years experience with React, JavaScript (ES6+), and modern CSS frameworks.
- Deep understanding of web performance, asynchronous programming, and web security.
- Experience leading technical discussions and mentoring junior engineers.`

const SAMPLE_SELF_DESC = `Senior Full-Stack Engineer with 5 years of experience specializing in React, Node.js, and cloud deployments.
Led frontend architecture for an e-commerce platform serving 500k monthly active users, improving page load times by 40%.
Proficient in TypeScript, TailwindCSS, State Management (Redux/Zustand), RESTful APIs, and CI/CD pipelines.
Strong background in system design, unit testing, and agile team workflows.`

const Dashboard = () => {
    const navigate = useNavigate()
    const { generateReport, reports, getReports, pagination, removeReport } = useInterview()
    const { user } = useAuth()
    const { showToast } = useToast()

    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [reportsLoading, setReportsLoading] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [deletingId, setDeletingId] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const resumeInputRef = useRef(null)
    const debouncedJobDescription = useDebounce(jobDescription, 250)

    const loadReports = useCallback((page) => {
        setReportsLoading(true)
        getReports({ page, limit: ITEMS_PER_PAGE })
            .finally(() => setReportsLoading(false))
    }, [getReports])

    useEffect(() => {
        loadReports(currentPage)
    }, [currentPage, loadReports])

    const latestScore = useMemo(() => {
        if (!reports?.length) return null
        const first = reports[0]
        const parsed = Number(first?.matchScore)
        return Number.isFinite(parsed) ? parsed : null
    }, [reports])

    // Filter reports based on search query
    const filteredReports = useMemo(() => {
        if (!reports) return []
        if (!searchQuery.trim()) return reports
        return reports.filter((r) =>
            (r.title || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
        )
    }, [reports, searchQuery])

    const handleFile = (file) => {
        if (!file) return

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]

        if (!validTypes.includes(file.type)) {
            setErrorMsg('Only PDF and DOCX files are supported.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('Resume file is too large. Max allowed size is 5MB.')
            return
        }

        setErrorMsg('')
        setSelectedFile(file)
    }

    const removeSelectedFile = () => {
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ''
        }
    }

    const handleFillSampleData = () => {
        setJobDescription(SAMPLE_JOB_DESC)
        setSelfDescription(SAMPLE_SELF_DESC)
        setErrorMsg('')
        showToast({ title: 'Sample Data Filled', description: 'Sample job description & profile loaded.' })
    }

    const handleGenerateReport = async () => {
        setErrorMsg('')

        if (!jobDescription.trim() || !selfDescription.trim()) {
            setErrorMsg('Please provide both target job description and your profile summary.')
            return
        }

        setIsGenerating(true)
        try {
            const report = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile: selectedFile
            })

            if (report?._id) {
                showToast({ title: 'Report Generated', description: 'Your interview strategy report is ready.' })
                setCurrentPage(1)
                loadReports(1)
                navigate(`/interview/${report._id}`)
                return
            }

            setErrorMsg('Report generated but could not be opened. Please try again.')
        } catch (error) {
            setErrorMsg(error?.message || 'Failed to generate report.')
            showToast({ title: 'Generation Failed', description: error?.message || 'Please try again.', variant: 'error' })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDelete = async (e, reportId) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this report?')) return

        setDeletingId(reportId)
        try {
            await removeReport(reportId)
            showToast({ title: 'Report Deleted', description: 'The report has been permanently removed.' })
            const remainingOnPage = reports.length - 1
            if (remainingOnPage === 0 && currentPage > 1) {
                setCurrentPage((p) => p - 1)
            } else {
                loadReports(currentPage)
            }
        } catch (error) {
            showToast({ title: 'Delete Failed', description: error?.message || 'Please try again.', variant: 'error' })
        } finally {
            setDeletingId(null)
        }
    }

    const getScoreBadgeClass = (score) => {
        if (score == null) return 'badge-blue'
        if (score >= 75) return 'badge-emerald'
        if (score >= 50) return 'badge-amber'
        return 'badge-rose'
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />

            <main className="flex-1 px-4 py-6 sm:px-6 md:py-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header Banner */}
                    <div className="glass-panel flex flex-col justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-center md:p-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                                <Sparkles className="h-3.5 w-3.5" />
                                Interactive AI Workspace
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                Welcome back, <span className="gradient-text">{user?.username || 'Candidate'}</span>
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Generate customized role-aligned interview evaluations, ATS resume reviews, and daily study roadmaps.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleFillSampleData}
                                className="border-primary/40 text-primary hover:bg-primary/10"
                            >
                                <Wand2 className="mr-1.5 h-4 w-4" />
                                Fill Sample Data
                            </Button>
                        </div>
                    </div>

                    {/* Quick Metrics Cards */}
                    <section className="grid gap-4 sm:grid-cols-3">
                        <Card className="glass-panel border-border/80">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Clock3 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Evaluations</p>
                                    <p className="text-2xl font-extrabold text-foreground">{pagination?.total || 0}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-panel border-border/80">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                    <ChartNoAxesCombined className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest Role Match</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-extrabold text-foreground">
                                            {latestScore != null ? `${latestScore}%` : '--'}
                                        </p>
                                        {latestScore != null && (
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${getScoreBadgeClass(latestScore)}`}>
                                                {latestScore >= 75 ? 'Strong' : latestScore >= 50 ? 'Moderate' : 'Needs Work'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-panel border-border/80">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Intelligence</p>
                                    <p className="text-2xl font-extrabold text-foreground">Advanced v2.4</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Main Form & Recent Reports Grid */}
                    <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                        {/* Evaluation Form */}
                        <Card className="glass-panel overflow-hidden border-border/80">
                            <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Create Role Evaluation</CardTitle>
                                        <CardDescription className="mt-1 text-xs">
                                            Paste target position details and your background to build an interview strategy.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleFillSampleData}
                                        className="text-xs text-primary hover:bg-primary/10"
                                    >
                                        <Wand2 className="h-3.5 w-3.5 mr-1" />
                                        Auto-Fill Test Prompt
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Job Description Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            Target Job Description
                                        </label>
                                        {jobDescription && (
                                            <button
                                                onClick={() => setJobDescription('')}
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="min-h-[200px] w-full resize-y rounded-2xl border border-input bg-card p-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                                        placeholder="Paste full job posting, required qualifications, technical stack, and responsibilities..."
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Provide key requirements for higher precision</span>
                                        <span>{debouncedJobDescription.length} chars</span>
                                    </div>
                                </div>

                                {/* Profile Summary Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <UserSquare2 className="h-4 w-4 text-primary" />
                                            Your Professional Summary & Background
                                        </label>
                                        {selfDescription && (
                                            <button
                                                onClick={() => setSelfDescription('')}
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        className="min-h-[140px] w-full resize-y rounded-2xl border border-input bg-card p-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                                        placeholder="Summarize your years of experience, core technical skills, key projects, and career achievements..."
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                                    <Button
                                        size="lg"
                                        onClick={handleGenerateReport}
                                        disabled={isGenerating}
                                        className="h-12 px-8 text-base shadow-lg shadow-primary/25"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing & Generating Strategy...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Generate Evaluation Report
                                            </>
                                        )}
                                    </Button>
                                    <span className="text-xs text-muted-foreground font-medium">Est. time: 20-30 seconds</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar Column: Upload & Recent Reports */}
                        <div className="space-y-6">
                            {/* Optional Resume Upload Card */}
                            <Card className="glass-panel border-border/80">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <span>Optional Resume Upload</span>
                                        <span className="text-xs font-normal text-muted-foreground">PDF / DOCX</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Attaching a resume helps extract specific project details.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {selectedFile ? (
                                        <div className="flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/5 p-4">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                                    <FileCheck className="h-5 w-5" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="truncate text-xs font-semibold text-foreground">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={removeSelectedFile}
                                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove file"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                                                isDragging
                                                    ? 'border-primary bg-primary/10 scale-[0.99]'
                                                    : 'border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40'
                                            }`}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                setIsDragging(true)
                                            }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                setIsDragging(false)
                                                const file = e.dataTransfer.files?.[0]
                                                if (file) handleFile(file)
                                            }}
                                            onClick={() => resumeInputRef.current?.click()}
                                        >
                                            <UploadCloud className="mx-auto mb-2 h-8 w-8 text-primary animate-bounce" />
                                            <p className="text-xs font-bold text-foreground">Click or drag resume file here</p>
                                            <p className="mt-1 text-[11px] text-muted-foreground">Supports PDF and DOCX (Max 5MB)</p>
                                            <input
                                                ref={resumeInputRef}
                                                className="hidden"
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={(e) => handleFile(e.target.files?.[0])}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Reports Card */}
                            <Card className="glass-panel border-border/80">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Recent Reports</CardTitle>
                                        <span className="text-xs text-muted-foreground">{pagination?.total || 0} total</span>
                                    </div>
                                    {/* Search Filter Input */}
                                    <div className="relative mt-2">
                                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search reports by title..."
                                            className="w-full rounded-xl border border-input bg-card pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary text-foreground"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2.5">
                                    {reportsLoading && (
                                        <div className="space-y-2">
                                            <Skeleton className="h-14 w-full rounded-xl" />
                                            <Skeleton className="h-14 w-full rounded-xl" />
                                            <Skeleton className="h-14 w-full rounded-xl" />
                                        </div>
                                    )}

                                    {!reportsLoading && !filteredReports?.length && (
                                        <div className="py-6 text-center text-xs text-muted-foreground space-y-1">
                                            <Filter className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
                                            <p className="font-semibold">No evaluation reports found.</p>
                                            <p className="text-[11px]">Generate your first report to get started.</p>
                                        </div>
                                    )}

                                    {!reportsLoading && filteredReports?.map((item) => (
                                        <div key={item._id} className="group relative">
                                            <button
                                                className="w-full rounded-2xl border border-border/80 bg-card p-3 pr-10 text-left text-xs transition-all hover:border-primary/50 hover:bg-accent/50 shadow-sm"
                                                onClick={() => navigate(`/interview/${item._id}`)}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="line-clamp-1 font-bold text-foreground">
                                                        {item.title || 'Interview Evaluation'}
                                                    </p>
                                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                                                    <span>
                                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Saved'}
                                                    </span>
                                                    {item.matchScore != null && (
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getScoreBadgeClass(item.matchScore)}`}>
                                                            {item.matchScore}% Score
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                            <button
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                                onClick={(e) => handleDelete(e, item._id)}
                                                disabled={deletingId === item._id}
                                                title="Delete report"
                                            >
                                                {deletingId === item._id
                                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    : <Trash2 className="h-3.5 w-3.5" />
                                                }
                                            </button>
                                        </div>
                                    ))}

                                    {/* Pagination Controls */}
                                    {!reportsLoading && pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage <= 1}
                                                onClick={() => setCurrentPage((p) => p - 1)}
                                                className="h-7 text-xs px-2.5"
                                            >
                                                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                                            </Button>
                                            <span className="text-[11px] font-semibold text-muted-foreground">
                                                {currentPage} / {pagination.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage >= pagination.totalPages}
                                                onClick={() => setCurrentPage((p) => p + 1)}
                                                className="h-7 text-xs px-2.5"
                                            >
                                                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
