import { FileImage, FileText, FolderTree, LayoutDashboard, Menu, MessageSquareMore, Settings2, Tags } from "lucide-react"
import { NavLink, Outlet } from "react-router"

import UserMenu from "@/features/auth/components/userMenu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import styles from "@/components/layouts/adminLayout/index.module.css"
import { classNames } from "@/lib/classNames"
import { APP_ROUTES } from "@/lib/constants"

const navItems = [
  { label: "仪表盘", to: APP_ROUTES.dashboard, icon: LayoutDashboard },
  { label: "文章", to: APP_ROUTES.articles, icon: FileText },
  { label: "评论", to: APP_ROUTES.comments, icon: MessageSquareMore },
  { label: "分类", to: APP_ROUTES.categories, icon: FolderTree },
  { label: "标签", to: APP_ROUTES.tags, icon: Tags },
  { label: "媒体库", to: APP_ROUTES.media, icon: FileImage },
  { label: "设置", to: APP_ROUTES.settings, icon: Settings2 },
]

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={mobile ? styles.mobileNav : styles.nav}>
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(styles.navLink, isActive ? styles.navLinkActive : "")
            }
          >
            <Icon />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function AdminLayout() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          <div className={styles.brandCopy}>
            <strong className={styles.brandTitle}>Momo Blog</strong>
            <span className={styles.brandText}>Admin workspace</span>
          </div>
        </div>
        <Separator />
        <Navigation />
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <Sheet>
              <SheetTrigger asChild>
                <Button className={styles.menuButton} variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={styles.sheet}>
                <div className={styles.sheetInner}>
                  <div className={styles.brand}>
                    <span className={styles.brandMark}>M</span>
                    <div className={styles.brandCopy}>
                      <strong className={styles.brandTitle}>Momo Blog</strong>
                      <span className={styles.brandText}>Admin workspace</span>
                    </div>
                  </div>
                  <Separator />
                  <Navigation mobile />
                </div>
              </SheetContent>
            </Sheet>
            <div className={styles.topbarCopy}>
              <p className={styles.topbarTitle}>写作与发布</p>
              <p className={styles.topbarText}>保持编辑节奏，专注内容本身。</p>
            </div>
          </div>
          <UserMenu />
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
