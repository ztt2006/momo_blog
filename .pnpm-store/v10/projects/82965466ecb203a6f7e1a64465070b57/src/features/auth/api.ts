import { AxiosError } from "axios"

import { apiClient } from "@/api/client"
import type { AuthRole, AuthUser, LoginPayload, LoginResponse } from "@/features/auth/types"
import type { ApiErrorResponse } from "@/types/apiTypes"

interface BackendAuthUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: AuthRole
  is_active: boolean
}

interface BackendLoginResponse {
  access_token: string
  token_type: string
  user: BackendAuthUser
}

function normalizeUser(user: BackendAuthUser): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
    isActive: user.is_active,
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<BackendLoginResponse>("/auth/login", payload)

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      user: normalizeUser(data.user),
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    throw new Error(axiosError.response?.data?.detail ?? "登录失败，请检查用户名和密码")
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<BackendAuthUser>("/auth/me")
  return normalizeUser(data)
}
