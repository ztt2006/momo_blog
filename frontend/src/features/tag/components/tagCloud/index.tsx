import TagChip from "@/features/tag/components/tagChip"
import styles from "@/features/tag/components/tagCloud/index.module.css"
import type { PublicTagItem } from "@/features/tag/types"

interface TagCloudProps {
  items: PublicTagItem[]
}

export default function TagCloud({ items }: TagCloudProps) {
  return (
    <div className={styles.cloud}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <TagChip name={item.name} slug={item.slug} color={item.color} />
          <span className={styles.count}>{item.articleCount}</span>
        </div>
      ))}
    </div>
  )
}
