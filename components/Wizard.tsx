"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { emptyBrief, type Brief, type ProjectType } from "@/lib/types";
import { projectTypes } from "@/lib/options";
import { hasProducts, validateStep } from "@/lib/validation";
import { Progress } from "./Progress";
import { StepContent } from "./StepContent";
import { StepNavigation } from "./StepNavigation";

const STORAGE_KEY = "web-project-configurator-draft-v1";
const titles: Record<number, [string, string]> = {
  1: ["Primero, hablemos de ti.", "Los datos necesarios para poder responder a tu solicitud."],
  2: ["¿Qué tienes en mente?", "Selecciona todos los tipos que describan tu proyecto."],
  3: ["Démosle forma.", "Piensa en las páginas que tendrá tu web."],
  4: ["Hablemos de productos.", "El tamaño y las funciones del catálogo cambian el alcance."],
  5: ["Tu web, en tus manos.", "Define qué contenido debería ser editable por tu equipo."],
  6: ["Una identidad clara.", "La marca y las referencias nos ayudan a entender la dirección visual."],
  7: ["¿Con qué contamos?", "Así sabremos qué contenido hace falta preparar."],
  8: ["Todo conectado.", "Selecciona los servicios con los que deberá integrarse la web."],
  9: ["La base técnica.", "Dominio, hosting y correo se consideran por separado."],
  10: ["Pongamos una fecha.", "Un plazo realista ayuda a planificar bien el proyecto."],
  11: ["Contexto de inversión.", "Tu presupuesto nos orienta, pero no define automáticamente el precio."],
  12: ["Una última cosa.", "Comparte cualquier detalle que aún no hayamos preguntado."],
  13: ["Así se ve tu proyecto.", "Revisa los detalles antes de enviar la solicitud."]
};

export function Wizard() {
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [step, setStep] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { brief?: Partial<Brief>; step?: number };
        if (parsed.brief && typeof parsed.brief === "object") {
          const previous = parsed.brief as Partial<Brief> & { project_type?: string };
          const selected: unknown[] = Array.isArray(previous.project_types) ? previous.project_types : previous.project_type ? [previous.project_type] : [];
          setBrief({ ...emptyBrief, ...previous, project_types: selected.filter((type): type is ProjectType => typeof type === "string" && projectTypes.some((option) => option === type)) });
        }
        if (typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 13) setStep(parsed.step);
      }
    } catch { try { localStorage.removeItem(STORAGE_KEY); } catch {} }
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded && !sent) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ brief, step })); } catch {} } }, [brief, step, loaded, sent]);

  const steps = hasProducts(brief) ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] : [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const currentIndex = Math.max(0, steps.indexOf(step));
  const effectiveStep = steps[currentIndex];
  const update = <K extends keyof Brief>(key: K, value: Brief[K]) => { setBrief((previous) => ({ ...previous, [key]: value })); setError(null); };
  const navigate = (next: number) => { setStep(next); setError(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function next() {
    const issue = validateStep(effectiveStep, brief);
    if (issue) { setError(issue); return; }
    if (effectiveStep !== 13) { navigate(steps[currentIndex + 1]); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/briefs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brief) });
      if (!response.ok) throw new Error("No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.");
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setSent(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Ocurrió un error al enviar la solicitud."); }
    finally { setBusy(false); }
  }

  function restart() {
    if (!window.confirm("¿Empezar de nuevo? Se borrará el progreso guardado en este dispositivo.")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch {} setBrief(emptyBrief); setStep(1); setSent(false); setError(null);
  }

  if (!loaded) return <main className="wizard-shell" aria-busy="true" />;
  if (sent) return <main className="wizard-shell"><div className="success-card"><span className="eyebrow">SOLICITUD RECIBIDA</span><h1>Gracias por contarnos tu idea.</h1><p>Tu brief se ha enviado correctamente. Ya tenemos un punto de partida claro para revisar el alcance.</p><Link href="/" className="button button--dark">Volver al inicio <ArrowUpRight size={18} /></Link></div></main>;

  return <main className="wizard-shell"><header className="wizard-top"><Link href="/" className="brand">web<span>project</span><i>.</i></Link><button type="button" onClick={restart} className="quiet-button">Empezar de nuevo</button></header>
    <div className="wizard-layout"><aside className="wizard-aside"><span className="eyebrow">CONFIGURADOR DE PROYECTOS</span><p>Un buen proyecto empieza con buenas preguntas.</p><div className="aside-rule" /><span className="aside-foot">Toma unos minutos. Tu progreso se guarda en este dispositivo.</span></aside>
      <div className="wizard-main"><Progress current={currentIndex + 1} total={steps.length} /><div className="step-heading" key={effectiveStep}><span className="eyebrow">{effectiveStep === 13 ? "REVISIÓN FINAL" : `PASO ${String(currentIndex + 1).padStart(2, "0")}`}</span><h1>{titles[effectiveStep][0]}</h1><p>{titles[effectiveStep][1]}</p></div>
        <div className="step-body" key={`body-${effectiveStep}`}><StepContent step={effectiveStep} brief={brief} update={update} /></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <StepNavigation isFirst={currentIndex === 0} isLast={effectiveStep === 13} onBack={() => navigate(steps[currentIndex - 1])} onNext={next} busy={busy} />
      </div></div></main>;
}
