import { useEffect } from "react"
import { RouterProvider } from "react-router"
import { Toaster } from "sonner"

import { getCurrentUser } from "@/features/auth/api"
import { router } from "@/router/routes"
import { useAuthStore } from "@/stores/authStore"

function App() {
  const hydrate = useAuthStore((state) => state.hydrate)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isHydrated || !token || user) {
      return
    }

    getCurrentUser()
      .then((currentUser) => {
        if (currentUser.role === "user") {
          clearSession()
          return
        }

        setSession({
          token,
          user: currentUser,
        })
      })
      .catch(() => {
        clearSession()
      })
  }, [clearSession, isHydrated, setSession, token, user])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
