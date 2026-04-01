import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { UploadCloud, Building, UserSquare2, LayoutDashboard, History, LogOut, Loader2, ChevronDown, ChevronRight, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Dashboard = () => {
    const { loading, generateReport, reports, getReports } = useInterview()
    const { logout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState("")
    const [isRecentExpanded, setIsRecentExpanded] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    // Fetch past reports on mount (non-blocking — does NOT set global loading)
    useEffect(() => {
        getReports()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0]
        setErrorMsg("")
        if (!jobDescription || !selfDescription) {
            setErrorMsg("Please provide both a job description and a self description.")
            return
        }
        setIsGenerating(true)
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setErrorMsg("Failed to generate report. Please try again.")
            }
        } catch (error) {
            setErrorMsg(error?.message || "Something went wrong. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    if (isGenerating) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-foreground">Generating your report...</h2>
                <p className="text-muted-foreground mt-2 text-sm">Please wait while our AI engine analyzes your profile. This may take ~30s.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Formatted Slim Sidebar */}
            <aside className="hidden lg:flex w-56 flex-col border-r border-border bg-card">
                <div className="h-16 flex items-center px-6 border-b border-border mb-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-lg">AI</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-foreground">Platform</span>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-1">
                    <Button variant="secondary" className="w-full justify-start font-medium" onClick={() => {}}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        New Evaluation
                    </Button>
                    {reports.length > 0 && (
                        <div className="flex flex-col">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-between font-medium text-muted-foreground"
                                onClick={() => setIsRecentExpanded(!isRecentExpanded)}
                            >
                                <div className="flex items-center">
                                    <History className="mr-2 h-4 w-4" />
                                    Recent Plans ({reports.length})
                                </div>
                                {isRecentExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                            {isRecentExpanded && (
                                <div className="ml-6 mt-1 flex flex-col gap-1 border-l-2 border-border pl-2">
                                    {reports.slice(0, 5).map(r => (
                                        <button 
                                            key={r._id} 
                                            onClick={() => navigate(`/interview/${r._id}`)}
                                            className="text-left text-xs font-medium text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-md hover:bg-muted/50 truncate"
                                        >
                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Saved Evaluation"} ({r._id?.slice(-4)})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full relative bg-background">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border sticky top-0 z-40 bg-background">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                            <span className="font-bold text-white text-sm">AI</span>
                        </div>
                        <span className="font-semibold text-base text-foreground">Platform</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </header>

                <div className="max-w-6xl mx-auto px-6 py-8 pb-32">
                    <div className="mb-8 pl-1">
                        <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Create Evaluation</h1>
                        <p className="text-sm text-muted-foreground">Provide the target role details and your profile data.</p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        {/* Left Column - Job Description */}
                        <div className="flex flex-col h-full">
                            <Card className="flex-1 bg-card border border-border shadow-sm rounded-2xl flex flex-col">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-secondary/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <Building className="w-4 h-4 text-primary" />
                                            Target Job Description
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase">Required</span>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[350px] resize-none rounded-xl border border-border bg-transparent p-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground transition-all duration-200"
                                        placeholder={`Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript...'`}
                                    />
                                    <div className="mt-3 text-right text-xs text-muted-foreground flex justify-between items-center">
                                        <span>Paste the exact text from the job board for highest accuracy.</span>
                                        <span>{jobDescription.length} / 5000 chars</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Profile */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Resume Upload */}
                            <Card className="bg-card border border-border shadow-sm rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-secondary/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <UploadCloud className="w-4 h-4 text-primary" />
                                            Resume Upload
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-transparent text-muted-foreground border border-border tracking-wider uppercase">Optional</span>
                                    </div>

                                    <div 
                                        className={`relative border border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer group
                                            ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary hover:bg-secondary/20'}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault()
                                            setIsDragging(false)
                                            const file = e.dataTransfer.files?.[0]
                                            if (file) {
                                                resumeInputRef.current.files = e.dataTransfer.files
                                                setFileName(file.name)
                                            }
                                        }}
                                        onClick={() => resumeInputRef.current?.click()}
                                    >
                                        <FileText className={`w-8 h-8 mb-4 transition-colors ${fileName ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'}`} />
                                        <p className="text-sm font-medium text-foreground mb-1.5">
                                            {fileName ? fileName : "Click or drag file to upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {fileName ? 'Ready for analysis' : 'PDF or DOCX (Max 5MB)'}
                                        </p>
                                        <input
                                            ref={resumeInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="mt-4 text-xs text-muted-foreground">
                                        Your resume provides context for specialized technical probing.
                                    </div>
                                </CardContent>
                            </Card>

                            {/* OR Divider */}
                            <div className="flex items-center py-2">
                                <div className="flex-grow border-t border-secondary"></div>
                                <span className="mx-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">OR</span>
                                <div className="flex-grow border-t border-secondary"></div>
                            </div>

                            {/* Self Description */}
                            <Card className="bg-card border border-border shadow-sm rounded-2xl flex-[1]">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-secondary/50">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <UserSquare2 className="w-4 h-4 text-muted-foreground" />
                                            Quick Summary
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase">Required</span>
                                    </div>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[140px] resize-none rounded-xl border border-border bg-transparent p-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground transition-all duration-200"
                                        placeholder="Briefly describe your experience, key skills, and years of experience..."
                                    />
                                    <div className="mt-3 text-xs text-muted-foreground">
                                        Required to analyze your profile and generate tailored questions.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="fixed bottom-20 left-0 lg:left-56 right-0 px-6 z-40">
                            <div className="max-w-6xl mx-auto bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMsg}</span>
                                <button className="ml-auto text-xs underline opacity-70 hover:opacity-100" onClick={() => setErrorMsg("")}>Dismiss</button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 lg:left-56 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-md z-30 flex items-center justify-between shadow-sm">
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground px-4">
                            Analysis engine takes approx ~30s
                        </div>
                        <Button
                            size="lg"
                            className="w-full md:w-auto ml-auto font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 shadow-sm transition-all duration-200"
                            onClick={handleGenerateReport}
                            disabled={isGenerating || !jobDescription || !selfDescription}
                        >
                            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : "Generate Report"}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
