import { apiClient } from "@/api/client"
import type { MediaAsset } from "@/features/media/types"
import { resolveAssetUrl } from "@/lib/assetUrl"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendMediaAsset {
  id: number
  filename: string
  original_name: string
  mime_type: string
  file_size: number
  storage_type: string
  file_url: string | null
  width: number | null
  height: number | null
  uploaded_by: number | null
  created_at: string
  updated_at: string
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeMediaAsset(item: BackendMediaAsset): MediaAsset {
  return {
    id: item.id,
    filename: item.filename,
    originalName: item.original_name,
    mimeType: item.mime_type,
    fileSize: item.file_size,
    storageType: item.storage_type,
    fileUrl: resolveAssetUrl(item.file_url),
    width: item.width,
    height: item.height,
    uploadedBy: item.uploaded_by,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

export async function getMediaAssets(): Promise<PaginationResponse<MediaAsset>> {
  const { data } = await apiClient.get<BackendPagination<BackendMediaAsset>>("/admin/media")

  return {
    total: data.total,
    items: data.items.map(normalizeMediaAsset),
  }
}

export async function uploadMediaAsset(file: File): Promise<MediaAsset> {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await apiClient.post<BackendMediaAsset>("/admin/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return normalizeMediaAsset(data)
}


export async function deleteMediaAsset(mediaAssetId: number): Promise<void> {
  await apiClient.delete(`/admin/media/${mediaAssetId}`)
}
