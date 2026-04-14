import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/features/auth/api"
import { type LoginFormValues, loginSchema } from "@/features/auth/schemas"
import styles from "@/features/auth/components/loginForm/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

export default function LoginForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true)
      const response = await login(values)

      setSession({
        token: response.accessToken,
        user: response.user,
      })

      toast.success("登录成功")
      navigate(APP_ROUTES.articles, { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败")
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <span className={styles.badge}>Admin sign in</span>
        <CardTitle className={styles.title}>进入后台</CardTitle>
        <CardDescription className={styles.description}>
          使用管理员账号登录，继续写作、整理和发布内容。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <Label htmlFor="username">用户名</Label>
            <Input id="username" placeholder="输入管理员用户名" {...register("username")} />
            {errors.username ? <p className={styles.error}>{errors.username.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="输入登录密码"
              {...register("password")}
            />
            {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
          </div>

          <Button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className={styles.loader} /> : null}
            进入后台
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
