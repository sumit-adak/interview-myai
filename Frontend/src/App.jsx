import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ToastProvider } from "./components/ui/toast.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
