import type { PublicAuthRole, PublicAuthUser } from "@/features/auth/types"

export interface ProfileUser extends PublicAuthUser {
  role: PublicAuthRole
}

export interface ProfileUpdatePayload {
  email: string
  nickname: string | null
  bio: string | null
  password: string | null
}
