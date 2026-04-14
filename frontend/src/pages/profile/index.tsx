import { useEffect, useState } from "react"

import Loading from "@/components/shared/loading"
import ProfileForm from "@/features/profile/components/profileForm"
import { getProfile, updateProfile, uploadProfileAvatar } from "@/features/profile/api"
import { createProfileUpdatePayload, type ProfileFormValues } from "@/features/profile/schemas"
import type { ProfileUser } from "@/features/profile/types"
import styles from "@/pages/profile/index.module.css"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

export default function ProfilePage() {
  const [user, setPageUser] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const setUser = usePublicAuthStore((state) => state.setUser)

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setPageUser(profile)
        setUser(profile)
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "获取个人资料失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setUser])

  if (loading) {
    return <Loading text="正在加载个人资料..." />
  }

  if (!user) {
    return (
      <section className={styles.page}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Reader Profile</span>
          <h1 className={styles.title}>个人资料</h1>
          <p className={styles.description}>暂时没有读取到当前账号信息，请刷新页面后重试。</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Reader Profile</span>
        <h1 className={styles.title}>个人资料</h1>
        <p className={styles.description}>
          把你的邮箱、昵称和头像整理好，后续评论系统和前台身份展示都会直接读取这里。
        </p>
      </div>

      <ProfileForm
        user={user}
        submitting={submitting}
        statusMessage={statusMessage}
        errorMessage={errorMessage}
        onSubmit={async (values: ProfileFormValues) => {
          try {
            setSubmitting(true)
            setStatusMessage(null)
            setErrorMessage(null)
            let nextUser = await updateProfile(createProfileUpdatePayload(values))

            if (values.avatarFile) {
              nextUser = await uploadProfileAvatar(values.avatarFile)
            }

            setPageUser(nextUser)
            setUser(nextUser)
            setStatusMessage("个人资料已更新，新的昵称和头像已经生效。")
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "更新个人资料失败")
          } finally {
            setSubmitting(false)
          }
        }}
      />
    </section>
  )
}
