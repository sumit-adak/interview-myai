import axios from "axios"

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
    timeout: 120000
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        }
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
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
