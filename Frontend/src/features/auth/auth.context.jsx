import { createContext,useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user")
            try {
                return stored ? JSON.parse(stored) : null
            } catch {
                localStorage.removeItem("user")
                return null
            }
        }
        return null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch {
                // no-op
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            setLoading(false)
        } else {
            getAndSetUser()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user))
            } else {
                localStorage.removeItem("user")
            }
        }
    }, [user])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

}
