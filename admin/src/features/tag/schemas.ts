import { z } from "zod"

import type { Tag, TagSubmitPayload } from "@/features/tag/types"

export const tagFormSchema = z.object({
  name: z.string().trim().min(1, "请输入标签名称").max(100, "标签名称过长"),
  slug: z
    .string()
    .trim()
    .min(1, "请输入标签链接")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 仅支持小写字母、数字和中横线"),
  description: z.string().trim().max(300, "描述不超过 300 字").optional(),
  color: z
    .string()
    .trim()
    .max(20, "颜色值过长")
    .refine((value) => !value || /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value), {
      message: "请输入合法的十六进制颜色，例如 #2563eb",
    })
    .optional(),
})

export type TagFormValues = z.infer<typeof tagFormSchema>

function emptyToNull(value?: string): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function getTagFormDefaultValues(tag?: Tag): TagFormValues {
  return {
    name: tag?.name ?? "",
    slug: tag?.slug ?? "",
    description: tag?.description ?? "",
    color: tag?.color ?? "",
  }
}

export function createTagSubmitPayload(values: TagFormValues): TagSubmitPayload {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: emptyToNull(values.description),
    color: emptyToNull(values.color),
  }
}
