import { Link } from "react-router"

import styles from "@/features/category/components/categoryBadge/index.module.css"
import { PUBLIC_ROUTES } from "@/lib/constants"

interface CategoryBadgeProps {
  name: string
  slug: string
}

export default function CategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link className={styles.badge} to={`${PUBLIC_ROUTES.categories}#${slug}`}>
      {name}
    </Link>
  )
}
