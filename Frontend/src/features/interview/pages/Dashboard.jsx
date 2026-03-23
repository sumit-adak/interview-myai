import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Sparkles, UploadCloud, Briefcase, FileText, LayoutDashboard, History, LogOut } from 'lucide-react'
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
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-r-secondary rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-4 border-4 border-transparent border-b-accent rounded-full animate-[spin_2s_linear_infinite]"></div>
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#b946e6] to-secondary glow-magenta">
                    Analyzing your profile...
                </h2>
                <p className="text-muted-foreground mt-2">Our AI is building your custom strategy</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 glass bg-card/30">
                <div className="h-16 flex items-center px-6 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-magenta">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => navigate('/')}>
                            Interview<span className="text-primary">AI</span>
                        </span>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start bg-white/5 text-white glow-blue" onClick={() => {}}>
                        <LayoutDashboard className="mr-2 h-5 w-5 text-accent" />
                        New Evaluation
                    </Button>
                    {/* Just visual mock of history if active */}
                    {reports.length > 0 && (
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white">
                            <History className="mr-2 h-5 w-5" />
                            Recent Plans ({reports.length})
                        </Button>
                    )}
                </nav>

                <div className="p-4 border-t border-white/5 mt-auto">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                        <LogOut className="mr-2 h-5 w-5" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between h-16 px-6 glass border-b border-white/5 sticky top-0 z-40 bg-background/80">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center glow-magenta">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-lg text-white">Interview<span className="text-primary">AI</span></span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground"><LogOut className="h-5 w-5" /></Button>
                </header>

                <div className="max-w-6xl mx-auto p-6 lg:p-10 pb-32">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">Create New Strategy</h1>
                        <p className="text-muted-foreground">Provide the target role details and your profile data to get a custom roadmap.</p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column - Job Description */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="h-full border-white/10 bg-card/40 backdrop-blur-xl">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-lg font-semibold text-white">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                            Target Job Description
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">Required</span>
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[300px] resize-none rounded-xl border border-white/10 bg-background/50 p-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all placeholder:text-muted-foreground/50 scrollbar-thin scrollbar-thumb-white/10"
                                        placeholder={`Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript...'`}
                                    />
                                    <div className="mt-2 text-right text-xs text-muted-foreground">
                                        {jobDescription.length} / 5000 chars
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Right Column - Profile */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
                            
                            {/* Resume Upload */}
                            <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-lg font-semibold text-white">
                                            <FileText className="w-5 h-5 text-secondary" />
                                            Your Profile
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-secondary/20 text-secondary border border-secondary/30">Best Results</span>
                                    </div>

                                    <div 
                                        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group
                                            ${isDragging ? 'border-primary bg-primary/5' : 'border-white/10 bg-background/30 hover:border-white/20 hover:bg-white/5'}`}
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
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                                            <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
                                        </div>
                                        <p className="text-sm font-medium text-white mb-1">
                                            {fileName ? fileName : "Click to upload or drag & drop"}
                                        </p>
                                        <p className="text-xs text-muted-foreground border-b border-transparent">
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
                            <div className="relative flex items-center px-4">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">OR</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>

                            {/* Self Description */}
                            <Card className="border-white/10 bg-card/40 backdrop-blur-xl flex-1">
                                <CardContent className="p-6 h-full flex flex-col">
                                    <label className="text-sm font-medium text-white mb-2 ml-1">Quick Self-Description</label>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        className="flex-1 w-full min-h-[120px] resize-none rounded-xl border border-white/10 bg-background/50 p-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary transition-all placeholder:text-muted-foreground/50"
                                        placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 glass border-t border-white/10 z-30 transform-gpu bg-background/80 flex items-center justify-between shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground px-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            AI-Powered Strategy Generation (~30s)
                        </div>
                        <Button
                            size="lg"
                            className="w-full md:w-auto h-12 px-8 text-base glow-magenta ml-auto"
                            onClick={handleGenerateReport}
                            disabled={!jobDescription || (!selfDescription && !fileName)}
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Interview Strategy
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
