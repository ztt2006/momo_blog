import styles from "@/features/article/components/articleToc/index.module.css"
import type { ArticleTocItem } from "@/features/article/types"

export default function ArticleToc({ items }: { items: ArticleTocItem[] }) {
  if (!items.length) {
    return null
  }

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>On this page</p>
      <h2 className={styles.title}>目录</h2>
      <nav className={styles.nav} aria-label="文章目录">
        {items.map((item) => (
          <a
            key={`${item.id}-${item.level}`}
            className={styles.link}
            data-level={item.level}
            href={`#${item.id}`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </section>
  )
}
