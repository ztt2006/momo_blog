import { Navigate, Outlet } from "react-router"

import Loading from "@/components/shared/loading"
import { APP_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

export default function GuestGuard() {
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return <Loading text="正在准备登录页..." />
  }

  if (token) {
    return <Navigate to={APP_ROUTES.articles} replace />
  }

  return <Outlet />
}
