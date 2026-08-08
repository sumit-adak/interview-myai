import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/button'
import {
    Sparkles,
    Sun,
    Moon,
    LogOut,
    UserCheck,
    Menu,
    X,
    LayoutDashboard,
    Home as HomeIcon,
    FileCheck2
} from 'lucide-react'

export const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const { resolvedTheme, toggleTheme } = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-cyan-500 text-white shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold leading-tight tracking-tight text-foreground flex items-center gap-1.5">
                            Interview AI
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                PRO
                            </span>
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Smart Role Strategist</span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                            isActive('/')
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                    >
                        <HomeIcon className="h-4 w-4" />
                        Home
                    </button>

                    {user && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                                isActive('/dashboard')
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Workspace
                        </button>
                    )}
                </nav>

                {/* Desktop Right Side Controls */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-secondary/50 text-foreground transition-all hover:bg-accent hover:scale-105 active:scale-95"
                        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 text-amber-400" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-slate-700" />
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3 pl-2 border-l border-border/60">
                            <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/80 px-3 py-1.5 shadow-sm">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold uppercase">
                                    {user?.username ? user.username[0] : 'C'}
                                </div>
                                <span className="text-xs font-semibold text-foreground max-w-[120px] truncate">
                                    {user?.username || 'Candidate'}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="h-4 w-4 mr-1.5" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                                Sign in
                            </Button>
                            <Button size="sm" onClick={() => navigate('/register')} className="shadow-md shadow-primary/20">
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-secondary/50 text-foreground"
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 text-amber-400" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-slate-700" />
                        )}
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-secondary/50 text-foreground"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileOpen && (
                <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-3">
                    <nav className="space-y-1">
                        <button
                            onClick={() => { navigate('/'); setMobileOpen(false); }}
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
                                isActive('/') ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                            }`}
                        >
                            <HomeIcon className="h-4 w-4" />
                            Home
                        </button>

                        {user && (
                            <button
                                onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
                                    isActive('/dashboard') ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                                }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Workspace Dashboard
                            </button>
                        )}
                    </nav>

                    <div className="pt-2 border-t border-border/60">
                        {user ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 px-3 py-2 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary font-bold uppercase">
                                        {user?.username ? user.username[0] : 'C'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{user?.username}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-destructive hover:bg-destructive/10"
                                    onClick={() => { logout(); setMobileOpen(false); }}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Button variant="outline" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                                    Sign in
                                </Button>
                                <Button onClick={() => { navigate('/register'); setMobileOpen(false); }}>
                                    Register
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
