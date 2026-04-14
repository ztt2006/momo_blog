import ReactMarkdown from "react-markdown"
import rehypePrism from "rehype-prism-plus"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { resolveAssetUrl } from "@/lib/assetUrl"
import styles from "@/features/article/components/articlePreviewPanel/index.module.css"

interface ArticlePreviewPanelProps {
  title: string
  summary?: string
  contentMd: string
}

export default function ArticlePreviewPanel({
  title,
  summary,
  contentMd,
}: ArticlePreviewPanelProps) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>实时预览</CardTitle>
        <CardDescription className={styles.description}>
          预览当前 Markdown 内容的排版效果。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        <ScrollArea className={styles.scrollArea}>
          <article className="markdown-body">
            <h1>{title || "文章标题预览"}</h1>
            {summary ? <p>{summary}</p> : null}
            <ReactMarkdown
              rehypePlugins={[rehypePrism]}
              components={{
                img: ({ node: _node, src, alt, ...props }) => {
                  const normalizedSrc = resolveAssetUrl(src)

                  if (!normalizedSrc) {
                    return null
                  }

                  return (
                    <img
                      {...props}
                      className={styles.image}
                      src={normalizedSrc}
                      alt={alt ?? ""}
                      loading="lazy"
                    />
                  )
                },
              }}
            >
              {contentMd || "开始输入正文..."}
            </ReactMarkdown>
          </article>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
