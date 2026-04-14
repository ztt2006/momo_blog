import { Navigate, Outlet } from "react-router"

import { APP_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

export default function SuperadminGuard() {
  const user = useAuthStore((state) => state.user)

  if (user?.role !== "superadmin") {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}
