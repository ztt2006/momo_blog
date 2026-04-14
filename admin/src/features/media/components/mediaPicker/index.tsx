import { Button } from "@/components/ui/button"
import MediaGrid from "@/features/media/components/mediaGrid"
import UploadPanel from "@/features/media/components/uploadPanel"
import styles from "@/features/media/components/mediaPicker/index.module.css"
import type { MediaAsset } from "@/features/media/types"

interface MediaPickerProps {
  items: MediaAsset[]
  selectedId: number | null
  uploading?: boolean
  onSelect: (mediaAssetId: number) => void
  onClear: () => void
  onUpload: (file: File) => Promise<void> | void
}

export default function MediaPicker({
  items,
  selectedId,
  uploading = false,
  onSelect,
  onClear,
  onUpload,
}: MediaPickerProps) {
  return (
    <div className={styles.wrapper}>
      <UploadPanel uploading={uploading} onFileSelect={onUpload} />
      {selectedId ? (
        <div className={styles.toolbar}>
          <span className={styles.selectedText}>已选择封面 #{selectedId}</span>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            移除封面
          </Button>
        </div>
      ) : null}
      {items.length ? (
        <MediaGrid items={items} selectedId={selectedId} onSelect={onSelect} />
      ) : (
        <p className={styles.empty}>还没有上传图片，先选一张封面吧。</p>
      )}
    </div>
  )
}
