import SocialLinks from "@/features/site/components/socialLinks"
import styles from "@/features/site/components/siteFooter/index.module.css"
import { useSiteStore } from "@/stores/siteStore"

export default function SiteFooter() {
  const siteSetting = useSiteStore((state) => state.siteSetting)

  return (
    <footer className={styles.footer}>
      <p className={styles.title}>{siteSetting.siteName}</p>
      <p className={styles.text}>{siteSetting.siteSubtitle || "用文字把阶段性的经验留给未来的自己。"}</p>
      <p className={styles.text}>{siteSetting.siteDescription || "长期整理技术笔记、项目复盘和当下思考。"}</p>
      <SocialLinks githubUrl={siteSetting.githubUrl} publicEmail={siteSetting.publicEmail} />
      {siteSetting.icp ? <p className={styles.text}>{siteSetting.icp}</p> : null}
    </footer>
  )
}
