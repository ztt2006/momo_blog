import { useEffect, useState } from "react"

import Loading from "@/components/shared/loading"
import SectionTitle from "@/components/shared/sectionTitle"
import { getAboutProfile } from "@/features/about/api"
import AuthorProfile from "@/features/about/components/authorProfile"
import SkillList from "@/features/about/components/skillList"
import type { AboutProfile } from "@/features/about/types"
import styles from "@/pages/about/index.module.css"

export default function AboutPage() {
  const [profile, setProfile] = useState<AboutProfile | null>(null)

  useEffect(() => {
    getAboutProfile().then((response) => {
      setProfile(response)
    })
  }, [])

  if (!profile) {
    return <Loading text="正在打开关于页..." />
  }

  return (
    <section className={styles.page}>
      <SectionTitle
        eyebrow="About"
        title="关于我"
        description="这里更像一页研究手记，而不是正式简历。记录我现在在做什么，也记录我为什么想继续写下去。"
      />

      <AuthorProfile
        name={profile.name}
        intro={profile.intro}
        description={profile.description}
      />

      <div className={styles.grid}>
        <SkillList title="现在常用的工具" items={profile.skills} />
        <SkillList title="当前关注的事情" items={profile.now} />
      </div>
    </section>
  )
}
