import React, { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme")
            if (saved && ["light", "dark", "system"].includes(saved)) {
                return saved
            }
        }
        return "system"
    })

    const [resolvedTheme, setResolvedTheme] = useState("light")

    useEffect(() => {
        const root = document.documentElement

        const applyTheme = (currentTheme) => {
            let active = currentTheme
            if (currentTheme === "system") {
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                active = systemPrefersDark ? "dark" : "light"
            }

            setResolvedTheme(active)

            if (active === "dark") {
                root.classList.add("dark")
            } else {
                root.classList.remove("dark")
            }
        }

        applyTheme(theme)
        localStorage.setItem("theme", theme)

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handleChange = () => applyTheme("system")
            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
