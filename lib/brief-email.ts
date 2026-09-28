import type { Brief } from "./types";
import type { ComplexityLevel } from "./types";

const value = (input: string | string[]) => Array.isArray(input) ? (input.length ? input.join(", ") : "No indicado") : (input || "No indicado");

export function formatBriefEmail(brief: Brief, complexity: { score: number; level: ComplexityLevel }) {
  const groups: [string, [string, string | string[]][]][] = [
    ["CLIENTE", [["Empresa", brief.company], ["Contacto", brief.contact_name], ["Email", brief.email], ["Teléfono", brief.phone]]],
    ["PROYECTO Y ESTRUCTURA", [["Tipos", brief.project_types], ["Secciones", brief.sections], ["Otra sección", brief.other_section], ["Cantidad de páginas", brief.page_count]]],
    ["PRODUCTOS Y COMERCIO", [["Cantidad de productos", brief.product_count], ["Datos de cada producto", brief.product_features], ["Acción del visitante", brief.commerce_type], ["Funciones de compra", brief.commerce_features]]],
    ["ADMINISTRACIÓN Y DISEÑO", [["Contenido editable", brief.admin_features], ["Estado de la marca", brief.brand_status], ["Sitios de referencia", brief.reference_urls]]],
    ["CONTENIDO", [["Contenido disponible", brief.available_content], ["Ayuda requerida", brief.content_help]]],
    ["INTEGRACIONES", [["Integraciones", brief.integrations], ["Detalles de integración", brief.integration_notes]]],
    ["INFRAESTRUCTURA", [["Dominio", brief.domain_status], ["Hosting web", brief.hosting_status], ["Correo corporativo (servicio independiente)", brief.email_status], ["Cuentas de correo", brief.email_accounts]]],
    ["PLANIFICACIÓN", [["Plazo", brief.deadline], ["Fecha específica", brief.deadline_date], ["Comentarios", brief.notes]]]
  ];
  const text = ["NUEVA SOLICITUD DE PROYECTO WEB", "", ...groups.flatMap(([title, fields]) => [title, ...fields.map(([label, content]) => `${label}: ${value(content)}`), ""]), `COMPLEJIDAD INTERNA: ${complexity.score}/100 · ${complexity.level}`].join("\n");
  return { subject: `Nuevo brief web — ${brief.company.replace(/[\r\n]+/g, " ")}`, text };
}
