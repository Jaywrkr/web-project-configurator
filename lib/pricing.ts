import type { Brief, ProjectType } from "./types";

export type PriceLine = { label: string; amount: number };
export type PriceEstimate = {
  currency: "USD";
  items: PriceLine[];
  total: number;
  reviewReasons: string[];
};

export const formatUsd = (amount: number) => `$${Math.round(amount).toLocaleString("en-US")}`;
const roundTen = (amount: number) => Math.round(amount / 10) * 10;

export type PricingConfig = {
  basePrice: Record<ProjectType, number>;
  additionalTypeRate: number;
  pagesCost: Record<string, number>;
  catalogCost: Record<string, number>;
  adminCost: number;
  newPagesCost: number;
  integrationCost: Record<string, number>;
  commerceCost: Record<string, number>;
  contentCost: Record<string, number>;
  urgencyRate: Record<string, number>;
};

// Tarifas internas aprobadas por jaywrkr. La cotización sigue siendo preliminar hasta revisar el alcance.
export const pricingConfig: PricingConfig = {
  basePrice: {
    "Landing page": 220,
    "Web corporativa": 420,
    "Catálogo": 580,
    "E-commerce": 900,
    "Portal / sistema web": 1400,
    "Rediseño de web existente": 350
  },
  additionalTypeRate: 0.35,
  pagesCost: { "1–3": 0, "4–6": 80, "7–10": 160, "11–20": 300, "Más de 20": 600 },
  catalogCost: { "1–10": 0, "11–30": 100, "31–100": 220, "101–500": 450, "Más de 500": 850 },
  adminCost: 20,
  newPagesCost: 80,
  integrationCost: {
    "WhatsApp": 0, "Formulario de contacto": 0, "Google Maps": 0,
    "Google Analytics": 30, "Google Search Console": 30, "Meta Pixel": 30,
    "CRM": 160, "ERP": 300, "Mailchimp": 70, "HubSpot": 160,
    "Pagos en línea": 180, "Redes sociales": 0, "Chat": 50, "API externa": 250
  },
  commerceCost: { "Cálculo de envío": 90, "Cupones": 60, "Cuentas de usuario": 120, "Variantes": 50, "Stock": 50 },
  contentCost: {
    "Redacción de textos": 80, "Corrección de textos": 40,
    "Generación de imágenes": 60, "Banco de imágenes": 40
  },
  urgencyRate: { "2–3 semanas": 0.15, "Urgente": 0.25 }
};

export function estimatePrice(brief: Brief, config = pricingConfig): PriceEstimate {
  const items: PriceLine[] = [];
  const reviewReasons: string[] = [];
  const add = (label: string, amount: number) => { if (amount > 0) items.push({ label, amount }); };

  const rankedTypes = [...brief.project_types].sort((a, b) => config.basePrice[b] - config.basePrice[a]);
  const primary = rankedTypes[0];
  if (primary) add(`Proyecto base: ${primary}`, config.basePrice[primary]);
  for (const type of rankedTypes.slice(1)) add(`Tipo adicional: ${type}`, roundTen(config.basePrice[type] * config.additionalTypeRate));
  if (brief.project_types.includes("Portal / sistema web")) reviewReasons.push("Portal o sistema web requiere estimación técnica individual.");
  if (brief.project_types.includes("Rediseño de web existente")) reviewReasons.push("El estado de la web actual requiere revisión.");

  add(`Extensión: ${brief.page_count} páginas`, config.pagesCost[brief.page_count] ?? 0);
  if (brief.page_count === "No lo sé") reviewReasons.push("Cantidad de páginas por definir.");

  const hasProducts = brief.project_types.includes("Catálogo") || brief.project_types.includes("E-commerce") || brief.sections.includes("Productos");
  if (hasProducts) {
    add(`Catálogo: ${brief.product_count} productos`, config.catalogCost[brief.product_count] ?? 0);
    if (brief.product_count === "No lo sé") reviewReasons.push("Cantidad de productos por definir.");
  }

  const modules = brief.admin_features.filter((item) => item !== "No necesito editar nada" && item !== "Crear nuevas páginas");
  add(`Administración: ${modules.length} módulos`, modules.length * config.adminCost);
  if (brief.admin_features.includes("Crear nuevas páginas")) add("Creación de páginas desde el panel", config.newPagesCost);

  const integrations = [...brief.integrations];
  if (brief.commerce_type === "Comprar en línea" && !integrations.includes("Pagos en línea")) integrations.push("Pagos en línea");
  for (const integration of integrations) add(`Integración: ${integration}`, config.integrationCost[integration] ?? 0);
  if (integrations.includes("Otro")) reviewReasons.push("Integración adicional por evaluar.");
  if (integrations.some((item) => ["CRM", "ERP", "API externa"].includes(item))) reviewReasons.push("El alcance de las integraciones especiales requiere revisión.");
  if (brief.commerce_type === "Comprar en línea" && !brief.project_types.includes("E-commerce")) reviewReasons.push("Compra en línea solicitada fuera de un proyecto E-commerce.");

  for (const feature of brief.product_features.filter((item) => ["Variantes", "Stock"].includes(item))) add(`Producto: ${feature}`, config.commerceCost[feature] ?? 0);
  for (const feature of brief.commerce_features) {
    if (feature === "Stock" && brief.product_features.includes("Stock")) continue;
    add(`Tienda: ${feature}`, config.commerceCost[feature] ?? 0);
  }
  for (const feature of brief.content_help) add(`Contenido: ${feature}`, config.contentCost[feature] ?? 0);
  if (brief.content_help.some((item) => ["Fotografía profesional", "Video"].includes(item))) reviewReasons.push("Producción de fotografía o video se cotiza aparte.");
  if (brief.brand_status === "Necesitamos definir el estilo visual" || brief.brand_status === "Queremos rediseñar completamente") reviewReasons.push("Diseño de identidad visual por definir.");
  if (brief.domain_status === "Necesitamos dominio" || brief.hosting_status !== "Ya tenemos hosting" || brief.email_status === "Necesitamos correo corporativo") reviewReasons.push("Dominio, hosting y correo corporativo se presupuestan por separado.");

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const urgencyRate = config.urgencyRate[brief.deadline] ?? 0;
  add(`Plazo: ${brief.deadline}`, roundTen(subtotal * urgencyRate));
  return { currency: "USD", items, total: items.reduce((sum, item) => sum + item.amount, 0), reviewReasons };
}
