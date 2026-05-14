import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router";
import Protected from "./features/auth/components/Protected";
import { Skeleton } from "./components/ui/skeleton";

const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const Home = lazy(() => import("./features/interview/pages/Home"));
const Dashboard = lazy(() => import("./features/interview/pages/Dashboard"));
const Interview = lazy(() => import("./features/interview/pages/Interview"));

const PageLoader = () => (
    <main className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-80 w-full" />
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
        path: "/login",
        element: withSuspense(<Login />)
    },
    {
        path: "/register",
        element: withSuspense(<Register />)
    },
    {
        path: "/",
        element: withSuspense(<Home />)
    },
    {
        path: "/dashboard",
        element: <Protected>{withSuspense(<Dashboard />)}</Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected>{withSuspense(<Interview />)}</Protected>
    }
]);
