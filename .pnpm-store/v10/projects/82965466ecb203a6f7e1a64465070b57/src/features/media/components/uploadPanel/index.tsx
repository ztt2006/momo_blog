import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "@/features/media/components/uploadPanel/index.module.css"

interface UploadPanelProps {
  uploading?: boolean
  onFileSelect: (file: File) => void | Promise<void>
}

export default function UploadPanel({ uploading = false, onFileSelect }: UploadPanelProps) {
  return (
    <label className={styles.panel}>
      <input
        aria-label="上传媒体文件"
        className={styles.input}
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            void onFileSelect(file)
            event.target.value = ""
          }
        }}
      />
      <div className={styles.copy}>
        <span className={styles.title}>上传媒体图片</span>
        <span className={styles.text}>支持常见图片格式，上传后会自动加入当前媒体库，可继续给文章复用。</span>
      </div>
      <Button className={styles.button} type="button" variant="outline" disabled={uploading}>
        <Upload />
        {uploading ? "上传中..." : "选择文件"}
      </Button>
    </label>
  )
}
