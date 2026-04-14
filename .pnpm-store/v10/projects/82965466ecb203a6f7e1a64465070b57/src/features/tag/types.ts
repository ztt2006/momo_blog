export interface Tag {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
}

export interface TagSubmitPayload {
  name: string
  slug: string
  description: string | null
  color: string | null
}
