import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ToastProvider } from "./components/ui/toast.jsx"

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
