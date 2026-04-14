import type { AuthRole } from "@/features/auth/types"

export interface ManagedUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: AuthRole
  isActive: boolean
}

export interface UserCreatePayload {
  username: string
  email: string
  password: string
  nickname: string | null
  role: "admin" | "user"
  isActive: boolean
}

export interface UserUpdatePayload {
  email: string
  nickname: string | null
  role: "admin" | "user"
  isActive: boolean
  password: string | null
}
