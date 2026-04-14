import styles from "@/features/about/components/skillList/index.module.css"

interface SkillListProps {
  title: string
  items: string[]
}

export default function SkillList({ title, items }: SkillListProps) {
  return (
    <section className={styles.block}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
