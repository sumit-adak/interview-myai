import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'

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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-8 cursor-pointer relative z-10" onClick={() => navigate('/')}>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-magenta">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">
                    Interview<span className="text-primary">AI</span>
                </span>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-md relative z-10">
                <Card className="glass border-white/10 shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Create an account</CardTitle>
                        <CardDescription>Enter your details below to get started</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/90" htmlFor="username">Username</label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-background/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/90" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/90" htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background/40"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full h-12 glow-purple bg-secondary hover:bg-secondary/90 text-white" type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Sign Up
                            </Button>
                            <p className="text-sm text-center text-muted-foreground w-full">
                                Already have an account?{" "}
                                <Link to="/login" className="text-secondary hover:underline underline-offset-4 font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}

export default Register