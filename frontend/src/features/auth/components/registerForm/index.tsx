import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { register as registerUser } from "@/features/auth/api"
import {
  createRegisterPayload,
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas"
import styles from "@/features/auth/components/registerForm/index.module.css"
import { PUBLIC_ROUTES } from "@/lib/constants"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

export default function RegisterForm() {
  const navigate = useNavigate()
  const setSession = usePublicAuthStore((state) => state.setSession)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      nickname: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      const response = await registerUser(createRegisterPayload(values))
      setSession({
        token: response.accessToken,
        user: response.user,
      })
      navigate(PUBLIC_ROUTES.home, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "注册失败")
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Create account</span>
        <h1 className={styles.title}>注册前台账号</h1>
        <p className={styles.description}>创建一个普通用户账号，后续就能用它维护自己的阅读身份。</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>用户名</span>
          <input className={styles.input} placeholder="输入用户名" {...register("username")} />
          {errors.username ? <span className={styles.error}>{errors.username.message}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>邮箱</span>
          <input className={styles.input} placeholder="输入邮箱" {...register("email")} />
          {errors.email ? <span className={styles.error}>{errors.email.message}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>密码</span>
          <input className={styles.input} type="password" placeholder="设置密码" {...register("password")} />
          {errors.password ? <span className={styles.error}>{errors.password.message}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>昵称</span>
          <input className={styles.input} placeholder="可选的显示名称" {...register("nickname")} />
          {errors.nickname ? <span className={styles.error}>{errors.nickname.message}</span> : null}
        </label>

        {errorMessage ? <p className={styles.submitError}>{errorMessage}</p> : null}

        <Button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "注册中..." : "注册"}
        </Button>
      </form>

      <p className={styles.footer}>
        已经有账号？
        <Link className={styles.link} to={PUBLIC_ROUTES.login}>
          去登录
        </Link>
      </p>
    </section>
  )
}
