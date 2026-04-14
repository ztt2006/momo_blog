import type { ClipboardEvent, ComponentPropsWithRef } from "react"
import { useId, useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import styles from "@/components/shared/markdownEditor/index.module.css"

interface MarkdownEditorProps extends Omit<ComponentPropsWithRef<"textarea">, "onPaste"> {
  label: string
  description?: string
  error?: string
  onPaste?: (event: ClipboardEvent<HTMLTextAreaElement>) => void
  onImagePaste?: (file: File) => Promise<string> | string
}

function buildNextValue(currentValue: string, selectionStart: number, selectionEnd: number, snippet: string) {
  const before = currentValue.slice(0, selectionStart)
  const after = currentValue.slice(selectionEnd)
  const needsLeadingBreak = before.length > 0 && !before.endsWith("\n") ? "\n" : ""
  const needsTrailingBreak = after.length > 0 && !after.startsWith("\n") ? "\n" : ""
  const nextValue = `${before}${needsLeadingBreak}${snippet}${needsTrailingBreak}${after}`
  const caretPosition = (before + needsLeadingBreak + snippet).length

  return { nextValue, caretPosition }
}

function syncTextareaValue(textarea: HTMLTextAreaElement, nextValue: string) {
  const prototype = Object.getPrototypeOf(textarea) as HTMLTextAreaElement
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set

  if (valueSetter) {
    valueSetter.call(textarea, nextValue)
  } else {
    textarea.value = nextValue
  }

  textarea.dispatchEvent(new Event("input", { bubbles: true }))
}

export default function MarkdownEditor({
  label,
  description,
  error,
  id,
  onChange,
  onPaste,
  onImagePaste,
  ...props
}: MarkdownEditorProps) {
  const generatedId = useId()
  const textareaId = id ?? `markdown-editor-${generatedId}`
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    onPaste?.(event)

    if (event.defaultPrevented || !onImagePaste) {
      return
    }

    const imageItem = Array.from(event.clipboardData?.items ?? []).find(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    )
    const file = imageItem?.getAsFile()

    if (!file) {
      return
    }

    const textarea = event.currentTarget
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    const currentValue = textarea.value

    event.preventDefault()
    setUploadError(null)
    setUploading(true)

    try {
      const snippet = await onImagePaste(file)
      const { nextValue, caretPosition } = buildNextValue(
        currentValue,
        selectionStart,
        selectionEnd,
        snippet
      )
      syncTextareaValue(textarea, nextValue)

      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(caretPosition, caretPosition)
      })
    } catch (pasteError) {
      setUploadError(pasteError instanceof Error ? pasteError.message : "图片上传失败，请稍后重试")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <Textarea id={textareaId} className={styles.editor} onChange={onChange} onPaste={handlePaste} {...props} />
      {uploading ? <p className={styles.helper}>正在上传粘贴的图片...</p> : null}
      {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}
