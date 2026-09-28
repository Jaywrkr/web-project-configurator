import Link from "next/link";
import { signIn } from "./actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="login-shell"><header className="wizard-top"><Link href="/" className="brand">web<span>project</span><i>.</i></Link><span className="eyebrow">ÁREA INTERNA</span></header>
    <section className="login-card"><span className="eyebrow">ACCESO PRIVADO</span><h1>Bienvenido de nuevo.</h1><p>Ingresa con tu cuenta de administrador para revisar las solicitudes.</p>
      <form action={signIn} className="fields"><label className="field"><span className="field__label">Email</span><input name="email" type="email" autoComplete="username" required /></label><label className="field"><span className="field__label">Contraseña</span><input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error" role="alert">No pudimos validar el acceso. Revisa tus datos e inténtalo de nuevo.</p>}<button type="submit" className="button button--dark">Entrar →</button></form>
    </section></main>;
}
