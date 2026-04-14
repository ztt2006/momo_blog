import { z } from "zod"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const commentFormSchema = z.object({
  authorName: z.string().trim().min(1, "请输入你的名字").max(100, "名字长度不能超过 100 个字符"),
  authorEmail: z
    .string()
    .trim()
    .max(255, "邮箱长度不能超过 255 个字符")
    .refine((value) => !value || emailPattern.test(value), "请输入有效的邮箱地址"),
  content: z.string().trim().min(3, "内容至少需要 3 个字符").max(2000, "内容不能超过 2000 个字符"),
})

export type CommentFormValues = z.infer<typeof commentFormSchema>
