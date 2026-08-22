import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("user")
                return saved ? JSON.parse(saved) : null
            } catch {
                return null
            }
        }
        return null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const fetchUser = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
            try {
                const data = await getMe()
                if (!cancelled && data?.user) {
                    setUser(data.user)
                    if (typeof window !== "undefined") {
                        localStorage.setItem("user", JSON.stringify(data.user))
                    }
                }
            } catch {
                if (!cancelled) {
                    if (!token) {
                        setUser(null)
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("user")
                        }
                    }
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchUser()

        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user) {
                try {
                    localStorage.setItem("user", JSON.stringify(user))
                } catch {
                    // localStorage unavailable
                }
            } else {
                localStorage.removeItem("user")
            }
        }
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

