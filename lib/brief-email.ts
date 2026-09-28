import type { Brief } from "./types";
import type { ComplexityLevel } from "./types";
import { formatUsd, type PriceEstimate } from "./pricing";

const value = (input: string | string[]) => Array.isArray(input) ? (input.length ? input.join(", ") : "No indicado") : (input || "No indicado");
const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

export function formatBriefEmail(brief: Brief, complexity: { score: number; level: ComplexityLevel }, estimate: PriceEstimate, reference: string) {
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
  const priceRows = estimate.items.map(({ label, amount }) => `${label}: ${formatUsd(amount)}`);
  const text = [
    "NUEVA SOLICITUD DE PROYECTO WEB", `Referencia: ${reference}`, "",
    `ESTIMADO PRELIMINAR: ${formatUsd(estimate.total)} USD`,
    ...priceRows, "",
    ...(estimate.reviewReasons.length ? ["PUNTOS PARA REVISAR", ...estimate.reviewReasons, ""] : []),
    ...groups.flatMap(([title, fields]) => [title, ...fields.map(([label, content]) => `${label}: ${value(content)}`), ""]),
    `COMPLEJIDAD INTERNA: ${complexity.score}/100 · ${complexity.level}`,
    "", "Cotización preliminar adjunta. Revisar alcance e importes antes de enviarla al cliente."
  ].join("\n");
  const detailSections = groups.map(([title, fields]) => `<tr><td colspan="2" style="padding:28px 0 9px;border-bottom:1px solid #dce0d8;color:#526547;font-size:11px;font-weight:700;letter-spacing:1.5px">${escapeHtml(title)}</td></tr>${fields.map(([label, content]) => `<tr><td style="width:175px;padding:9px 12px 9px 0;color:#6a716b;vertical-align:top;font-size:13px">${escapeHtml(label)}</td><td style="padding:9px 0;color:#1b211b;vertical-align:top;font-size:13px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value(content))}</td></tr>`).join("")}`).join("");
  const estimateRows = estimate.items.map(({ label, amount }) => `<tr><td style="padding:8px 0;color:#384138;font-size:13px">${escapeHtml(label)}</td><td style="padding:8px 0;text-align:right;color:#384138;font-size:13px;white-space:nowrap">${formatUsd(amount)}</td></tr>`).join("");
  const reviewList = estimate.reviewReasons.length ? `<div style="margin:26px 0;padding:18px 20px;background:#f5f4ed;border-left:3px solid #a0a878"><strong style="font-size:13px">Puntos por revisar</strong><ul style="padding-left:18px;margin:10px 0 0;color:#555e53;font-size:13px;line-height:1.6">${estimate.reviewReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></div>` : "";
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f3f4f0;font-family:Arial,Helvetica,sans-serif;color:#1b211b"><div style="max-width:680px;margin:0 auto;padding:28px 14px"><div style="background:#192019;color:#fff;padding:34px 36px"><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#bdd1a4">JAYWRKR / NUEVA SOLICITUD</div><h1 style="margin:15px 0 8px;font-size:29px;line-height:1.2">${escapeHtml(brief.company)}</h1><p style="margin:0;color:#d6ded0;font-size:14px">${escapeHtml(brief.project_types.join(" · "))}</p><p style="margin:16px 0 0;color:#afc3a4;font-size:11px">${escapeHtml(reference)}</p></div><div style="background:#fff;padding:34px 36px"><p style="margin:0 0 8px;color:#6a7469;font-size:11px;font-weight:700;letter-spacing:1.5px">ESTIMADO PRELIMINAR · USD</p><div style="font-size:38px;font-weight:700;letter-spacing:-1px">${formatUsd(estimate.total)}</div><p style="margin:8px 0 22px;color:#697368;font-size:13px">Complejidad: ${escapeHtml(complexity.level)} (${complexity.score}/100). Revisa el alcance antes de compartir la cotización.</p><table role="presentation" style="width:100%;border-collapse:collapse"><tbody>${estimateRows}<tr><td style="padding:14px 0;border-top:1px solid #dce0d8;font-weight:700">Total estimado</td><td style="padding:14px 0;border-top:1px solid #dce0d8;text-align:right;font-weight:700">${formatUsd(estimate.total)}</td></tr></tbody></table>${reviewList}<h2 style="margin:34px 0 0;font-size:19px">Respuestas del cliente</h2><table role="presentation" style="width:100%;border-collapse:collapse"><tbody>${detailSections}</tbody></table><p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #dce0d8;color:#697368;font-size:12px;line-height:1.5">La cotización preliminar está adjunta en PDF. Este correo se envió solo a tu dirección.</p></div></div></body></html>`;
  return { subject: `Brief ${reference} — ${brief.company.replace(/[\r\n]+/g, " ")}`, text, html };
}
