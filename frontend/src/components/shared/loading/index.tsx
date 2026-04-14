import styles from "@/components/shared/loading/index.module.css"

export default function Loading({ text = "正在翻开页面..." }: { text?: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dot} />
      <p className={styles.text}>{text}</p>
    </div>
  )
}
