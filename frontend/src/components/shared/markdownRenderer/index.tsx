import ReactMarkdown from "react-markdown"
import rehypePrism from "rehype-prism-plus"

import styles from "@/components/shared/markdownRenderer/index.module.css"

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className={styles.wrapper}>
      <article className="markdown-body">
        <ReactMarkdown rehypePlugins={[rehypePrism]}>{content}</ReactMarkdown>
      </article>
    </div>
  )
}
