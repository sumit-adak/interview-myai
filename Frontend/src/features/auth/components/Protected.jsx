import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="glass-panel rounded-2xl px-6 py-5 text-sm font-medium text-muted-foreground">
                    Checking your session...
                </div>
            </main>
        )
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected
