import type { Brief } from "./types";

export function hasProducts(brief: Brief) {
  return brief.project_type === "Catálogo" || brief.project_type === "E-commerce" || brief.sections.includes("Productos");
}

export function validateStep(step: number, brief: Brief): string | null {
  switch (step) {
    case 1:
      if (!brief.company.trim() || !brief.contact_name.trim()) return "Completa la empresa y el nombre de contacto.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) return "Ingresa un email válido.";
      return null;
    case 2: return brief.project_type ? null : "Elige el tipo de proyecto.";
    case 3:
      if (!brief.sections.length) return "Selecciona al menos una sección.";
      if (brief.sections.includes("Otra") && !brief.other_section.trim()) return "Especifica la otra sección.";
      return brief.page_count ? null : "Indica el número aproximado de páginas.";
    case 4:
      if (!brief.product_count) return "Indica la cantidad aproximada de productos.";
      if (!brief.product_features.length) return "Selecciona al menos un detalle del producto.";
      if (!brief.commerce_type) return "Elige qué podrá hacer el usuario.";
      if (brief.commerce_type === "Comprar en línea" && !brief.commerce_features.length) return "Selecciona al menos una función de compra.";
      return null;
    case 5: return brief.admin_features.length ? null : "Selecciona qué deseas administrar.";
    case 6: return brief.brand_status ? null : "Selecciona el estado de la marca.";
    case 7: return brief.content_help.length ? null : "Indica si necesitas ayuda con contenido.";
    case 8: return brief.integrations.some((item) => ["CRM", "ERP", "API externa", "Otro"].includes(item)) && !brief.integration_notes.trim() ? "Describe la integración especial." : null;
    case 9:
      if (!brief.domain_status || !brief.hosting_status || !brief.email_status) return "Responde las tres preguntas de infraestructura.";
      return brief.email_status === "Necesitamos correo corporativo" && !brief.email_accounts ? "Indica cuántas cuentas de correo necesitas." : null;
    case 10: return brief.deadline ? null : "Elige un plazo aproximado.";
    case 11: return brief.budget ? null : "Selecciona una opción de presupuesto.";
    default: return null;
  }
}
