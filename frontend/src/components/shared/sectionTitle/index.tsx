import type { ReactNode } from "react"

import styles from "@/components/shared/sectionTitle/index.module.css"

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export default function SectionTitle({ eyebrow, title, description, action }: SectionTitleProps) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.copy}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  )
}
