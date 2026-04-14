import { AxiosError } from "axios"

import { apiClient } from "@/api/client"
import type {
  AuthResponse,
  LoginPayload,
  PublicAuthRole,
  PublicAuthUser,
  RegisterPayload,
} from "@/features/auth/types"

interface BackendAuthUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: PublicAuthRole
  is_active: boolean
}

interface BackendAuthResponse {
  access_token: string
  token_type: string
  user: BackendAuthUser
}

interface ApiErrorResponse {
  detail?: string
}

function normalizeUser(user: BackendAuthUser): PublicAuthUser {
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

function normalizeAuthResponse(response: BackendAuthResponse): AuthResponse {
  return {
    accessToken: response.access_token,
    tokenType: response.token_type,
    user: normalizeUser(response.user),
  }
}

function resolveErrorMessage(error: unknown, fallback: string): Error {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return new Error(axiosError.response?.data?.detail ?? fallback)
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<BackendAuthResponse>("/auth/login", payload)
    return normalizeAuthResponse(data)
  } catch (error) {
    throw resolveErrorMessage(error, "登录失败，请检查用户名和密码")
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<BackendAuthResponse>("/auth/register", payload)
    return normalizeAuthResponse(data)
  } catch (error) {
    throw resolveErrorMessage(error, "注册失败，请稍后再试")
  }
}

export async function getCurrentUser(): Promise<PublicAuthUser> {
  const { data } = await apiClient.get<BackendAuthUser>("/auth/me")
  return normalizeUser(data)
}
