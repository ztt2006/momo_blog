import { Link, NavLink } from "react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import styles from "@/features/site/components/siteHeader/index.module.css"
import { resolveAssetUrl } from "@/lib/assetUrl"
import { PUBLIC_ROUTES } from "@/lib/constants"
import { usePublicAuthStore } from "@/stores/publicAuthStore"
import { useSiteStore } from "@/stores/siteStore"

const navItems = [
  { label: "首页", to: "/" },
  { label: "分类", to: "/categories" },
  { label: "标签", to: "/tags" },
  { label: "归档", to: "/archive" },
  { label: "关于", to: "/about" },
]

export default function SiteHeader() {
  const siteName = useSiteStore((state) => state.siteSetting.siteName)
  const siteSubtitle = useSiteStore((state) => state.siteSetting.siteSubtitle)
  const user = usePublicAuthStore((state) => state.user)
  const clearSession = usePublicAuthStore((state) => state.clearSession)
  const brandMark = siteName.trim().charAt(0).toUpperCase() || "M"
  const displayName = user?.nickname || user?.username || ""
  const avatarUrl = resolveAssetUrl(user?.avatar)

  return (
    <header className={styles.header}>
      <Link className={styles.brand} to="/">
        <span className={styles.mark}>{brandMark}</span>
        <span className={styles.copy}>
          <strong className={styles.title}>{siteName}</strong>
          <span className={styles.subtitle}>{siteSubtitle || "Personal notes"}</span>
        </span>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.authBox}>
        {user ? (
          <>
            <Link className={styles.userLink} to={PUBLIC_ROUTES.profile}>
              <Avatar className={styles.avatar} size="sm">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                <AvatarFallback>{displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className={styles.userName}>{displayName}</span>
            </Link>
            <Button asChild className={styles.cta} variant="ghost">
              <Link to={PUBLIC_ROUTES.profile}>个人资料</Link>
            </Button>
            <Button className={styles.cta} variant="outline" type="button" onClick={clearSession}>
              退出登录
            </Button>
          </>
        ) : (
          <>
            <Button asChild className={styles.cta} variant="ghost">
              <Link to={PUBLIC_ROUTES.login}>登录</Link>
            </Button>
            <Button asChild className={styles.cta} variant="outline">
              <Link to={PUBLIC_ROUTES.register}>注册</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
