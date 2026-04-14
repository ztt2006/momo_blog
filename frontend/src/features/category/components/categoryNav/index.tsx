import type { PublicCategoryItem } from "@/features/category/types"
import styles from "@/features/category/components/categoryNav/index.module.css"

interface CategoryNavProps {
  items: PublicCategoryItem[]
}

export default function CategoryNav({ items }: CategoryNavProps) {
  return (
    <nav className={styles.nav} aria-label="分类导航">
      {items.map((item) => (
        <a key={item.id} className={styles.link} href={`#${item.slug}`}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.count}>{item.articleCount}</span>
        </a>
      ))}
    </nav>
  )
}
