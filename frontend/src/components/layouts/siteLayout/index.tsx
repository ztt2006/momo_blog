import { useEffect } from "react"
import { Outlet, useLocation } from "react-router"

import SiteFooter from "@/features/site/components/siteFooter"
import SiteHeader from "@/features/site/components/siteHeader"
import styles from "@/components/layouts/siteLayout/index.module.css"
import { applyDocumentSeo } from "@/lib/seo"
import { useSiteStore } from "@/stores/siteStore"

export default function SiteLayout() {
  const location = useLocation()
  const siteSetting = useSiteStore((state) => state.siteSetting)
  const hasLoaded = useSiteStore((state) => state.hasLoaded)
  const isLoading = useSiteStore((state) => state.isLoading)
  const loadSiteSetting = useSiteStore((state) => state.loadSiteSetting)

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void loadSiteSetting()
    }
  }, [hasLoaded, isLoading, loadSiteSetting])

  useEffect(() => {
    if (!hasLoaded) {
      return
    }

    applyDocumentSeo({
      title: siteSetting.siteName,
      description: siteSetting.siteDescription ?? undefined,
      keywords: siteSetting.siteKeywords ?? undefined,
    })
  }, [
    hasLoaded,
    location.pathname,
    siteSetting.siteDescription,
    siteSetting.siteKeywords,
    siteSetting.siteName,
  ])

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
