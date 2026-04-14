import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getProfileFormDefaultValues,
  profileFormSchema,
  type ProfileFormValues,
} from "@/features/profile/schemas"
import type { ProfileUser } from "@/features/profile/types"
import styles from "@/features/profile/components/profileForm/index.module.css"
import { resolveAssetUrl } from "@/lib/assetUrl"

interface ProfileFormProps {
  user: ProfileUser
  submitting?: boolean
  statusMessage?: string | null
  errorMessage?: string | null
  onSubmit: (values: ProfileFormValues) => Promise<void> | void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("")
}

export default function ProfileForm({
  user,
  submitting = false,
  statusMessage,
  errorMessage,
  onSubmit,
}: ProfileFormProps) {
  const avatarUrl = resolveAssetUrl(user.avatar)
  const displayName = user.nickname || user.username
  const defaultValues = useMemo(() => getProfileFormDefaultValues(user), [user])
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  const avatarFile = watch("avatarFile")

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>修改个人资料</CardTitle>
        <CardDescription className={styles.cardDescription}>
          邮箱、昵称、头像和个人简介都会跟着你的账号一起保存。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values)
          })}
        >
          <div className={styles.hero}>
            <Avatar className={styles.avatar} size="lg">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className={styles.heroCopy}>
              <strong className={styles.displayName}>{displayName}</strong>
              <span className={styles.meta}>@{user.username}</span>
              <span className={styles.meta}>{user.role}</span>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <Label htmlFor="frontend-profile-email">邮箱</Label>
              <Input id="frontend-profile-email" className={styles.input} {...register("email")} />
              {errors.email ? <p className={styles.error}>{errors.email.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="frontend-profile-nickname">昵称</Label>
              <Input
                id="frontend-profile-nickname"
                className={styles.input}
                placeholder="例如：Momo"
                {...register("nickname")}
              />
              {errors.nickname ? <p className={styles.error}>{errors.nickname.message}</p> : null}
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="frontend-profile-bio">简介</Label>
            <Textarea
              id="frontend-profile-bio"
              className={styles.textarea}
              placeholder="写一点你想保存在账号里的介绍"
              {...register("bio")}
            />
            {errors.bio ? <p className={styles.error}>{errors.bio.message}</p> : null}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <Label htmlFor="frontend-profile-password">新密码</Label>
              <Input
                id="frontend-profile-password"
                className={styles.input}
                type="password"
                placeholder="留空表示不修改"
                {...register("password")}
              />
              {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="frontend-profile-avatar">头像上传</Label>
              <Input
                id="frontend-profile-avatar"
                className={styles.fileInput}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null
                  setValue("avatarFile", nextFile, { shouldDirty: true })
                }}
              />
              <p className={styles.helper}>{avatarFile ? `待上传：${avatarFile.name}` : "支持常见图片格式，提交后会立即替换头像"}</p>
            </div>
          </div>

          {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}
          {errorMessage ? <p className={styles.errorBanner}>{errorMessage}</p> : null}

          <div className={styles.actions}>
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "保存资料"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
