import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { Button } from "./button"

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((items) => items.filter((item) => item.id !== id))
    }, [])

    const showToast = useCallback(({ title, description, variant = "success" }) => {
        const id = crypto.randomUUID()
        setToasts((items) => [...items, { id, title, description, variant }])
        window.setTimeout(() => removeToast(id), 4500)
    }, [removeToast])

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
                {toasts.map((toast) => {
                    const Icon = toast.variant === "error" ? AlertCircle : CheckCircle2
                    return (
                        <div
                            key={toast.id}
                            className="rounded-xl border border-border bg-card p-4 text-sm shadow-lg"
                            role="status"
                        >
                            <div className="flex gap-3">
                                <Icon className={toast.variant === "error" ? "mt-0.5 h-4 w-4 text-destructive" : "mt-0.5 h-4 w-4 text-primary"} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">{toast.title}</p>
                                    {toast.description && <p className="mt-1 text-muted-foreground">{toast.description}</p>}
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeToast(toast.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within ToastProvider")
    }
    return context
}
