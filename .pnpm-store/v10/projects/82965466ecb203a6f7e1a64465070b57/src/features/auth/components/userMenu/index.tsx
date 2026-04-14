import { LogOut, UserRound } from "lucide-react"
import { useNavigate } from "react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import styles from "@/features/auth/components/userMenu/index.module.css"
import { resolveAssetUrl } from "@/lib/assetUrl"
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
  const avatarUrl = resolveAssetUrl(user.avatar)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={styles.trigger} type="button">
          <Avatar className={styles.avatar}>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className={styles.meta}>
            <strong className={styles.name}>{displayName}</strong>
            <span className={styles.role}>{user.role}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.menu}>
        <DropdownMenuItem onClick={() => navigate(APP_ROUTES.profile)}>
          <UserRound />
          个人资料
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
