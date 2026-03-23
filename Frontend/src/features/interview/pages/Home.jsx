import React from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { BrainCircuit, FileText, Target, Sparkles, ArrowRight } from 'lucide-react'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full glass z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-magenta transition-transform group-hover:scale-110">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Interview<span className="text-primary">AI</span></span>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
                        <Button onClick={() => navigate('/register')}>Get Started</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background ambient glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-accent/10 rounded-full blur-[128px] -z-10 mix-blend-screen" />

                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 glass mb-8 text-sm text-muted-foreground"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary glow-magenta animate-pulse" />
                        AI-Powered Interview Intelligence
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50"
                    >
                        Create Your Custom <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#b946e6] to-secondary glow-magenta leading-relaxed block py-2">
                            Interview Plan
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Upload your resume and the target job description. Our advanced AI analyzes the gaps and creates a personalized roadmap to help you ace your next technical or behavioral interview.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full glow-magenta group" onClick={() => navigate('/dashboard')}>
                            Start Your Free Evaluation
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </main>

            {/* Feature Cards Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto relative">
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <Card className="h-full bg-card/60 backdrop-blur-xl border-white/5 hover:border-primary/50 transition-colors duration-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 glow-magenta">
                                    <BrainCircuit className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">AI Analysis</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Deep matching between your profile and the real job requirements using modern LLMs.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <Card className="h-full bg-card/60 backdrop-blur-xl border-white/5 hover:border-secondary/50 transition-colors duration-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 glow-purple">
                                    <FileText className="w-6 h-6 text-secondary" />
                                </div>
                                <CardTitle className="text-xl">Resume Parsing</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Smart extraction of your core skills, experiences, and potential red flags.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                        <Card className="h-full bg-card/60 backdrop-blur-xl border-white/5 hover:border-accent/50 transition-colors duration-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 glow-blue">
                                    <Target className="w-6 h-6 text-accent" />
                                </div>
                                <CardTitle className="text-xl">Smart Roadmap</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    A step-by-step action plan, custom behavioral answers, and technical mock questions.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Home