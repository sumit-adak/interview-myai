import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { BrainCircuit, FileText, Target, ArrowRight } from 'lucide-react'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background">
            {/* Standard Navigation Bar */}
            <nav className="border-b border-border bg-background">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                            <span className="font-bold text-white text-lg">AI</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-foreground">InterviewPlatform</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
                        <Button onClick={() => navigate('/register')}>Get Started</Button>
                    </div>
                </div>
            </nav>

            {/* Clean Hero Section */}
            <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                    Analyze Your Resume & Improve Your Interview Chances
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    A professional-grade tool to match your profile against real job descriptions. Identify missing skills and generate a targeted roadmap to ace your next technical or behavioral interview.
                </p>
                <Button size="lg" className="h-12 px-8 text-base font-medium rounded-md" onClick={() => navigate('/dashboard')}>
                    Start Free Evaluation
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </main>

            {/* Flat Feature Cards */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mb-2">
                                <BrainCircuit className="w-5 h-5 text-foreground" />
                            </div>
                            <CardTitle>AI Matching Engine</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Understand exactly how well your profile aligns with actual required qualifications.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mb-2">
                                <FileText className="w-5 h-5 text-foreground" />
                            </div>
                            <CardTitle>Contextual Parse</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Extract your core experiences and identify potential red flags instantly before hiring managers do.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mb-2">
                                <Target className="w-5 h-5 text-foreground" />
                            </div>
                            <CardTitle>Targeted Roadmap</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Receive a structured step-by-step action plan, practice questions, and behavioral guides based on identified gaps.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default Home