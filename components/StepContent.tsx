import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Brief } from "@/lib/types";
import * as options from "@/lib/options";
import { Field, LongField, MultiQuestion, SingleQuestion } from "./QuestionField";
import { Summary } from "./Summary";

type Props = { step: number; brief: Brief; update: <K extends keyof Brief>(key: K, value: Brief[K]) => void };

function ReferenceUrls({ urls, onChange }: { urls: string[]; onChange: (urls: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  return <section className="question"><h2>¿Tienen sitios web de referencia?</h2><p className="question__hint">Agrega hasta 5 enlaces. Nos ayudan a entender el estilo que buscas.</p>
    <div className="url-entry"><input aria-label="URL de referencia" type="url" value={draft} placeholder="https://ejemplo.com" onChange={(event) => { setDraft(event.target.value); setError(""); }} disabled={urls.length >= 5} /><button type="button" className="button button--outline" disabled={urls.length >= 5} onClick={() => {
      try { const parsed = new URL(draft); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); if (!urls.includes(parsed.href)) onChange([...urls, parsed.href]); setDraft(""); setError(""); }
      catch { setError("Ingresa una URL válida que comience con https://"); }
    }}><Plus size={16} /> Agregar</button></div>
    {error && <p className="field-error" role="alert">{error}</p>}
    {urls.length > 0 && <ul className="url-list">{urls.map((url) => <li key={url}><span>{url}</span><button type="button" aria-label={`Quitar ${url}`} onClick={() => onChange(urls.filter((item) => item !== url))}><X size={16} /></button></li>)}</ul>}
  </section>;
}

export function StepContent({ step, brief, update }: Props) {
  switch (step) {
    case 1: return <div className="fields"><Field label="Nombre de empresa" value={brief.company} onChange={(v) => update("company", v)} maxLength={120} placeholder="Tu empresa" /><Field label="Nombre de contacto" value={brief.contact_name} onChange={(v) => update("contact_name", v)} maxLength={120} placeholder="Tu nombre" /><Field label="Email" type="email" value={brief.email} onChange={(v) => update("email", v)} maxLength={254} placeholder="nombre@empresa.com" /><Field label="Teléfono" type="tel" optional value={brief.phone} onChange={(v) => update("phone", v)} maxLength={40} placeholder="+593 ..." /></div>;
    case 2: return <MultiQuestion title="¿Qué necesitas construir?" options={options.projectTypes} value={brief.project_types} onChange={(v) => update("project_types", v as Brief["project_types"])} />;
    case 3: return <><MultiQuestion title="¿Qué secciones debería tener la web?" options={options.sections} value={brief.sections} onChange={(v) => update("sections", v)} />{brief.sections.includes("Otra") && <Field label="¿Cuál otra sección?" value={brief.other_section} onChange={(v) => update("other_section", v)} maxLength={120} placeholder="Describe la sección" />}<SingleQuestion title="¿Cuántas páginas o secciones aproximadamente tendrá?" options={options.pageCounts} value={brief.page_count} onChange={(v) => update("page_count", v)} /></>;
    case 4: return <><SingleQuestion title="¿Cuántos productos aproximadamente?" options={options.productCounts} value={brief.product_count} onChange={(v) => update("product_count", v)} /><MultiQuestion title="¿Qué necesita cada producto?" options={options.productFeatures} value={brief.product_features} onChange={(v) => update("product_features", v)} /><SingleQuestion title="¿Qué debe poder hacer el usuario?" options={options.commerceTypes} value={brief.commerce_type} onChange={(v) => update("commerce_type", v)} />{brief.commerce_type === "Comprar en línea" && <MultiQuestion title="¿Qué funciones necesitará la compra?" options={options.commerceFeatures} value={brief.commerce_features} onChange={(v) => update("commerce_features", v)} />}</>;
    case 5: return <MultiQuestion title="¿Qué quieres poder modificar después sin depender del desarrollador?" options={options.adminFeatures} value={brief.admin_features} onChange={(v) => update("admin_features", v)} exclusive="No necesito editar nada" />;
    case 6: return <><SingleQuestion title="¿Cuál es la situación actual de la marca?" options={options.brandStatuses} value={brief.brand_status} onChange={(v) => update("brand_status", v)} /><ReferenceUrls urls={brief.reference_urls} onChange={(v) => update("reference_urls", v)} /></>;
    case 7: return <><MultiQuestion title="¿Qué contenido ya tienen?" options={options.availableContent} value={brief.available_content} onChange={(v) => update("available_content", v)} /><MultiQuestion title="¿Necesitan ayuda con contenido?" options={options.contentHelp} value={brief.content_help} onChange={(v) => update("content_help", v)} exclusive="No" /></>;
    case 8: return <><MultiQuestion title="¿Con qué debería conectarse la web?" options={options.integrations} value={brief.integrations} onChange={(v) => update("integrations", v)} />{brief.integrations.some((item) => ["CRM", "ERP", "API externa", "Otro"].includes(item)) && <LongField label="Cuéntanos qué sistema o servicio habría que conectar" value={brief.integration_notes} onChange={(v) => update("integration_notes", v)} maxLength={1000} placeholder="Nombre del sistema y lo que debería hacer la conexión" />}</>;
    case 9: return <><SingleQuestion title="Dominio" options={options.domainStatuses} value={brief.domain_status} onChange={(v) => update("domain_status", v)} /><SingleQuestion title="Hosting web" options={options.hostingStatuses} value={brief.hosting_status} onChange={(v) => update("hosting_status", v)} /><SingleQuestion title="Correo corporativo" options={options.emailStatuses} value={brief.email_status} onChange={(v) => update("email_status", v)} /><p className="inline-note">El correo corporativo se considera un servicio independiente del hosting web.</p>{brief.email_status === "Necesitamos correo corporativo" && <SingleQuestion title="¿Cuántas cuentas de correo aproximadamente?" options={options.emailAccounts} value={brief.email_accounts} onChange={(v) => update("email_accounts", v)} />}</>;
    case 10: return <><SingleQuestion title="¿Cuándo quieren tener la web lista?" options={options.deadlines} value={brief.deadline} onChange={(v) => update("deadline", v)} /><Field label="¿Existe una fecha específica?" optional type="date" value={brief.deadline_date} onChange={(v) => update("deadline_date", v)} /></>;
    case 11: return <LongField label="¿Hay algo importante que debamos saber?" value={brief.notes} onChange={(v) => update("notes", v)} placeholder="Contexto, objetivos, dudas o cualquier detalle importante…" />;
    case 12: return <Summary brief={brief} />;
    default: return null;
  }
}
