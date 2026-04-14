import { Navigate, Outlet, useLocation } from "react-router"

import Loading from "@/components/shared/loading"
import { APP_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

export default function AuthGuard() {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return <Loading text="正在校验登录状态..." />
  }

  if (!token) {
    return <Navigate to={APP_ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
