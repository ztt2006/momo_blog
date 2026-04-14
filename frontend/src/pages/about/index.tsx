import Loading from "@/components/shared/loading"
import MarkdownRenderer from "@/components/shared/markdownRenderer"
import SectionTitle from "@/components/shared/sectionTitle"
import GuestbookSection from "@/features/comment/components/guestbookSection"
import SocialLinks from "@/features/site/components/socialLinks"
import { applyDocumentSeo, buildPageTitle } from "@/lib/seo"
import styles from "@/pages/about/index.module.css"
import { useSiteStore } from "@/stores/siteStore"
import { useEffect } from "react"

export default function AboutPage() {
  const siteSetting = useSiteStore((state) => state.siteSetting)
  const hasLoaded = useSiteStore((state) => state.hasLoaded)

  useEffect(() => {
    if (!hasLoaded) {
      return
    }

    applyDocumentSeo({
      title: buildPageTitle("关于", siteSetting.siteName),
      description: siteSetting.siteDescription ?? undefined,
      keywords: siteSetting.siteKeywords ?? undefined,
    })
  }, [hasLoaded, siteSetting.siteDescription, siteSetting.siteKeywords, siteSetting.siteName])

  if (!hasLoaded) {
    return <Loading text="正在打开关于页..." />
  }

  const aboutMarkdown =
    siteSetting.aboutMarkdown?.trim() ||
    "## 关于这个博客\n\n这里还没有写下正式的自我介绍，但会慢慢补上。"

  return (
    <section className={styles.page}>
      <SectionTitle
        eyebrow="About"
        title="关于"
        description={siteSetting.siteSubtitle || "这里更像一页研究手记，而不是正式简历。"}
      />

      <div className={styles.layout}>
        <div className={styles.markdownCard}>
          <MarkdownRenderer content={aboutMarkdown} />
        </div>

        <aside className={styles.aside}>
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>站点简介</h3>
            <p className={styles.panelText}>
              {siteSetting.siteDescription || "记录技术、项目和长期可回看的个人笔记。"}
            </p>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>联系与链接</h3>
            <SocialLinks githubUrl={siteSetting.githubUrl} publicEmail={siteSetting.publicEmail} />
          </section>

          {siteSetting.icp ? (
            <section className={styles.panel}>
              <h3 className={styles.panelTitle}>备案信息</h3>
              <p className={styles.panelText}>{siteSetting.icp}</p>
            </section>
          ) : null}
        </aside>
      </div>

      <GuestbookSection />
    </section>
  )
}
