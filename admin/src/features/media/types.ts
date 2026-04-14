export interface MediaAsset {
  id: number
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  storageType: string
  fileUrl: string | null
  width: number | null
  height: number | null
  uploadedBy: number | null
  createdAt: string
  updatedAt: string
}
