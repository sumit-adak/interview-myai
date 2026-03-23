import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Loader2 } from 'lucide-react'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleRegister({ username, email, password })
            navigate('/dashboard')
        } catch (error) {
            alert(error?.response?.data?.message || "Registration failed")
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
                    <CardTitle className="text-xl font-semibold text-foreground">Create an account</CardTitle>
                    <CardDescription>Enter your details below to get started</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground" htmlFor="username">Full Name</label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="John Doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground" htmlFor="email">Work Email</label>
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
                            <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
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
                            Create Account
                        </Button>
                        <p className="text-sm text-center text-muted-foreground w-full">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Register