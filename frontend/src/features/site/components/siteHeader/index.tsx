import { Link, NavLink } from "react-router"

import { Button } from "@/components/ui/button"
import styles from "@/features/site/components/siteHeader/index.module.css"
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
  const brandMark = siteName.trim().charAt(0).toUpperCase() || "M"

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

      <Button asChild className={styles.cta} variant="outline">
        <a href="http://localhost:5174/login" target="_blank" rel="noreferrer">
          进入后台
        </a>
      </Button>
    </header>
  )
}
