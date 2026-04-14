export type PublicAuthRole = "superadmin" | "admin" | "user"

export interface PublicAuthUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  bio: string | null
  role: PublicAuthRole
  isActive: boolean
}

export interface PublicAuthSession {
  token: string
  user: PublicAuthUser
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  nickname: string | null
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: PublicAuthUser
}
