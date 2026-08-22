import { createContext, useState, useEffect } from "react";

export const InterviewContext = createContext()

const DEFAULT_SETUP = {
    role: "Software Engineer",
    experience: "Intermediate",
    interviewType: "Technical",
    difficulty: 75,
    duration: 45,
    focusAreas: ["Algorithms", "Data Structures", "Problem Solving"]
}

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const [setupConfig, setSetupConfig] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("interview_ai_setup")
                return saved ? { ...DEFAULT_SETUP, ...JSON.parse(saved) } : DEFAULT_SETUP
            } catch {
                return DEFAULT_SETUP
            }
        }
        return DEFAULT_SETUP
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("interview_ai_setup", JSON.stringify(setupConfig))
            } catch {
                // storage unavailable
            }
        }
    }, [setupConfig])

    const updateSetup = (fields) => {
        setSetupConfig((prev) => ({ ...prev, ...fields }))
    }

    return (
        <InterviewContext.Provider value={{
            loading, setLoading,
            report, setReport,
            reports, setReports,
            setupConfig, setSetupConfig, updateSetup
        }}>
            {children}
        </InterviewContext.Provider>
    )
}