import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import {
    UploadCloud,
    Briefcase,
    UserSquare2,
    FileText,
    Loader2,
    AlertCircle,
    Sparkles,
    LogOut,
    Clock3,
    ChartNoAxesCombined
} from 'lucide-react'

const Dashboard = () => {
    const navigate = useNavigate()
    const { generateReport, reports, getReports } = useInterview()
    const { user, logout } = useAuth()

    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState('')

    const resumeInputRef = useRef(null)

    useEffect(() => {
        getReports()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const latestScore = useMemo(() => {
        if (!reports?.length) return null
        const first = reports[0]
        const parsed = Number(first?.matchScore)
        return Number.isFinite(parsed) ? parsed : null
    }, [reports])

    const onFileChange = (file) => {
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
        setFileName(file.name)
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0]
        setErrorMsg('')

        if (!jobDescription.trim() || !selfDescription.trim()) {
            setErrorMsg('Please provide both job description and your profile summary.')
            return
        }

        setIsGenerating(true)
        try {
            const report = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile
            })

            if (report?._id) {
                navigate(`/interview/${report._id}`)
                return
            }

            setErrorMsg('Report generated but could not be opened. Please try again.')
        } catch (error) {
            setErrorMsg(error?.message || 'Failed to generate report.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="glass-panel flex flex-col justify-between gap-4 rounded-3xl p-5 md:flex-row md:items-center md:p-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
                        <h1 className="mt-1 text-3xl font-bold">Welcome, {user?.username || 'Candidate'}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Build professional interview strategy reports tailored to each role.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Home
                        </Button>
                        <Button variant="ghost" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-5">
                            <div className="rounded-xl bg-accent p-2.5">
                                <Clock3 className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Reports Generated</p>
                                <p className="text-2xl font-bold">{reports?.length || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-5">
                            <div className="rounded-xl bg-accent p-2.5">
                                <ChartNoAxesCombined className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Latest Match Score</p>
                                <p className="text-2xl font-bold">{latestScore != null ? `${latestScore}%` : '--'}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-5">
                            <div className="rounded-xl bg-accent p-2.5">
                                <Sparkles className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Mode</p>
                                <p className="text-2xl font-bold">Advanced</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Create New Evaluation</CardTitle>
                            <CardDescription>Paste role details and your profile summary for a high-quality report.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                    Target Job Description
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-[230px] w-full resize-y rounded-2xl border border-input bg-white/85 p-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Paste complete role description, responsibilities, and required skills..."
                                />
                                <p className="text-xs text-muted-foreground">{jobDescription.length} / 5000 recommended characters</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <UserSquare2 className="h-4 w-4 text-primary" />
                                    Your Professional Summary
                                </label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="min-h-[140px] w-full resize-y rounded-2xl border border-input bg-white/85 p-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Share years of experience, major projects, technical stack, and impact highlights..."
                                />
                            </div>

                            {errorMsg && (
                                <div className="flex items-start gap-2 rounded-2xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="lg" onClick={handleGenerateReport} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    {isGenerating ? 'Generating report...' : 'Generate Professional Report'}
                                </Button>
                                <p className="text-xs text-muted-foreground">Average generation time: 20-40 seconds</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Optional Resume Upload</CardTitle>
                                <CardDescription>PDF or DOCX, max 5MB</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`rounded-2xl border-2 border-dashed p-7 text-center transition-all ${
                                        isDragging ? 'border-primary bg-accent/80' : 'border-border bg-secondary/35'
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
                                        if (!file) return
                                        if (resumeInputRef.current) {
                                            resumeInputRef.current.files = e.dataTransfer.files
                                        }
                                        onFileChange(file)
                                    }}
                                    onClick={() => resumeInputRef.current?.click()}
                                >
                                    <UploadCloud className="mx-auto mb-3 h-8 w-8 text-primary" />
                                    <p className="text-sm font-medium">{fileName || 'Click or drag your resume here'}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Adds context for better question quality</p>
                                    <input
                                        ref={resumeInputRef}
                                        className="hidden"
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={(e) => onFileChange(e.target.files?.[0])}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Reports</CardTitle>
                                <CardDescription>Open any previous evaluation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {!reports?.length && <p className="text-sm text-muted-foreground">No reports yet. Create your first one.</p>}
                                {reports?.slice(0, 6).map((item) => (
                                    <button
                                        key={item._id}
                                        className="w-full rounded-xl border border-border/80 bg-white/80 px-3 py-2 text-left text-sm transition-all hover:border-primary/40 hover:bg-accent/70"
                                        onClick={() => navigate(`/interview/${item._id}`)}
                                    >
                                        <p className="line-clamp-1 font-semibold">{item.title || 'Interview Evaluation'}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.matchScore != null ? `Score ${item.matchScore}%` : 'Score pending'}
                                            {' • '}
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Saved'}
                                        </p>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard
