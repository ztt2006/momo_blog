export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isVisible: boolean
}

export interface CategorySubmitPayload {
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isVisible: boolean
}
