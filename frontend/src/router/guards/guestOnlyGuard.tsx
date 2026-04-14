import { Navigate, Outlet } from "react-router"

import { PUBLIC_ROUTES } from "@/lib/constants"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

export default function GuestOnlyGuard() {
  const token = usePublicAuthStore((state) => state.token)
  const isHydrated = usePublicAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return null
  }

  if (token) {
    return <Navigate to={PUBLIC_ROUTES.home} replace />
  }

  return <Outlet />
}
