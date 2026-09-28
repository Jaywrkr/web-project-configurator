import type { Brief, ComplexityLevel } from "./types";

const typePoints: Record<string, number> = { "Web corporativa": 10, "Catálogo": 15, "E-commerce": 25, "Landing page": 5, "Portal / sistema web": 30, "Rediseño de web existente": 12 };
const pagePoints: Record<string, number> = { "4–6": 3, "7–10": 6, "11–20": 10, "Más de 20": 15 };
const productPoints: Record<string, number> = { "11–30": 3, "31–100": 6, "101–500": 10, "Más de 500": 15 };
const integrationPoints: Record<string, number> = { "Google Analytics": 1, "WhatsApp": 1, "Formulario de contacto": 1, "CRM": 8, "ERP": 15, "API externa": 10, "Pagos en línea": 12 };
const contentPoints: Record<string, number> = { "Redacción de textos": 4, "Generación de imágenes": 3, "Fotografía profesional": 6, "Video": 8 };

export function calculateComplexity(brief: Brief): { score: number; level: ComplexityLevel } {
  let score = Math.max(0, ...brief.project_types.map((type) => typePoints[type] ?? 0)) + Math.max(0, brief.project_types.length - 1) * 5;
  score += pagePoints[brief.page_count] ?? 0;
  if (brief.project_types.includes("Catálogo") || brief.project_types.includes("E-commerce") || brief.sections.includes("Productos")) score += productPoints[brief.product_count] ?? 0;
  score += brief.admin_features.filter((item) => item !== "No necesito editar nada" && item !== "Crear nuevas páginas").length * 2;
  if (brief.admin_features.includes("Crear nuevas páginas")) score += 8;
  score += brief.integrations.reduce((total, item) => total + (integrationPoints[item] ?? 0), 0);
  score += brief.content_help.reduce((total, item) => total + (contentPoints[item] ?? 0), 0);
  score += brief.deadline === "Urgente" ? 15 : brief.deadline === "2–3 semanas" ? 8 : 0;
  const clamped = Math.min(100, Math.max(0, score));
  const level: ComplexityLevel = clamped < 25 ? "Baja" : clamped < 50 ? "Media" : clamped < 75 ? "Alta" : "Muy alta";
  return { score: clamped, level };
}
