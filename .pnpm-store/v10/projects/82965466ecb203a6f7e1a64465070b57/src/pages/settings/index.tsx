import { useEffect, useState } from "react"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import SeoSettingsForm from "@/features/settings/components/seoSettingsForm"
import SiteSettingsForm from "@/features/settings/components/siteSettingsForm"
import { getSiteSetting, updateSiteSetting } from "@/features/settings/api"
import {
  createSiteSettingSubmitPayload,
  getSiteSettingFormDefaultValues,
  type SeoSettingsFormValues,
  type SiteBasicsFormValues,
} from "@/features/settings/schemas"
import type { SiteSetting } from "@/features/settings/types"
import styles from "@/pages/settings/index.module.css"

export default function SettingsPage() {
  const [setting, setSetting] = useState<SiteSetting | null>(null)
  const [loading, setLoading] = useState(true)
  const [siteSubmitting, setSiteSubmitting] = useState(false)
  const [seoSubmitting, setSeoSubmitting] = useState(false)

  useEffect(() => {
    getSiteSetting()
      .then((response) => {
        setSetting(response)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取站点设置失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function saveSetting(
    values: Partial<SiteBasicsFormValues & SeoSettingsFormValues>,
    successMessage: string
  ) {
    if (!setting) {
      return
    }

    const payload = createSiteSettingSubmitPayload({
      ...getSiteSettingFormDefaultValues(setting),
      ...values,
    })

    const updatedSetting = await updateSiteSetting(payload)
    setSetting(updatedSetting)
    toast.success(successMessage)
  }

  if (loading) {
    return <Loading text="正在加载站点设置..." />
  }

  if (!setting) {
    return (
      <section className={styles.page}>
        <PageHeader
          eyebrow="Site Settings"
          title="站点设置"
          description="暂时还没有拿到站点配置，请稍后刷新重试。"
        />
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Site Settings"
        title="站点设置"
        description="把博客的名称、关于页和默认 SEO 配置统一收口，前台会直接读取这里的内容。"
      />

      <div className={styles.grid}>
        <SiteSettingsForm
          setting={setting}
          submitting={siteSubmitting}
          onSubmit={async (values) => {
            try {
              setSiteSubmitting(true)
              await saveSetting(values, "站点信息已保存")
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "保存站点信息失败")
            } finally {
              setSiteSubmitting(false)
            }
          }}
        />

        <SeoSettingsForm
          setting={setting}
          submitting={seoSubmitting}
          onSubmit={async (values) => {
            try {
              setSeoSubmitting(true)
              await saveSetting(values, "SEO 设置已保存")
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "保存 SEO 设置失败")
            } finally {
              setSeoSubmitting(false)
            }
          }}
        />
      </div>
    </section>
  )
}
