import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import styles from "@/components/shared/emptyState/index.module.css"
import { PUBLIC_ROUTES } from "@/lib/constants"

interface EmptyStateProps {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className={styles.wrapper}>
      <span className={styles.eyebrow}>A quiet corner</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Button asChild variant="outline" className={styles.button}>
        <Link to={PUBLIC_ROUTES.home}>回到首页</Link>
      </Button>
    </section>
  )
}
