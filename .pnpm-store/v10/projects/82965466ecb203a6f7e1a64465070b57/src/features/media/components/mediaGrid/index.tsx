import styles from "@/features/media/components/mediaGrid/index.module.css"
import { classNames } from "@/lib/classNames"
import type { MediaAsset } from "@/features/media/types"

interface MediaGridProps {
  items: MediaAsset[]
  selectedId: number | null
  onSelect: (mediaAssetId: number) => void
}

export default function MediaGrid({ items, selectedId, onSelect }: MediaGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <button
          key={item.id}
          className={classNames(styles.card, selectedId === item.id ? styles.cardActive : "")}
          type="button"
          onClick={() => onSelect(item.id)}
        >
          {item.fileUrl ? (
            <img className={styles.image} src={item.fileUrl} alt={item.originalName} />
          ) : (
            <div className={styles.placeholder}>No preview</div>
          )}
          <div className={styles.meta}>
            <span className={styles.name}>{item.originalName}</span>
            <span className={styles.size}>{Math.max(1, Math.round(item.fileSize / 1024))} KB</span>
          </div>
        </button>
      ))}
    </div>
  )
}
