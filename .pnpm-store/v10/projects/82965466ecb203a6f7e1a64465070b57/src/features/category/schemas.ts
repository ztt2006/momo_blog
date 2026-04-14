import { z } from "zod"

import type { Category, CategorySubmitPayload } from "@/features/category/types"

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "请输入分类名称").max(100, "分类名称过长"),
  slug: z
    .string()
    .trim()
    .min(1, "请输入分类链接")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 仅支持小写字母、数字和中横线"),
  description: z.string().trim().max(500, "描述不超过 500 字").optional(),
  sortOrder: z.number().int("排序必须是整数"),
  isVisible: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

function emptyToNull(value?: string): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function getCategoryFormDefaultValues(category?: Category): CategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    sortOrder: category?.sortOrder ?? 0,
    isVisible: category?.isVisible ?? true,
  }
}

export function createCategorySubmitPayload(values: CategoryFormValues): CategorySubmitPayload {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: emptyToNull(values.description),
    sortOrder: values.sortOrder,
    isVisible: values.isVisible,
  }
}
