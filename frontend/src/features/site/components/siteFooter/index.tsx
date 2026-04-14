import styles from "@/features/site/components/siteFooter/index.module.css"
import { SITE_INFO } from "@/lib/constants"

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.title}>{SITE_INFO.title}</p>
      <p className={styles.text}>
        {SITE_INFO.subtitle}
      </p>
      <p className={styles.text}>用文字把阶段性的经验留给未来的自己。</p>
    </footer>
  )
}
