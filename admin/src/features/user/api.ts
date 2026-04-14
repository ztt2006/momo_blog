import { apiClient } from "@/api/client"
import type { ManagedUser, UserCreatePayload, UserUpdatePayload } from "@/features/user/types"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendUser {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: "superadmin" | "admin" | "user"
  is_active: boolean
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeUser(user: BackendUser): ManagedUser {
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

export async function getUsers(): Promise<PaginationResponse<ManagedUser>> {
  const { data } = await apiClient.get<BackendPagination<BackendUser>>("/admin/users")

  return {
    total: data.total,
    items: data.items.map(normalizeUser),
  }
}

export async function createUser(payload: UserCreatePayload): Promise<ManagedUser> {
  const { data } = await apiClient.post<BackendUser>("/admin/users", {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    nickname: payload.nickname,
    role: payload.role,
    is_active: payload.isActive,
  })

  return normalizeUser(data)
}

export async function updateUser(userId: number, payload: UserUpdatePayload): Promise<ManagedUser> {
  const { data } = await apiClient.put<BackendUser>(`/admin/users/${userId}`, {
    email: payload.email,
    nickname: payload.nickname,
    role: payload.role,
    is_active: payload.isActive,
    password: payload.password,
  })

  return normalizeUser(data)
}

export async function deleteUser(userId: number): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`)
}
