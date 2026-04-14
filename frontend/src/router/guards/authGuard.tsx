import { Navigate, Outlet, useLocation } from "react-router"

import Loading from "@/components/shared/loading"
import { PUBLIC_ROUTES } from "@/lib/constants"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

export default function AuthGuard() {
  const location = useLocation()
  const token = usePublicAuthStore((state) => state.token)
  const isHydrated = usePublicAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return <Loading text="正在校验登录状态..." />
  }

  if (!token) {
    return <Navigate to={PUBLIC_ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
