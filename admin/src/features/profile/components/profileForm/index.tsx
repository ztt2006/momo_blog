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

export default function ProfileForm({ user, submitting = false, onSubmit }: ProfileFormProps) {
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
        <CardTitle className={styles.cardTitle}>个人资料</CardTitle>
        <CardDescription className={styles.cardDescription}>
          修改你的展示信息、联系邮箱和头像，这些内容会同步到后台顶部菜单。
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
              <span className={styles.meta}>{user.username}</span>
              <span className={styles.meta}>{user.role}</span>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <Label htmlFor="profile-email">邮箱</Label>
              <Input id="profile-email" className={styles.input} {...register("email")} />
              {errors.email ? <p className={styles.error}>{errors.email.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="profile-nickname">昵称</Label>
              <Input id="profile-nickname" className={styles.input} placeholder="可选显示名" {...register("nickname")} />
              {errors.nickname ? <p className={styles.error}>{errors.nickname.message}</p> : null}
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="profile-bio">简介</Label>
            <Textarea id="profile-bio" className={styles.textarea} placeholder="一句简短的自我介绍" {...register("bio")} />
            {errors.bio ? <p className={styles.error}>{errors.bio.message}</p> : null}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <Label htmlFor="profile-password">新密码</Label>
              <Input
                id="profile-password"
                className={styles.input}
                type="password"
                placeholder="留空则不修改"
                {...register("password")}
              />
              {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="profile-avatar">头像上传</Label>
              <Input
                id="profile-avatar"
                className={styles.fileInput}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null
                  setValue("avatarFile", nextFile, { shouldDirty: true })
                }}
              />
              <p className={styles.helper}>{avatarFile ? `待上传：${avatarFile.name}` : "支持 png、jpg、webp 等常见图片格式"}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "保存个人资料"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
