import styles from "@/components/shared/loading/index.module.css"

export default function Loading({ text = "加载中..." }: { text?: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  )
}
