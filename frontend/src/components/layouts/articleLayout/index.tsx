import { Outlet } from "react-router"

import styles from "@/components/layouts/articleLayout/index.module.css"

export default function ArticleLayout() {
  return (
    <section className={styles.layout}>
      <Outlet />
    </section>
  )
}
