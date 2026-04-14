import RegisterForm from "@/features/auth/components/registerForm"
import styles from "@/pages/register/index.module.css"

export default function RegisterPage() {
  return (
    <section className={styles.page}>
      <RegisterForm />
    </section>
  )
}
