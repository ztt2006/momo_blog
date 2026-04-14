import type { TextareaHTMLAttributes } from "react"

import { Textarea } from "@/components/ui/textarea"
import styles from "@/components/shared/markdownEditor/index.module.css"

interface MarkdownEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  description?: string
  error?: string
}

export default function MarkdownEditor({
  label,
  description,
  error,
  ...props
}: MarkdownEditorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <Textarea className={styles.editor} {...props} />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}
