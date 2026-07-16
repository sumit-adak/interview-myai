import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { BrainCircuit, FileText, Target, ArrowRight, ShieldCheck, Sparkles, Gauge, ChartNoAxesCombined } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'

const features = [
    {
        icon: BrainCircuit,
        title: 'Role-Aware Evaluation',
        description: 'Deeply matches your profile against job requirements and reveals true readiness.'
    },
    {
        icon: FileText,
        title: 'ATS Resume Optimizer',
        description: 'Generates recruiter-friendly, ATS-compliant resumes with measurable bullet quality.'
    },
    {
        icon: Target,
        title: 'Interview Blueprint',
        description: 'Creates technical and behavioral preparation plans with daily execution tasks.'
    }
]

const highlights = [
    { icon: Gauge, text: 'Precision match scoring' },
    { icon: ChartNoAxesCombined, text: 'Gap-focused skill insights' },
    { icon: ShieldCheck, text: 'Secure auth + private reports' }
]

const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <div className="min-h-screen text-foreground">
            <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <button className="flex items-center gap-3" onClick={() => navigate('/')}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold leading-none">Interview AI</p>
                            <p className="text-xs text-muted-foreground">Professional Prep Suite</p>
                        </div>
                    </button>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => navigate('/login')}>Sign in</Button>
                                <Button onClick={() => navigate('/register')}>Create account</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-semibold text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Built for serious interview preparation
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                            Turn Every Job Application Into a
                            <span className="block text-primary">Focused Interview Strategy</span>
                        </h1>
                        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Upload your profile, map to any role, and get a professional report with targeted questions,
                            actionable gaps, and an ATS-friendly resume you can use immediately.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            size="lg"
                            onClick={() => navigate(user ? '/dashboard' : '/register')}
                        >
                            {user ? 'Start evaluation' : 'Get started free'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate(user ? '/dashboard' : '/login')}
                        >
                            {user ? 'View reports' : 'Sign in'}
                        </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {highlights.map((item, idx) => (
                            <div key={idx} className="glass-panel rounded-xl px-3 py-3 text-sm text-muted-foreground">
                                <item.icon className="mb-1 h-4 w-4 text-primary" />
                                {item.text}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4">
                    {features.map((feature) => (
                        <Card key={feature.title} className="overflow-hidden border-border/70">
                            <CardHeader className="pb-3">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                                    <feature.icon className="h-5 w-5 text-accent-foreground" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 text-xs text-muted-foreground">
                                Professional output quality designed for recruiters and hiring panels.
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </main>
        </div>
    )
}

export default Home
