import { calculateComplexity } from "@/lib/complexity";
import type { Brief, ComplexityLevel } from "@/lib/types";
import { ComplexityMeter } from "./ComplexityMeter";

const show = (value: string | string[]) => Array.isArray(value) ? (value.length ? value.join(", ") : "—") : (value || "—");

export function Summary({ brief, admin = false, storedComplexity }: { brief: Brief; admin?: boolean; storedComplexity?: { score: number; level: ComplexityLevel } }) {
  const complexity = storedComplexity ?? calculateComplexity(brief);
  const rows: { title: string; fields: [string, string | string[]][] }[] = [
    { title: "01 / Cliente", fields: [["Empresa", brief.company], ["Contacto", brief.contact_name], ["Email", brief.email], ["Teléfono", brief.phone]] },
    { title: "02 / Proyecto", fields: [["Tipo", brief.project_type], ["Secciones", [...brief.sections.filter((s) => s !== "Otra"), ...(brief.other_section ? [brief.other_section] : [])]], ["Páginas", brief.page_count]] },
    { title: "03 / Catálogo", fields: [["Productos", brief.product_count], ["Detalles por producto", brief.product_features], ["Experiencia", brief.commerce_type], ["Funciones de compra", brief.commerce_features]] },
    { title: "04 / Administración y diseño", fields: [["Contenido editable", brief.admin_features], ["Identidad visual", brief.brand_status], ["Referencias", brief.reference_urls]] },
    { title: "05 / Contenido", fields: [["Contenido disponible", brief.available_content], ["Ayuda requerida", brief.content_help]] },
    { title: "06 / Integraciones", fields: [["Conexiones", brief.integrations], ["Detalles", brief.integration_notes]] },
    { title: "07 / Infraestructura", fields: [["Dominio", brief.domain_status], ["Hosting web", brief.hosting_status], ["Correo corporativo (servicio independiente)", brief.email_status], ["Cuentas de correo", brief.email_accounts]] },
    { title: "08 / Planificación", fields: [["Plazo", brief.deadline], ["Fecha específica", brief.deadline_date], ["Presupuesto orientativo", brief.budget], ["Comentarios", brief.notes]] }
  ];
  return <div className="summary"><ComplexityMeter {...complexity} showScore={admin} />
    {rows.map(({ title, fields }) => <section className="summary-section" key={title}><h3>{title}</h3><dl>{fields.filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value)).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{show(value)}</dd></div>)}</dl></section>)}
  </div>;
}
