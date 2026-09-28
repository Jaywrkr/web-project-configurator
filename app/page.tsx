import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Home() {
  return <main className="home"><header className="home-header"><span className="brand">web<span>project</span><i>.</i></span><span className="header-note">UNA FORMA MÁS CLARA DE EMPEZAR</span></header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="status-dot" /> BRIEF DE PROYECTO WEB</span><h1>Define tu web<br />sin dejar <em>cabos sueltos.</em></h1><p>Te hacemos las preguntas necesarias para entender bien el alcance antes de cotizar.</p><Link href="/brief" className="button button--dark button--hero">Empezar <ArrowUpRight size={20} /></Link><span className="hero-foot">Un proceso simple. Un proyecto mejor definido.</span></div><div className="hero-graphic" aria-hidden="true"><div className="graphic-index">01 — 13</div><div className="graphic-card card-back"><span>ESTRUCTURA</span><div className="graphic-line" /><div className="graphic-line short" /></div><div className="graphic-card card-front"><span>EL PUNTO DE PARTIDA</span><strong>Tu idea,<br />con claridad<span>.</span></strong><div className="graphic-progress"><i /></div><small>UN PASO A LA VEZ</small></div><div className="graphic-caption">DE LA IDEA AL ALCANCE <ArrowDownRight size={17} /></div></div></section>
    <footer className="home-footer"><span>01 / CONVERSAMOS</span><span>02 / DEFINIMOS</span><span>03 / CONSTRUIMOS</span></footer>
  </main>;
}
