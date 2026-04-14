import type { ComponentPropsWithoutRef, ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import rehypePrism from "rehype-prism-plus"

import { slugifyHeading } from "@/lib/markdown"
import styles from "@/components/shared/markdownRenderer/index.module.css"

function flattenChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(flattenChildren).join("")
  }

  if (children && typeof children === "object" && "props" in children) {
    return flattenChildren((children as { props?: { children?: ReactNode } }).props?.children)
  }

  return ""
}

function Heading({
  as: Tag,
  id,
  children,
  ...props
}: ComponentPropsWithoutRef<"h1"> & { as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; id: string }) {
  return (
    <Tag id={id} {...props}>
      {children}
    </Tag>
  )
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const slugCounts: Record<string, number> = {}

  function resolveHeadingId(children: ReactNode): string {
    const text = flattenChildren(children)
    const baseId = slugifyHeading(text)
    const currentCount = slugCounts[baseId] ?? 0
    slugCounts[baseId] = currentCount + 1
    return currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`
  }

  return (
    <div className={styles.wrapper}>
      <article className="markdown-body">
        <ReactMarkdown
          rehypePlugins={[rehypePrism]}
          components={{
            h1: ({ children, node: _node, ...props }) => (
              <Heading as="h1" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
            h2: ({ children, node: _node, ...props }) => (
              <Heading as="h2" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
            h3: ({ children, node: _node, ...props }) => (
              <Heading as="h3" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
            h4: ({ children, node: _node, ...props }) => (
              <Heading as="h4" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
            h5: ({ children, node: _node, ...props }) => (
              <Heading as="h5" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
            h6: ({ children, node: _node, ...props }) => (
              <Heading as="h6" id={resolveHeadingId(children)} {...props}>
                {children}
              </Heading>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
