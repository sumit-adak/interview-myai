import React from 'react'
import { useNavigate } from 'react-router'
import { Navbar } from '../../../components/layout/Navbar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import {
    BrainCircuit,
    FileText,
    Target,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Gauge,
    ChartNoAxesCombined,
    CheckCircle2,
    Zap,
    ChevronRight,
    Award
} from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'

const features = [
    {
        icon: BrainCircuit,
        title: 'Role-Aware AI Evaluation',
        description: 'Matches your experience directly against job descriptions, identifying key skill alignments and hidden gaps.'
    },
    {
        icon: FileText,
        title: 'ATS-Optimized Resume Export',
        description: 'Generates recruiter-friendly, ATS-compliant HTML/PDF resumes with high-impact quantifiable bullet points.'
    },
    {
        icon: Target,
        title: 'Structured Interview Roadmap',
        description: 'Creates targeted technical & behavioral question lists with STAR framework answers and day-by-day prep tasks.'
    }
]

const highlights = [
    { icon: Gauge, text: 'Instant Precision Match Scoring' },
    { icon: ChartNoAxesCombined, text: 'Actionable Skill Gap Insights' },
    { icon: ShieldCheck, text: 'Secure Session & Private Reports' }
]

const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            {/* Top Navigation Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
                    <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        {/* Left Hero Text */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                                AI-Powered Career Preparation Engine
                            </div>

                            <div className="space-y-5">
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12]">
                                    Turn Every Application Into a{' '}
                                    <span className="gradient-text">Winning Strategy</span>
                                </h1>
                                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                                    Upload your resume or profile summary, paste any target job description, and receive a comprehensive
                                    interview preparation blueprint with real technical questions, gap analysis, and ATS-ready resumes.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Button
                                    size="lg"
                                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                                    className="h-12 px-7 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                                >
                                    {user ? 'Go to Workspace' : 'Start Free Evaluation'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate(user ? '/dashboard' : '/login')}
                                    className="h-12 px-6 text-base border-border/80"
                                >
                                    {user ? 'View Reports' : 'Sign in to Account'}
                                </Button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 pt-4 border-t border-border/60">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className="glass-panel rounded-2xl p-3.5 text-xs font-medium text-foreground flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Hero Preview Card */}
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/30 via-cyan-500/20 to-purple-500/20 blur-xl opacity-70" />
                            <Card className="relative overflow-hidden border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl">
                                <div className="border-b border-border/60 bg-muted/40 px-5 py-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                        <span className="ml-2 text-xs font-semibold text-muted-foreground">Evaluation Live Mockup</span>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                                    </span>
                                </div>

                                <CardContent className="p-6 space-y-5">
                                    {/* Mock Score Header */}
                                    <div className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4 border border-border/60">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Role Alignment</p>
                                            <p className="text-lg font-bold text-foreground">Senior Full Stack Engineer</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-extrabold text-primary">92%</span>
                                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Strong Match</p>
                                        </div>
                                    </div>

                                    {/* Mock Features Breakdown */}
                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-border/70 bg-card p-3 flex items-start gap-3">
                                            <Zap className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">Top Technical Prompt</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">"How do you optimize state re-renders in large React applications?"</p>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-border/70 bg-card p-3 flex items-start gap-3">
                                            <Award className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">ATS Resume Status</p>
                                                <p className="text-xs text-muted-foreground">Formatted with metric bullet points ready for PDF export</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full justify-between bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-all"
                                        onClick={() => navigate(user ? '/dashboard' : '/register')}
                                    >
                                        <span className="text-xs font-semibold">Generate Your Strategy Report</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t border-border/60 bg-muted/20 py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Built for Serious Candidates
                            </h2>
                            <p className="text-base text-muted-foreground">
                                Everything you need to evaluate your fit, practice key interview questions, and project confidence.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {features.map((feature) => (
                                <Card key={feature.title} className="glass-card-hover overflow-hidden rounded-3xl p-2">
                                    <CardHeader className="pb-3">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        <CardDescription className="text-sm leading-relaxed mt-2">{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="inline-flex items-center text-xs font-semibold text-primary">
                                            Role tailored analysis <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom Call To Action Banner */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                    <div className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center space-y-6">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            Ready to Ace Your Next Interview?
                        </h2>
                        <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
                            Create your target role evaluation now and get a customized preparation strategy in under 30 seconds.
                        </p>
                        <div className="pt-2">
                            <Button
                                size="lg"
                                onClick={() => navigate(user ? '/dashboard' : '/register')}
                                className="h-12 px-8 text-base shadow-xl shadow-primary/25"
                            >
                                {user ? 'Open Workspace' : 'Get Started Now'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home
