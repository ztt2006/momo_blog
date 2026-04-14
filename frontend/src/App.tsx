import { useEffect } from "react"
import { RouterProvider } from "react-router"

import { getCurrentUser } from "@/features/auth/api"
import { router } from "@/router/routes"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

function App() {
  const hydrate = usePublicAuthStore((state) => state.hydrate)
  const token = usePublicAuthStore((state) => state.token)
  const user = usePublicAuthStore((state) => state.user)
  const setSession = usePublicAuthStore((state) => state.setSession)
  const clearSession = usePublicAuthStore((state) => state.clearSession)
  const isHydrated = usePublicAuthStore((state) => state.isHydrated)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isHydrated || !token || user) {
      return
    }

    getCurrentUser()
      .then((currentUser) => {
        setSession({
          token,
          user: currentUser,
        })
      })
      .catch(() => {
        clearSession()
      })
  }, [clearSession, isHydrated, setSession, token, user])

  return <RouterProvider router={router} />
}

export default App
