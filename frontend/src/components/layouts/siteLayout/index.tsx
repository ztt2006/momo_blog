import { Outlet } from "react-router"

import SiteFooter from "@/features/site/components/siteFooter"
import SiteHeader from "@/features/site/components/siteHeader"
import styles from "@/components/layouts/siteLayout/index.module.css"

export default function SiteLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.background} />
      <div className={styles.inner}>
        <SiteHeader />
        <main className={styles.content}>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
