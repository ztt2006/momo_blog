import styles from "@/features/about/components/authorProfile/index.module.css"

interface AuthorProfileProps {
  name: string
  intro: string
  description: string
}

export default function AuthorProfile({ name, intro, description }: AuthorProfileProps) {
  return (
    <section className={styles.profile}>
      <div className={styles.identity}>
        <span className={styles.label}>Research note</span>
        <h2 className={styles.name}>{name}</h2>
      </div>
      <div className={styles.copy}>
        <p className={styles.intro}>{intro}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  )
}
