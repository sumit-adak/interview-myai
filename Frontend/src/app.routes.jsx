import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

const Home = lazy(() => import("./features/interview/pages/Home"));
const Dashboard = lazy(() => import("./features/interview/pages/Dashboard"));
const InterviewSetup = lazy(() => import("./features/interview/pages/InterviewSetup"));
const History = lazy(() => import("./features/interview/pages/History"));
const Analytics = lazy(() => import("./features/interview/pages/Analytics"));
const ResumeAnalyzer = lazy(() => import("./features/interview/pages/ResumeAnalyzer"));

const PageLoader = () => (
    <main className="min-h-screen flex items-center justify-center bg-[#0b1326] text-[#dae2fd]">
        <div className="glass-panel rounded-2xl px-6 py-4 flex items-center gap-3 border border-[#334155]">
            <span className="h-4 w-4 rounded-full border-2 border-[#b8c8e0] border-t-transparent animate-spin"></span>
            <span className="font-['JetBrains_Mono'] text-sm text-[#c4c6cd]">Loading Interview AI...</span>
        </div>
    </main>
)

const withSuspense = (element) => (
    <Suspense fallback={<PageLoader />}>
        {element}
    </Suspense>
)

export const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<Home />)
    },
    {
        path: "/dashboard",
        element: withSuspense(<Dashboard />)
    },
    {
        path: "/history",
        element: withSuspense(<History />)
    },
    {
        path: "/interview/history",
        element: withSuspense(<History />)
    },
    {
        path: "/analytics",
        element: withSuspense(<Analytics />)
    },
    {
        path: "/interview/analytics",
        element: withSuspense(<Analytics />)
    },
    {
        path: "/resume",
        element: withSuspense(<ResumeAnalyzer />)
    },
    {
        path: "/interview/resume",
        element: withSuspense(<ResumeAnalyzer />)
    },
    {
        path: "/interview/setup",
        element: withSuspense(<InterviewSetup />)
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);
