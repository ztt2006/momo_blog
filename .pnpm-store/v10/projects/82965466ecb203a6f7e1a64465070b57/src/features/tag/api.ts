import { apiClient } from "@/api/client"
import type { Tag, TagSubmitPayload } from "@/features/tag/types"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendTag {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeTag(tag: BackendTag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    color: tag.color,
  }
}

function toBackendPayload(payload: TagSubmitPayload) {
  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    color: payload.color,
  }
}

export async function getTags(): Promise<PaginationResponse<Tag>> {
  const { data } = await apiClient.get<BackendPagination<BackendTag>>("/admin/tags")

  return {
    total: data.total,
    items: data.items.map(normalizeTag),
  }
}

export async function createTag(payload: TagSubmitPayload): Promise<Tag> {
  const { data } = await apiClient.post<BackendTag>("/admin/tags", toBackendPayload(payload))
  return normalizeTag(data)
}

export async function updateTag(tagId: number, payload: TagSubmitPayload): Promise<Tag> {
  const { data } = await apiClient.put<BackendTag>(`/admin/tags/${tagId}`, toBackendPayload(payload))
  return normalizeTag(data)
}


export async function deleteTag(tagId: number): Promise<void> {
  await apiClient.delete(`/admin/tags/${tagId}`)
}
