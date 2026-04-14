import { LogOut } from "lucide-react"
import { useNavigate } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import styles from "@/features/auth/components/userMenu/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("")
}

export default function UserMenu() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  if (!user) {
    return null
  }

  const displayName = user.nickname || user.username

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={styles.trigger} type="button">
          <Avatar className={styles.avatar}>
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className={styles.meta}>
            <strong className={styles.name}>{displayName}</strong>
            <span className={styles.role}>{user.role}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.menu}>
        <DropdownMenuItem
          onClick={() => {
            clearSession()
            navigate(APP_ROUTES.login, { replace: true })
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
