import { Button } from "@/components/ui/button"
import styles from "@/features/home/components/heroSection/index.module.css"
import { SITE_INFO } from "@/lib/constants"

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Warm personal notes</span>
        <h1 className={styles.title}>{SITE_INFO.title}</h1>
        <p className={styles.description}>{SITE_INFO.description}</p>
      </div>

      <div className={styles.side}>
        <p className={styles.note}>
          这里不追热点，也不赶着证明什么。只是把项目、阅读、思考和生活里的片段慢慢写下来。
        </p>
        <Button asChild className={styles.button} variant="outline" size="lg">
          <a href="#latest">开始阅读</a>
        </Button>
      </div>
    </section>
  )
}
