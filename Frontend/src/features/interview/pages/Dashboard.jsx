import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { UploadCloud, Building, UserSquare2, LayoutDashboard, History, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Dashboard = () => {
    const { loading, generateReport, reports } = useInterview()
    const { logout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0]
        if (!jobDescription || (!selfDescription && !resumeFile)) {
            alert("Please provide a job description and either a resume or self description.")
            return
        }
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            } else {
                alert("Failed to generate report. Please try again.")
            }
        } catch (error) {
            alert(error?.response?.data?.message || "Something went wrong")
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-foreground">Generating your report...</h2>
                <p className="text-muted-foreground mt-2 text-sm">Please wait while our engine analyzes your profile.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Standard Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
                <div className="h-16 flex items-center px-6 border-b border-border mb-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
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
                        <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">
                            <History className="mr-2 h-4 w-4" />
                            Recent Plans ({reports.length})
                        </Button>
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

                <div className="max-w-5xl mx-auto p-4 lg:p-8 pb-32">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground mb-1">Create Evaluation</h1>
                        <p className="text-sm text-muted-foreground">Provide the target role details and your profile data.</p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
                        {/* Left Column - Job Description */}
                        <div className="flex flex-col h-full">
                            <Card className="flex-1 border-border shadow-sm flex flex-col">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2 font-semibold text-foreground">
                                            <Building className="w-4 h-4 text-primary" />
                                            Target Job Description
                                        </div>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Required</span>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[300px] resize-none rounded-md border border-input bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                                        placeholder={`Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript...'`}
                                    />
                                    <div className="mt-2 text-right text-xs text-muted-foreground">
                                        {jobDescription.length} / 5000 chars
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Profile */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Resume Upload */}
                            <Card className="border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2 font-semibold text-foreground">
                                            <UserSquare2 className="w-4 h-4 text-foreground" />
                                            Professional Profile
                                        </div>
                                    </div>

                                    <div 
                                        className={`relative border border-dashed rounded-md p-6 transition-colors flex flex-col items-center justify-center text-center cursor-pointer
                                            ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}`}
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
                                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                                        <p className="text-sm font-medium text-foreground mb-1">
                                            {fileName ? fileName : "Upload Resume"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PDF or DOCX (Max 5MB)
                                        </p>
                                        <input
                                            ref={resumeInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* OR Divider */}
                            <div className="flex items-center">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="mx-4 text-xs font-medium text-muted-foreground uppercase">OR</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            {/* Self Description */}
                            <Card className="border-border shadow-sm flex-[1]">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <label className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                                        Quick Self-Description
                                        <span className="text-xs font-normal text-muted-foreground">Optional</span>
                                    </label>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[140px] resize-none rounded-md border border-input bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                                        placeholder="Briefly describe your experience, key skills, and years of experience..."
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 border-t border-border bg-background/95 backdrop-blur z-30 flex items-center justify-between">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground px-4">
                            Strategy generation takes approx ~30s
                        </div>
                        <Button
                            size="lg"
                            className="w-full md:w-auto ml-auto font-semibold"
                            onClick={handleGenerateReport}
                            disabled={!jobDescription || (!selfDescription && !fileName)}
                        >
                            Generate Report
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
