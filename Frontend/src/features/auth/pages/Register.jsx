import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Loader2, Sparkles, AlertCircle } from 'lucide-react'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await handleRegister({ username, email, password })
            navigate('/dashboard')
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="hidden lg:block">
                    <div className="glass-panel rounded-3xl p-10">
                        <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h1 className="text-4xl font-bold leading-tight">Build your interview advantage from day one</h1>
                        <p className="mt-4 max-w-md text-muted-foreground">
                            Create your workspace to generate professional reports, identify gaps, and craft recruiter-ready resumes.
                        </p>
                    </div>
                </section>

                <Card className="w-full border-border/70 bg-card/95">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create account</CardTitle>
                        <CardDescription>Set up your profile in under a minute</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="username">Full name</label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="John Doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Already registered?{' '}
                                <Link to="/login" className="font-semibold text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default Register
