import { AxiosError } from "axios"

import { apiClient } from "@/api/client"
import type { PublicAuthRole } from "@/features/auth/types"
import type { ProfileUpdatePayload, ProfileUser } from "@/features/profile/types"

interface ApiErrorResponse {
  detail?: string
}

interface BackendProfileUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  bio: string | null
  role: PublicAuthRole
  is_active: boolean
}

function normalizeUser(user: BackendProfileUser): ProfileUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    isActive: user.is_active,
  }
}

function resolveErrorMessage(error: unknown, fallback: string): Error {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return new Error(axiosError.response?.data?.detail ?? fallback)
}

export async function getProfile(): Promise<ProfileUser> {
  const { data } = await apiClient.get<BackendProfileUser>("/auth/me")
  return normalizeUser(data)
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<ProfileUser> {
  try {
    const { data } = await apiClient.put<BackendProfileUser>("/auth/me", payload)
    return normalizeUser(data)
  } catch (error) {
    throw resolveErrorMessage(error, "更新资料失败")
  }
}

export async function uploadProfileAvatar(file: File): Promise<ProfileUser> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const { data } = await apiClient.post<BackendProfileUser>("/auth/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return normalizeUser(data)
  } catch (error) {
    throw resolveErrorMessage(error, "上传头像失败")
  }
}
