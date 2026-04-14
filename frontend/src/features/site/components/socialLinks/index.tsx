import styles from "@/features/site/components/socialLinks/index.module.css"

interface SocialLinksProps {
  githubUrl?: string | null
  publicEmail?: string | null
}

interface SocialLinkItem {
  href: string
  label: string
}

export default function SocialLinks({ githubUrl, publicEmail }: SocialLinksProps) {
  const items = [
    githubUrl
      ? {
          href: githubUrl,
          label: githubUrl,
        }
      : null,
    publicEmail
      ? {
          href: `mailto:${publicEmail}`,
          label: publicEmail,
        }
      : null,
  ].filter((item): item is SocialLinkItem => item !== null)

  if (!items.length) {
    return <p className={styles.empty}>暂未公开联系方式。</p>
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <a
          key={item.label}
          className={styles.link}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}
