import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleLogin({ email, password })
            navigate('/dashboard')
        } catch (error) {
            alert(error?.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pt-24 px-4 items-center">
            {/* Simple centered logo/title */}
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                    <span className="font-bold text-white text-lg">AI</span>
                </div>
                <span className="font-semibold text-lg tracking-tight text-foreground">InterviewPlatform</span>
            </div>

            <Card className="w-full max-w-[400px] border-border bg-card shadow-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-foreground">Sign in</CardTitle>
                    <CardDescription>Enter your email below to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
                                <Link className="text-xs text-primary hover:underline" to="#">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-2">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                        <p className="text-sm text-center text-muted-foreground w-full">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Login