export interface AuthUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: string
  isActive: boolean
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  user: AuthUser
}
