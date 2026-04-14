import type { AuthRole, AuthUser } from "@/features/auth/types"

export interface ProfileUser extends AuthUser {
  role: AuthRole
}

export interface ProfileUpdatePayload {
  email: string
  nickname: string | null
  bio: string | null
  password: string | null
}
