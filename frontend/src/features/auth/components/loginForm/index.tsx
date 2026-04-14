import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { login } from "@/features/auth/api"
import {
  createLoginPayload,
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas"
import styles from "@/features/auth/components/loginForm/index.module.css"
import { PUBLIC_ROUTES } from "@/lib/constants"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

export default function LoginForm() {
  const navigate = useNavigate()
  const setSession = usePublicAuthStore((state) => state.setSession)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
      setErrorMessage(null)
      const response = await login(createLoginPayload(values))
      setSession({
        token: response.accessToken,
        user: response.user,
      })
      navigate(PUBLIC_ROUTES.home, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "登录失败")
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Reader sign in</span>
        <h1 className={styles.title}>登录前台账号</h1>
        <p className={styles.description}>登录后可以保存你的浏览身份，后续也能继续扩展评论和个人资料。</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>用户名</span>
          <input className={styles.input} placeholder="输入用户名" {...register("username")} />
          {errors.username ? <span className={styles.error}>{errors.username.message}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>密码</span>
          <input className={styles.input} type="password" placeholder="输入密码" {...register("password")} />
          {errors.password ? <span className={styles.error}>{errors.password.message}</span> : null}
        </label>

        {errorMessage ? <p className={styles.submitError}>{errorMessage}</p> : null}

        <Button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "登录中..." : "登录"}
        </Button>
      </form>

      <p className={styles.footer}>
        还没有账号？
        <Link className={styles.link} to={PUBLIC_ROUTES.register}>
          去注册
        </Link>
      </p>
    </section>
  )
}
