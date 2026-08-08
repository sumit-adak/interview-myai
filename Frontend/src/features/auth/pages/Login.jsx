import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Navbar } from '../../../components/layout/Navbar'
import { Button } from '../../../components/ui/button'
import { useToast } from '../../../components/ui/toast'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Loader2, Sparkles, AlertCircle, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await handleLogin({ email, password })
            showToast({ title: 'Signed In', description: 'Welcome back to your workspace.' })
            navigate('/dashboard')
        } catch (err) {
            setError(err?.message || 'Login failed. Please check your credentials.')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Hero Panel (Desktop) */}
                    <section className="hidden lg:block space-y-6">
                        <div className="glass-panel rounded-3xl p-10 space-y-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-cyan-500 text-white shadow-lg shadow-primary/25">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                                Welcome back to your <span className="gradient-text">Interview Command Center</span>
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Access saved evaluations, generate role strategy reports, and download ATS resumes tailored for top engineering & management roles.
                            </p>

                            <div className="space-y-3 pt-4 border-t border-border/60">
                                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    Instant precision match scoring & skill gap analysis
                                </div>
                                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    STAR framework technical & behavioral response guides
                                </div>
                                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    Recruiter-friendly PDF & HTML resume exporter
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Card Form */}
                    <Card className="glass-panel border-border/80 w-full shadow-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                            <CardDescription className="text-xs">
                                Enter your credentials to access your interview workspace
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground" htmlFor="email">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-10 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-10 rounded-xl pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            title={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3 pt-2">
                                <Button className="w-full h-10 shadow-lg shadow-primary/25" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In
                                </Button>
                                <p className="text-center text-xs text-muted-foreground">
                                    Don't have an account yet?{' '}
                                    <Link to="/register" className="font-bold text-primary hover:underline">
                                        Create an account
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default Login
