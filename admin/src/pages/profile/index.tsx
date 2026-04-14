import { useEffect, useState } from "react"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import ProfileForm from "@/features/profile/components/profileForm"
import { getProfile, updateProfile, uploadProfileAvatar } from "@/features/profile/api"
import { createProfileUpdatePayload, type ProfileFormValues } from "@/features/profile/schemas"
import type { ProfileUser } from "@/features/profile/types"
import styles from "@/pages/profile/index.module.css"
import { useAuthStore } from "@/stores/authStore"

export default function ProfilePage() {
  const [user, setPageUser] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setPageUser(profile)
        setUser(profile)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取个人资料失败")
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
        <PageHeader
          eyebrow="Profile"
          title="个人资料"
          description="暂时无法读取当前账号信息，请稍后刷新后重试。"
        />
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Profile"
        title="个人资料"
        description="维护你在后台的展示身份和联系方式，头像与昵称会同步显示在右上角。"
      />

      <ProfileForm
        user={user}
        submitting={submitting}
        onSubmit={async (values: ProfileFormValues) => {
          try {
            setSubmitting(true)
            let nextUser = await updateProfile(createProfileUpdatePayload(values))

            if (values.avatarFile) {
              nextUser = await uploadProfileAvatar(values.avatarFile)
            }

            setPageUser(nextUser)
            setUser(nextUser)
            toast.success("个人资料已更新")
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "更新个人资料失败")
          } finally {
            setSubmitting(false)
          }
        }}
      />
    </section>
  )
}
