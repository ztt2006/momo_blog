import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createUserSubmitPayload,
  createUserUpdatePayload,
  getUserCreateDefaults,
  getUserEditDefaults,
  type UserEditFormValues,
  type UserFormValues,
  userEditFormSchema,
  userFormSchema,
} from "@/features/user/schemas"
import styles from "@/features/user/components/userForm/index.module.css"
import type { ManagedUser, UserCreatePayload, UserUpdatePayload } from "@/features/user/types"

interface UserFormProps {
  mode: "create" | "edit"
  user?: ManagedUser
  submitting?: boolean
  onSubmit: (payload: UserCreatePayload | UserUpdatePayload) => Promise<void> | void
  onCancelEdit?: () => void
}

export default function UserForm({
  mode,
  user,
  submitting = false,
  onSubmit,
  onCancelEdit,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues | UserEditFormValues>({
    resolver: zodResolver(mode === "create" ? userFormSchema : userEditFormSchema),
    defaultValues: mode === "create" ? getUserCreateDefaults() : getUserEditDefaults(user),
  })

  useEffect(() => {
    reset(mode === "create" ? getUserCreateDefaults() : getUserEditDefaults(user))
  }, [mode, reset, user])

  const role = watch("role")
  const isActive = watch("isActive")

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>
          {mode === "create" ? "创建用户" : `编辑用户 · ${user?.username ?? ""}`}
        </CardTitle>
        <CardDescription className={styles.cardDescription}>
          这里统一管理后台编辑账号和前台普通用户，系统只保留一个最高权限账号。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (values) => {
            if (mode === "create") {
              await onSubmit(createUserSubmitPayload(values as UserFormValues))
              return
            }

            await onSubmit(createUserUpdatePayload(values as UserEditFormValues))
          })}
        >
          <div className={styles.field}>
            <Label htmlFor="user-username">用户名</Label>
            <Input
              id="user-username"
              className={styles.input}
              placeholder="例如：editor01"
              disabled={mode === "edit"}
              {...register("username")}
            />
            {errors.username ? <p className={styles.error}>{errors.username.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="user-email">邮箱</Label>
            <Input id="user-email" className={styles.input} placeholder="user@example.com" {...register("email")} />
            {errors.email ? <p className={styles.error}>{errors.email.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="user-password">密码</Label>
            <Input
              id="user-password"
              type="password"
              className={styles.input}
              placeholder={mode === "create" ? "设置登录密码" : "留空则不修改密码"}
              {...register("password")}
            />
            {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="user-nickname">昵称</Label>
            <Input id="user-nickname" className={styles.input} placeholder="对外显示名称" {...register("nickname")} />
            {errors.nickname ? <p className={styles.error}>{errors.nickname.message}</p> : null}
          </div>

          <div className={styles.segmentField}>
            <span className={styles.segmentLabel}>角色</span>
            <div className={styles.segmentGroup}>
              <Button
                type="button"
                variant={role === "admin" ? "default" : "outline"}
                onClick={() => setValue("role", "admin", { shouldValidate: true })}
              >
                设为管理员
              </Button>
              <Button
                type="button"
                variant={role === "user" ? "default" : "outline"}
                onClick={() => setValue("role", "user", { shouldValidate: true })}
              >
                设为普通用户
              </Button>
            </div>
          </div>

          <div className={styles.segmentField}>
            <span className={styles.segmentLabel}>状态</span>
            <div className={styles.segmentGroup}>
              <Button
                type="button"
                variant={isActive ? "default" : "outline"}
                onClick={() => setValue("isActive", true, { shouldValidate: true })}
              >
                启用用户
              </Button>
              <Button
                type="button"
                variant={!isActive ? "default" : "outline"}
                onClick={() => setValue("isActive", false, { shouldValidate: true })}
              >
                停用用户
              </Button>
            </div>
          </div>

          <div className={styles.actions}>
            {mode === "edit" ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                取消编辑
              </Button>
            ) : null}
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : mode === "create" ? "创建用户" : "保存修改"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
