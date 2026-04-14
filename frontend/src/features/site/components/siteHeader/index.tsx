import { Link, NavLink } from "react-router"

import { Button } from "@/components/ui/button"
import styles from "@/features/site/components/siteHeader/index.module.css"
import { SITE_INFO } from "@/lib/constants"

const navItems = [
  { label: "首页", to: "/" },
  { label: "归档", to: "/archive" },
  { label: "关于", to: "/about" },
]

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} to="/">
        <span className={styles.mark}>M</span>
        <span className={styles.copy}>
          <strong className={styles.title}>{SITE_INFO.title}</strong>
          <span className={styles.subtitle}>Personal notes</span>
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
