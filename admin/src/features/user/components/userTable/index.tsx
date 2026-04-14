import { PencilLine, ShieldCheck, Trash2 } from "lucide-react"

import EmptyState from "@/components/shared/emptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import styles from "@/features/user/components/userTable/index.module.css"
import type { ManagedUser } from "@/features/user/types"

interface UserTableProps {
  items: ManagedUser[]
  onEdit: (user: ManagedUser) => void
  onDelete: (user: ManagedUser) => void
}

function getRoleLabel(role: ManagedUser["role"]): string {
  if (role === "superadmin") {
    return "最高权限"
  }

  return role === "admin" ? "管理员" : "普通用户"
}

export default function UserTable({ items, onEdit, onDelete }: UserTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="还没有可管理的用户"
        description="先创建一个管理员或普通用户，之后就可以在这里统一维护。"
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className={styles.actionHead}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={styles.nameCell}>
                <div className={styles.nameGroup}>
                  <strong className={styles.username}>{item.username}</strong>
                  <span className={styles.email}>{item.email}</span>
                  {item.nickname ? <span className={styles.nickname}>{item.nickname}</span> : null}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={styles.roleBadge}>
                  {item.role === "superadmin" ? <ShieldCheck className={styles.roleIcon} /> : null}
                  {getRoleLabel(item.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={item.isActive ? styles.activeBadge : styles.inactiveBadge}>
                  {item.isActive ? "已启用" : "已停用"}
                </Badge>
              </TableCell>
              <TableCell className={styles.actionCell}>
                {item.role === "superadmin" ? (
                  <span className={styles.lockedText}>系统账号</span>
                ) : (
                  <div className={styles.actions}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)} aria-label={`编辑 ${item.username}`}>
                      <PencilLine />
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.deleteButton}
                      onClick={() => onDelete(item)}
                      aria-label={`删除 ${item.username}`}
                    >
                      <Trash2 />
                      删除
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
