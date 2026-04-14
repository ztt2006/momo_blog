import { Outlet } from "react-router"

import styles from "@/components/layouts/authLayout/index.module.css"

export default function AuthLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.grid} />
      <div className={styles.panel}>
        <div className={styles.brandBlock}>
          <span className={styles.kicker}>MOMO BLOG</span>
          <h1 className={styles.title}>内容后台</h1>
          <p className={styles.description}>
            用更安静的界面进入写作状态，登录后就可以开始整理、编辑和发布你的文章。
          </p>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
