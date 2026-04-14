import { apiClient } from "@/api/client"
import type { Category, CategorySubmitPayload } from "@/features/category/types"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendCategory {
  id: number
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_visible: boolean
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeCategory(category: BackendCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sort_order,
    isVisible: category.is_visible,
  }
}

function toBackendPayload(payload: CategorySubmitPayload) {
  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    sort_order: payload.sortOrder,
    is_visible: payload.isVisible,
  }
}

export async function getCategories(): Promise<PaginationResponse<Category>> {
  const { data } = await apiClient.get<BackendPagination<BackendCategory>>("/admin/categories")

  return {
    total: data.total,
    items: data.items.map(normalizeCategory),
  }
}

export async function createCategory(payload: CategorySubmitPayload): Promise<Category> {
  const { data } = await apiClient.post<BackendCategory>("/admin/categories", toBackendPayload(payload))
  return normalizeCategory(data)
}

export async function updateCategory(categoryId: number, payload: CategorySubmitPayload): Promise<Category> {
  const { data } = await apiClient.put<BackendCategory>(
    `/admin/categories/${categoryId}`,
    toBackendPayload(payload)
  )

  return normalizeCategory(data)
}
