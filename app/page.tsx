import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return <main className="home">
    <header className="home-header"><span className="brand">web<span>project</span><i>.</i></span></header>
    <section className="home-content">
      <span className="eyebrow">FORMULARIO DE PROYECTO WEB</span>
      <h1>Cuéntanos qué necesitas construir.</h1>
      <div className="home-details">
        <div><h2>Cómo usarlo</h2><p>Responde las preguntas paso a paso. Puedes volver atrás y tu avance se guarda en este dispositivo.</p></div>
        <div><h2>Qué obtendrás</h2><p>Al final revisarás un resumen de tus respuestas. Cuando lo envíes, recibiremos la información por correo para preparar tu cotización.</p></div>
      </div>
      <Link href="/brief" className="button button--dark home-start">Empezar formulario <ArrowUpRight size={18} /></Link>
    </section>
  </main>;
}
