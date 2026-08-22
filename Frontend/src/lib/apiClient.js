import axios from "axios"

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
    timeout: 120000
})

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            const pathname = typeof window !== "undefined" ? window.location.pathname : ""
            const isAuthPage = pathname === "/login" || pathname === "/register"
            if (!isAuthPage && typeof window !== "undefined") {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    const details = error?.response?.data?.details
    if (Array.isArray(details) && details[0]?.message) {
        return details[0].message
    }
    return error?.response?.data?.message || error?.message || fallback
}
