import { useEffect, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/shared/confirmDialog"
import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import { Button } from "@/components/ui/button"
import { createUser, deleteUser, getUsers, updateUser } from "@/features/user/api"
import UserForm from "@/features/user/components/userForm"
import UserTable from "@/features/user/components/userTable"
import styles from "@/pages/users/index.module.css"
import type { ManagedUser, UserCreatePayload, UserUpdatePayload } from "@/features/user/types"

function sortUsers(items: ManagedUser[]) {
  const roleWeight = {
    superadmin: 0,
    admin: 1,
    user: 2,
  } as const

  return [...items].sort(
    (left, right) =>
      roleWeight[left.role] - roleWeight[right.role] ||
      left.username.localeCompare(right.username, "zh-Hans-CN")
  )
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [items, setItems] = useState<ManagedUser[]>([])
  const [editingUser, setEditingUser] = useState<ManagedUser>()
  const [userToDelete, setUserToDelete] = useState<ManagedUser>()

  useEffect(() => {
    getUsers()
      .then((response) => {
        setItems(sortUsers(response.items))
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取用户失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function handleSubmit(payload: UserCreatePayload | UserUpdatePayload) {
    try {
      setSubmitting(true)

      if (editingUser) {
        const updated = await updateUser(editingUser.id, payload as UserUpdatePayload)
        setItems((current) => sortUsers(current.map((item) => (item.id === updated.id ? updated : item))))
        setEditingUser(undefined)
        toast.success("用户信息已更新")
        return
      }

      const created = await createUser(payload as UserCreatePayload)
      setItems((current) => sortUsers([...current, created]))
      toast.success("用户已创建")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存用户失败")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) {
      return
    }

    try {
      setDeleting(true)
      await deleteUser(userToDelete.id)
      setItems((current) => current.filter((item) => item.id !== userToDelete.id))
      if (editingUser?.id === userToDelete.id) {
        setEditingUser(undefined)
      }
      setUserToDelete(undefined)
      toast.success("用户已删除")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除用户失败")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="User Control"
        title="用户管理"
        description="只有 `superadmin` 能看到这里，用来维护后台编辑和前台普通用户。"
        actions={
          editingUser ? (
            <Button variant="outline" onClick={() => setEditingUser(undefined)}>
              新建用户
            </Button>
          ) : null
        }
      />

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <UserForm
            mode={editingUser ? "edit" : "create"}
            user={editingUser}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingUser(undefined)}
          />
        </div>

        <div className={styles.listColumn}>
          {loading ? (
            <Loading text="正在加载用户列表..." />
          ) : (
            <UserTable
              items={items}
              onEdit={(user) => setEditingUser(user)}
              onDelete={(user) => setUserToDelete(user)}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="删除这个用户？"
        description={
          userToDelete
            ? `用户「${userToDelete.username}」会被移除，之后将无法继续登录。`
            : ""
        }
        loading={deleting}
        onConfirm={handleDeleteUser}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setUserToDelete(undefined)
          }
        }}
      />
    </section>
  )
}
