import { Button } from "@/components/ui/button"
import styles from "@/features/home/components/heroSection/index.module.css"
import { useSiteStore } from "@/stores/siteStore"

export default function HeroSection() {
  const siteName = useSiteStore((state) => state.siteSetting.siteName)
  const siteDescription = useSiteStore((state) => state.siteSetting.siteDescription)
  const siteSubtitle = useSiteStore((state) => state.siteSetting.siteSubtitle)

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Warm personal notes</span>
        <h1 className={styles.title}>{siteName}</h1>
        <p className={styles.description}>{siteDescription || "把零散经验整理成可以长期回看的文字。"}</p>
      </div>

      <div className={styles.side}>
        <p className={styles.note}>{siteSubtitle || "这里不追热点，也不赶着证明什么。只是把项目、阅读、思考和生活里的片段慢慢写下来。"}</p>
        <Button asChild className={styles.button} variant="outline" size="lg">
          <a href="#latest">开始阅读</a>
        </Button>
      </div>
    </section>
  )
}
