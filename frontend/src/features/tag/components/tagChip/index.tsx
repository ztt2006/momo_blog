import type { CSSProperties } from "react"
import { Link } from "react-router"

import styles from "@/features/tag/components/tagChip/index.module.css"
import { PUBLIC_ROUTES } from "@/lib/constants"
import { classNames } from "@/lib/classNames"

interface TagChipProps {
  name: string
  slug: string
  color?: string | null
}

export default function TagChip({ name, slug, color }: TagChipProps) {
  return (
    <Link
      className={classNames(styles.chip, color ? styles.chipTinted : "")}
      style={color ? ({ "--tag-color": color } as CSSProperties) : undefined}
      to={`${PUBLIC_ROUTES.tags}#${slug}`}
    >
      {name}
    </Link>
  )
}
