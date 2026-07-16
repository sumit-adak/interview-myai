import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const fetchUser = async () => {
            try {
                const data = await getMe()
                if (!cancelled && data?.user) {
                    setUser(data.user)
                }
            } catch {
                if (!cancelled) setUser(null)
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
