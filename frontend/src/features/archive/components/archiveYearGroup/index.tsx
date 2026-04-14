import { Link } from "react-router"

import ArticleMeta from "@/features/article/components/articleMeta"
import type { ArchiveYearGroup } from "@/features/archive/types"
import styles from "@/features/archive/components/archiveYearGroup/index.module.css"

export default function ArchiveYearGroupBlock({ group }: { group: ArchiveYearGroup }) {
  return (
    <section className={styles.group}>
      <div className={styles.yearColumn}>
        <h3 className={styles.year}>{group.year}</h3>
      </div>

      <div className={styles.entries}>
        {group.entries.map((entry) => (
          <article className={styles.entry} key={entry.id}>
            <Link className={styles.title} to={`/articles/${entry.slug}`}>
              {entry.title}
            </Link>
            <p className={styles.summary}>
              {entry.summary || "这篇文章没有摘要，但它仍然值得在归档中被重新翻到。"}
            </p>
            <ArticleMeta
              publishedAt={entry.publishedAt}
              readingTime={entry.readingTime}
              wordCount={entry.wordCount}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
