import LoginForm from "@/features/auth/components/loginForm"
import styles from "@/pages/login/index.module.css"

export default function LoginPage() {
  return (
    <section className={styles.page}>
      <LoginForm />
    </section>
  )
}
