import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";
import { getApiErrorMessage } from "../../../lib/apiClient";

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) setUser(data.user)
            return data
        } catch (err) {
            throw new Error(getApiErrorMessage(err, "Login failed. Please check credentials."))
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) setUser(data.user)
            return data
        } catch (err) {
            throw new Error(getApiErrorMessage(err, "Registration failed. Please try again."))
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
        } catch {
            // proceed with local cleanup even if API call fails
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout, logout: handleLogout }
}
