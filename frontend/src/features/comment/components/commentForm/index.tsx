import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { commentFormSchema, type CommentFormValues } from "@/features/comment/schemas"
import type { CommentPayload } from "@/features/comment/types"
import styles from "@/features/comment/components/commentForm/index.module.css"

interface CommentFormProps {
  authorLabel: string
  emailLabel: string
  contentLabel: string
  submitLabel: string
  contentPlaceholder: string
  submitting?: boolean
  successMessage?: string | null
  errorMessage?: string | null
  onSubmit: (payload: CommentPayload) => Promise<void> | void
}

export default function CommentForm({
  authorLabel,
  emailLabel,
  contentLabel,
  submitLabel,
  contentPlaceholder,
  submitting = false,
  successMessage,
  errorMessage,
  onSubmit,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
    },
  })

  async function submit(values: CommentFormValues) {
    await onSubmit({
      authorName: values.authorName.trim(),
      authorEmail: values.authorEmail.trim() || undefined,
      content: values.content.trim(),
    })
    reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>{authorLabel}</span>
          <input
            {...register("authorName")}
            aria-label={authorLabel}
            className={styles.input}
            placeholder="怎么称呼你"
          />
          {errors.authorName ? <span className={styles.error}>{errors.authorName.message}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{emailLabel}</span>
          <input
            {...register("authorEmail")}
            aria-label={emailLabel}
            className={styles.input}
            placeholder="方便联系时再填写"
          />
          {errors.authorEmail ? <span className={styles.error}>{errors.authorEmail.message}</span> : null}
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{contentLabel}</span>
        <textarea
          {...register("content")}
          aria-label={contentLabel}
          className={styles.textarea}
          placeholder={contentPlaceholder}
          rows={5}
        />
        {errors.content ? <span className={styles.error}>{errors.content.message}</span> : null}
      </label>

      {successMessage ? <p className={styles.success}>{successMessage}</p> : null}
      {errorMessage ? <p className={styles.errorBox}>{errorMessage}</p> : null}

      <Button type="submit" className={styles.submitButton} disabled={submitting}>
        {submitting ? "提交中..." : submitLabel}
      </Button>
    </form>
  )
}
